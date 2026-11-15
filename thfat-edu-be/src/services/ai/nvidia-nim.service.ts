import { env } from "../../config/env";

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
    const apiKey = this.getApiKey();

    const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
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

  public async extractSectionContent(
    sectionType: "true_false" | "group_mcq" | "matching" | "short_answer",
    markdownContent: string,
    onChunk?: (chunk: string) => void,
  ): Promise<string> {
    const model = "nvidia/nemotron-3-ultra-550b-a55b";

    const systemPrompt = `You are an expert OCR & extraction engine for Vietnamese Chemistry and Science exams.
Extract ALL questions belonging to this section into a strict JSON object: {"questions": [...]}.
Do NOT summarize, do NOT skip any questions, do NOT solve the questions.

Schema for each question:
{
  "orderIndex": 1,
  "contextContent": "Đoạn văn dẫn chung hoặc tiêu đề câu (vd: Câu 1. Cho các phát biểu sau...)",
  "imageUrl": null, // If question contains [HÌNH_ẢNH: IMAGE_PAGE_X_Y], set to "IMAGE_PAGE_X_Y", else null
  "options": ["A. ...", "B. ..."], // Cho Phần II hoặc Phần III (ở cấp câu hỏi)
  "subItems": [
    {
      "orderIndex": 1,
      "label": "1", // hoặc "A", "B", "a)", "b)"
      "content": "Nội dung câu hỏi con hoặc phát biểu",
      "options": null, // Để null đối với Phần I, III, IV để tránh trùng lặp dữ liệu
      "correctAnswer": null,
      "points": "1.50",
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

- If this is Phần II (Trắc nghiệm):
  * Extract ALL multiple choice questions with their "options" array ["A. ...", "B. ...", "C. ...", "D. ..."].

- If this is Phần III (Ghép hợp / Matching):
  * "contextContent": ONLY contains the general background passage or preamble (e.g. "Câu 16: (ThFat) Cho các phát biểu sau về các chất khí:").
  * CRITICAL: NEVER put the matching table ("| Yêu cầu | Giá trị |", "| Thí nghiệm | Hiện tượng |"), the numbered statements 1, 2, 3, 4, the options A, B, C..., or "Trả lời: 1-...; 2-..." into contextContent!
  * "options": Put ALL target candidate choices from Column B / Column 2 ONCE at the question level (e.g. ["A. $\\ce{N2}$", "B. $\\ce{NH3}$", "C. $\\ce{NO}$", "D. $\\ce{NO2}$", "E. $\\ce{N2O}$", "F. $\\ce{N2O5}$"]). DO NOT duplicate "options" inside subItems!
  * "subItems": Contains the statements from Column A / Column 1 (usually 4 statements 1, 2, 3, 4):
    - "orderIndex": 1, 2, 3, 4
    - "label": "1", "2", "3", "4"
    - "content": The statement/requirement text from Column A / Column 1.
    - "correctAnswer": null

- If this is Phần IV (Tự luận ngắn):
  * Extract all calculation and short answer questions.

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
      response_format: { type: "json_object" },
    });

    return response;
  }
}

export const nvidiaNimService = new NvidiaNimService();
