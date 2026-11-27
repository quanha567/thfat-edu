import { env } from "../../config/env";
import { createModuleLogger } from "../../config/logger";

const nimLogger = createModuleLogger("nvidia-nim");

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export type TNimMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

export type TNimChatOptions = {
  model: string;
  messages: TNimMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
  stream?: boolean;
  onToken?: (chunk: string) => void;
  /** Huỷ request (kể cả khi đang stream) khi người dùng chủ động dừng tác vụ. */
  signal?: AbortSignal;
};

export type TExtractSectionOptions = {
  sectionType: "true_false" | "group_mcq" | "matching" | "short_answer";
  markdownContent: string;
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
};

function extractTokenFromSseLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith("data:") || trimmed === "data: [DONE]") {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed.slice(5).trim()) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };

    return parsed.choices?.[0]?.delta?.content ?? "";
  } catch {
    return "";
  }
}

async function readSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onToken?: (chunk: string) => void,
): Promise<string> {
  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const token = extractTokenFromSseLine(line);
      if (!token) continue;

      fullContent += token;
      onToken?.(token);
    }
  }

  if (buffer.trim()) {
    const token = extractTokenFromSseLine(buffer);
    if (token) {
      fullContent += token;
      onToken?.(token);
    }
  }

  return fullContent;
}

export class NvidiaNimService {
  private getApiKey(): string {
    const key = env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
    if (!key) {
      throw new Error("NVIDIA_API_KEY is not configured in environment variables.");
    }

    return key;
  }

  public async chatCompletion(options: TNimChatOptions): Promise<string> {
    const startedAt = performance.now();
    const fields = { service: "nvidia-nim", operation: "chatCompletion", model: options.model };

    try {
      const result = await this.executeChatCompletion(options);

      nimLogger.info(
        { ...fields, outcome: "success", durationMs: Math.round(performance.now() - startedAt) },
        "external call completed",
      );

      return result;
    } catch (error) {
      nimLogger.error(
        {
          ...fields,
          outcome: "failure",
          durationMs: Math.round(performance.now() - startedAt),
          err: error,
        },
        "external call failed",
      );

      throw error;
    }
  }

  private async executeChatCompletion(options: TNimChatOptions): Promise<string> {
    const apiKey = this.getApiKey();

    const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      signal: options.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.1,
        top_p: options.top_p ?? 0.95,
        max_tokens: options.max_tokens ?? 4096,
        ...(options.response_format ? { response_format: options.response_format } : {}),
        stream: Boolean(options.stream),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`NVIDIA NIM API Error [${res.status}]: ${errBody}`);
    }

    if (options.stream && res.body) {
      return readSseStream(res.body.getReader(), options.onToken);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error("No content received from NVIDIA NIM API.");
    }

    return rawContent;
  }

  public async parseDocumentPage(base64Png: string): Promise<string> {
    const imageUrl = base64Png.startsWith("data:")
      ? base64Png
      : `data:image/png;base64,${base64Png}`;

    return this.chatCompletion({
      model: "nvidia/nemotron-parse-2.0",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "</s><s><predict_bbox><predict_classes><output_markdown><predict_text_in_pic>",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      temperature: 0.0,
      max_tokens: 2048,
    });
  }

  public async extractSectionContent(options: TExtractSectionOptions): Promise<string> {
    const { markdownContent, onChunk, signal } = options;
    const model = "nvidia/nemotron-3-ultra-550b-a55b";

    const systemPrompt = `You are an expert OCR & extraction engine for Vietnamese Chemistry and Science exams.
Extract ALL questions belonging to this section into a strict JSON object: {"questions": [...]}.
Do NOT summarize, do NOT skip any questions, do NOT solve the questions.

Schema for each question:
{
  "orderIndex": 1,
  "contextContent": "Đoạn văn dẫn chung hoặc ngữ cảnh bài đọc dùng chung cho các câu hỏi",
  "imageUrl": null, // If question contains [HÌNH_ẢNH: IMAGE_PAGE_X_Y], set to "IMAGE_PAGE_X_Y", else null
  "options": null, // Dành riêng cho Phần III (danh sách lựa chọn đích ở cột B)
  "subItems": [
    {
      "orderIndex": 1,
      "label": "Câu 10", // hoặc "1", "a"
      "content": "Nội dung câu hỏi con hoặc phát biểu",
      "options": ["...", "...", "...", "..."], // Bắt buộc cho Phần II (4 phương án sạch không tiền tố A, B, C, D). null cho Phần I, III, IV
      "correctAnswer": null,
      "points": "1.50", // "1.50" cho Phần I và III; "6.00" cho Phần II và IV
      "explanation": null
    }
  ]
}

CRITICAL RULES FOR CHEMISTRY & MATH (KaTeX):
1. Wrap all chemical formulas, reaction equations, ion charges, states, and concentrations in $\\ce{...}$.
   Examples: $\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$, $\\ce{Cu^{2+}}$, $\\ce{H2SO4 0,1 M}$, $\\ce{Al(OH)3 v}$, $\\ce{H2 ^}$.
2. Wrap all mathematical expressions, variables, exponents, and Greek symbols in inline $...$ or block $$...$$.
   Examples: $\\Delta_r H_{298}^0$, $10^{-3}$, $x^2 + y = 5$, $\\alpha$, $\\beta$, $\\frac{a}{b}$.
3. DO NOT wrap ordinary Vietnamese words or letter labels in math mode!
   Examples: Write "chất A", "dung dịch B", "thí nghiệm 1", "kim loại M" (NEVER write "$A$", "$B$", "$M$").
4. SINGLE BACKSLASH ONLY: Always output chemical formulas with a single LaTeX backslash: "$\\ce{...}". NEVER output multiple backslashes (like "\\\\ce" or "\\\\\\ce"), as "\\\\" creates accidental line breaks in KaTeX!

CRITICAL RULES FOR MARKDOWN & LAYOUT:
1. Preserve clean Markdown formatting in contextContent and content.
2. Separate distinct paragraphs or statements with two newlines (\\n\\n). Do NOT merge distinct lines into a single run-on sentence.
3. If there is a data table in the exam, format it strictly as a Markdown table:
   | Thí nghiệm | Thuốc thử | Hiện tượng |
   |---|---|---|
   | ... | ... | ... |
4. Preserve lists with '- ' or '1. ', '2. '.

IMAGE ATTACHMENT RULES:
1. If the question context or content has an image placeholder tag [HÌNH_ẢNH: IMAGE_PAGE_X_Y], set "imageUrl": "IMAGE_PAGE_X_Y" on that question.
2. Remove the raw "[HÌNH_ẢNH: ...]" string from contextContent/content so it does not appear as raw text.

EXAM SECTION RULES:
- If this is Phần I (Đúng/Sai):
  * "contextContent": ONLY contains the introductory sentence (e.g. "Cho các phát biểu sau về hợp chất X:").
  * NEVER dump a "| Phát biểu | Đúng | Sai |" table into contextContent.
  * "subItems": Must have exactly 4 subItems corresponding to statements a, b, c, d (or 1, 2, 3, 4), with each subItem.content containing that single statement.
  * "subItems": Must have exactly 4 subItems corresponding to statements a, b, c, d (or 1, 2, 3, 4), with each subItem.content containing that single statement and "points": "1.50".

- If this is Phần II (Trắc nghiệm phương án nhiều lựa chọn / Chùm câu hỏi theo ngữ cảnh):
  * DETECT COMMON PASSAGES: Look for reading passages, background text, or preambles (e.g. "Đọc nội dung sau và trả lời các câu hỏi từ X đến Y").
  * GROUP all child questions sharing the same passage into ONE question object:
    - "contextContent": Put ONLY the shared reading passage / background text here (e.g. "Đọc nội dung sau và trả lời các câu hỏi từ 10 đến 12.\n\nChất hữu cơ A và B là đồng phân..."). DO NOT append any individual question sentence or question options into contextContent!
    - "subItems": Array of child questions belonging to this passage (e.g. Câu 10, Câu 11, Câu 12):
      * "orderIndex": 1, 2, 3...
      * "label": "Câu 10", "Câu 11", "Câu 12" (or "10", "11", "12")
      * "content": ONLY the specific question sentence for this child question (e.g. "Mỗi mắt xích trong polymer X có bao nhiêu nguyên tử carbon?" or "Cho chất hữu cơ B tác dụng với lượng dư dung dịch bromine.\nHiện tượng quan sát được là:"). NEVER duplicate the shared reading passage in content!
      * "options": Array of EXACTLY 4 choices for this child question. Strip the "A.", "B.", "C.", "D." prefix (e.g. ["2", "3", "4", "5"] or ["Có kết tủa trắng xuất hiện.", ...]).
      * "correctAnswer": "A", "B", "C", or "D" (or null if not specified).
      * "points": "6.00"
  * If a multiple-choice question is standalone (no shared passage with other questions):
    - "contextContent": Leave empty or put any general preamble.
    - "subItems": Exactly 1 child question with its specific content and 4 clean options.
    - "subItems": Exactly 1 child question with its specific content, 4 clean options, and "points": "6.00".

- If this is Phần III (Ghép hợp / Matching):
  * "contextContent": ONLY contains the general background passage or preamble (e.g. "Câu 16: (ThFat) Cho các phát biểu sau về các chất khí:").
  * CRITICAL: NEVER put the matching table ("| Yêu cầu | Giá trị |", "| Thí nghiệm | Hiện tượng |"), the numbered statements 1, 2, 3, 4, the options A, B, C..., or "Trả lời: 1-...; 2-..." into contextContent!
  * "options": Put ALL target candidate choices from Column B / Column 2 ONCE at the question level (e.g. ["A. $\\ce{N2}$", "B. $\\ce{NH3}$", "C. $\\ce{NO}$", "D. $\\ce{NO2}$", "E. $\\ce{N2O}$", "F. $\\ce{N2O5}$"]). DO NOT duplicate "options" inside subItems!
  * "subItems": Contains the statements from Column A / Column 1 (usually 4 statements 1, 2, 3, 4):
    - "orderIndex": 1, 2, 3, 4
    - "label": "1", "2", "3", "4"
    - "content": The statement/requirement text from Column A / Column 1.
    - "correctAnswer": null
    - "points": "1.50"

- If this is Phần IV (Tự luận ngắn):
  * Extract all calculation and short answer questions.
  * Each question has exactly ONE answer box, so output exactly 1 subItem per question with "points": "6.00".
  * "contextContent": MUST contain the COMPLETE question text exactly as printed (the full statement, every numbered sentence/statement such as (1), (2), ..., data, tables, and the final ask such as "Có bao nhiêu phát biểu đúng?"). NEVER leave it empty and NEVER output only a label like "Câu 5".
  * "subItems[0].content": MUST be an empty string "" (do NOT repeat the question text here).
  * "subItems[0].label": "1". "subItems[0].options": null. "subItems[0].correctAnswer": null.

- Output ONLY valid JSON starting with {"questions": [ ... ]}.`;

    const response = await this.chatCompletion({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: markdownContent },
      ],
      temperature: 0.0,
      max_tokens: 8192,
      stream: Boolean(onChunk),
      onToken: onChunk,
      signal,
      response_format: { type: "json_object" },
    });

    return response;
  }

  public async solveExamQuestion(input: {
    sectionType: "true_false" | "group_mcq" | "matching" | "short_answer";
    question: {
      contextContent: string;
      imageUrl?: string | null;
      subItems: Array<{
        orderIndex: number;
        label: string;
        content: string;
        options?: string[] | null;
      }>;
    };
  }): Promise<{
    subItems: Array<{
      orderIndex: number;
      label: string;
      correctAnswer: string;
      acceptableAnswers?: string[] | null;
      explanation?: string | null;
    }>;
  }> {
    const rawImageUrl =
      input.question.imageUrl?.trim() ||
      extractFirstMarkdownImageUrl(input.question.contextContent);
    const hasValidImage = Boolean(
      rawImageUrl &&
      (rawImageUrl.startsWith("http://") ||
        rawImageUrl.startsWith("https://") ||
        rawImageUrl.startsWith("data:image/")),
    );

    const model = hasValidImage
      ? "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"
      : "nvidia/nemotron-3-ultra-550b-a55b";

    const systemPrompt = `You are an expert exam solver and master teacher for Vietnamese High School Science exams (Chemistry, Math, Physics - CT GDPT 2018).
Solve the provided question accurately and deduce the exact correct answer for each sub-item.

Section Type Rules:
1. "true_false":
   - For EACH sub-item statement (a, b, c, d), determine whether it is scientifically TRUE or FALSE.
   - "correctAnswer" MUST be strictly either "Đúng" or "Sai".
2. "group_mcq":
   - For EACH sub-item, choose the correct multiple-choice option.
   - "correctAnswer" MUST be strictly one of: "A", "B", "C", "D".
3. "matching":
   - For EACH sub-item in Column A, match with the correct option letter in Column B.
   - "correctAnswer" MUST be strictly one of: "A", "B", "C", "D", "E", "F".
4. "short_answer":
   - Compute or determine the exact numerical or text answer.
   - "correctAnswer" must be the canonical answer (e.g. "0.25", "CO2", "4").
   - "acceptableAnswers" must be an array of equivalent representations (e.g. ["1/4", "0,25"]).

Output MUST be a strict JSON object with this format:
{
  "subItems": [
    {
      "orderIndex": 0,
      "label": "a",
      "correctAnswer": "Đúng",
      "acceptableAnswers": null,
      "explanation": "Giải thích ngắn gọn lý do đúng/sai hoặc công thức"
    }
  ]
}
Output ONLY valid JSON.`;

    const userPromptText = `Phần thi: ${input.sectionType}
Ngữ cảnh đề bài:
${input.question.contextContent}

Danh sách các ý / tiểu mục cần giải:
${JSON.stringify(input.question.subItems, null, 2)}`;

    const userContent: TNimMessage["content"] =
      hasValidImage && rawImageUrl
        ? [
            { type: "text", text: userPromptText },
            { type: "image_url", image_url: { url: rawImageUrl } },
          ]
        : userPromptText;

    let rawResponse: string;
    try {
      rawResponse = await this.chatCompletion({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });
    } catch (primaryErr) {
      // Fallback to ultra 550b text-only if multimodal model fails
      if (hasValidImage) {
        nimLogger.warn(
          { err: primaryErr, fallbackModel: "nvidia/nemotron-3-ultra-550b-a55b" },
          "multimodal model failed, falling back to text-only model",
        );

        rawResponse = await this.chatCompletion({
          model: "nvidia/nemotron-3-ultra-550b-a55b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPromptText },
          ],
          temperature: 0.1,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        });
      } else {
        throw primaryErr;
      }
    }

    try {
      const cleaned = rawResponse
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as {
        subItems?: Array<{
          orderIndex?: number;
          label?: string;
          correctAnswer?: string;
          acceptableAnswers?: string[] | null;
          explanation?: string | null;
        }>;
      };

      if (!parsed.subItems || !Array.isArray(parsed.subItems)) {
        throw new Error("AI did not return a valid subItems array.");
      }

      return {
        subItems: parsed.subItems.map((item, idx) => ({
          orderIndex: item.orderIndex ?? idx,
          label: item.label ?? String(idx + 1),
          correctAnswer: String(item.correctAnswer ?? "").trim(),
          acceptableAnswers: Array.isArray(item.acceptableAnswers) ? item.acceptableAnswers : null,
          explanation: item.explanation ?? null,
        })),
      };
    } catch (parseError) {
      throw new Error(`Không thể giải mã kết quả từ AI: ${(parseError as Error).message}`, {
        cause: parseError,
      });
    }
  }
}

export const nvidiaNimService = new NvidiaNimService();

/** Returns the URL of the first `![alt](url)` image embedded in markdown content, if any. */
export function extractFirstMarkdownImageUrl(markdown: string | null | undefined): string | null {
  const match = markdown?.match(/!\[[^\]]*\]\(\s*(<[^>]+>|[^)\s]+)[^)]*\)/);
  const url = match?.[1]?.replace(/^<|>$/g, "").trim();

  return url ? url : null;
}
