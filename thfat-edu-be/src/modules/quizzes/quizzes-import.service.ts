import { nvidiaNimService } from "../../services/ai/nvidia-nim.service";
import { extractPdfDocument } from "../../services/ai/pdf-extractor.service";
import { type TCreateQuizInput, type TQuizSectionInput } from "./quizzes.model";

export type TImportJobProgress = {
  step: number;
  totalSteps: number;
  message: string;
};

export type TImportJob = {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: TImportJobProgress;
  data: TCreateQuizInput | null;
  error: string | null;
  listeners: Array<(event: string, data: unknown) => void>;
};

class ExamImportJobManager {
  private jobs = new Map<string, TImportJob>();

  public createJob(jobId: string): TImportJob {
    const job: TImportJob = {
      id: jobId,
      status: "pending",
      progress: {
        step: 0,
        totalSteps: 5,
        message: "Khởi tạo tác vụ import...",
      },
      data: null,
      error: null,
      listeners: [],
    };
    this.jobs.set(jobId, job);

    return job;
  }

  public getJob(jobId: string): TImportJob | undefined {
    return this.jobs.get(jobId);
  }

  public subscribe(jobId: string, listener: (event: string, data: unknown) => void): () => void {
    const job = this.jobs.get(jobId);
    if (!job) return () => {};

    job.listeners.push(listener);

    return () => {
      job.listeners = job.listeners.filter((l) => l !== listener);
    };
  }

  public emit(jobId: string, event: string, data: unknown): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    for (const listener of job.listeners) {
      try {
        listener(event, data);
      } catch {
        // ignore subscriber errors
      }
    }
  }

  public updateProgress(jobId: string, step: number, message: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.progress = { step, totalSteps: 5, message };
    this.emit(jobId, "progress", job.progress);
  }

  public completeJob(jobId: string, data: TCreateQuizInput): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = "completed";
    job.data = data;
    this.emit(jobId, "completed", data);
  }

  public failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = "failed";
    job.error = error;
    this.emit(jobId, "failed", { error });
  }

  public cleanup(jobId: string): void {
    this.jobs.delete(jobId);
  }
}

export const examImportJobManager = new ExamImportJobManager();

export function formatTitleFromFileName(fileName?: string): string {
  if (!fileName) return "ĐỀ THI ĐÁNH GIÁ NĂNG LỰC HÓA HỌC";

  // Remove directory path if present and strip extension (e.g. .pdf)
  const baseName = fileName.replace(/^.*[\\/]/, "").replace(/\.[^/.]+$/, "");
  // Replace underscores and repeated dashes with spaces, clean whitespace
  const cleaned = baseName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  return cleaned || "ĐỀ THI ĐÁNH GIÁ NĂNG LỰC HÓA HỌC";
}

export async function processExamPdfImport(
  jobId: string,
  pdfBuffer: Buffer,
  fileName?: string,
): Promise<void> {
  try {
    examImportJobManager.updateProgress(jobId, 1, "Đang đọc và phân tích cấu trúc tài liệu PDF...");
    const { pages, images } = await extractPdfDocument(pdfBuffer);

    const imageCount = Object.keys(images).length;
    examImportJobManager.updateProgress(
      jobId,
      2,
      `Đã phân tích xong ${pages.length} trang đề thi (${imageCount} hình ảnh), chuẩn bị bóc tách cấu trúc...`,
    );

    const fullDocumentMarkdown = pages
      .map((p) => `=== PAGE ${p.pageNumber} ===\n${p.text}`)
      .join("\n\n");

    examImportJobManager.updateProgress(
      jobId,
      3,
      "Đang nhận diện tiêu đề và phân loại 4 phần thi...",
    );

    const examTitle = formatTitleFromFileName(fileName);

    const part1Markdown = extractPartMarkdown(fullDocumentMarkdown, "PHẦN I", "PHẦN II");
    const part2Markdown = extractPartMarkdown(fullDocumentMarkdown, "PHẦN II", "PHẦN III");
    const part3Markdown = extractPartMarkdown(fullDocumentMarkdown, "PHẦN III", "PHẦN IV");
    const part4Markdown = extractPartMarkdown(fullDocumentMarkdown, "PHẦN IV", "=== END ===");

    examImportJobManager.updateProgress(
      jobId,
      4,
      "Đang trích xuất nội dung song song qua các mô hình Nemotron...",
    );

    const [part1Result, part2Result, part3Result, part4Result] = await Promise.allSettled([
      nvidiaNimService.extractSectionContent("true_false", part1Markdown, (chunk) => {
        examImportJobManager.emit(jobId, "ai_raw_token", {
          section: "Phần I",
          chunk,
        });
      }),
      nvidiaNimService.extractSectionContent("group_mcq", part2Markdown, (chunk) => {
        examImportJobManager.emit(jobId, "ai_raw_token", {
          section: "Phần II",
          chunk,
        });
      }),
      nvidiaNimService.extractSectionContent("matching", part3Markdown, (chunk) => {
        examImportJobManager.emit(jobId, "ai_raw_token", {
          section: "Phần III",
          chunk,
        });
      }),
      nvidiaNimService.extractSectionContent("short_answer", part4Markdown, (chunk) => {
        examImportJobManager.emit(jobId, "ai_raw_token", {
          section: "Phần IV",
          chunk,
        });
      }),
    ]);

    const sections: TQuizSectionInput[] = [];

    if (part1Result.status === "fulfilled") {
      const questions = safeParseQuestions(part1Result.value, images, "true_false");
      const sec: TQuizSectionInput = {
        sectionType: "true_false",
        title: "PHẦN I: CÂU HỎI ĐÚNG SAI",
        orderIndex: 1,
        questions,
      };
      sections.push(sec);
      examImportJobManager.emit(jobId, "section_stream", {
        sectionIndex: 1,
        title: sec.title,
        questionsCount: questions.length,
      });
    }

    if (part2Result.status === "fulfilled") {
      const questions = safeParseQuestions(part2Result.value, images, "group_mcq");
      const sec: TQuizSectionInput = {
        sectionType: "group_mcq",
        title: "PHẦN II: CÂU HỎI TRẮC NGHIỆM PHƯƠNG ÁN NHIỀU LỰA CHỌN",
        orderIndex: 2,
        questions,
      };
      sections.push(sec);
      examImportJobManager.emit(jobId, "section_stream", {
        sectionIndex: 2,
        title: sec.title,
        questionsCount: questions.length,
      });
    }

    if (part3Result.status === "fulfilled") {
      const questions = safeParseQuestions(part3Result.value, images, "matching");
      const sec: TQuizSectionInput = {
        sectionType: "matching",
        title: "PHẦN III: CÂU HỎI GHÉP HỢP",
        orderIndex: 3,
        questions,
      };
      sections.push(sec);
      examImportJobManager.emit(jobId, "section_stream", {
        sectionIndex: 3,
        title: sec.title,
        questionsCount: questions.length,
      });
    }

    if (part4Result.status === "fulfilled") {
      const questions = safeParseQuestions(part4Result.value, images, "short_answer");
      const sec: TQuizSectionInput = {
        sectionType: "short_answer",
        title: "PHẦN IV: TỰ LUẬN NGẮN",
        orderIndex: 4,
        questions,
      };
      sections.push(sec);
      examImportJobManager.emit(jobId, "section_stream", {
        sectionIndex: 4,
        title: sec.title,
        questionsCount: questions.length,
      });
    }

    examImportJobManager.updateProgress(
      jobId,
      5,
      "Hoàn tất trích xuất và chuẩn hóa dữ liệu đề thi!",
    );

    const parsedQuiz: TCreateQuizInput = {
      title: examTitle,
      description: "Đề thi được tạo tự động bởi AI từ tài liệu PDF",
      durationMinutes: 50,
      totalPoints: "150.00",
      status: "draft",
      sections,
    };

    examImportJobManager.completeJob(jobId, parsedQuiz);
  } catch (err) {
    examImportJobManager.failJob(jobId, String(err));
  }
}

function extractPartMarkdown(content: string, startHeader: string, endHeader: string): string {
  const norm = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  const normContent = norm(content);
  const normStart = norm(startHeader);
  const startIdx = normContent.indexOf(normStart);
  if (startIdx === -1) return content;

  if (endHeader === "=== END ===") {
    return content.slice(startIdx);
  }

  const normEnd = norm(endHeader);
  const endIdx = normContent.indexOf(normEnd, startIdx + normStart.length);
  if (endIdx === -1) {
    return content.slice(startIdx);
  }

  return content.slice(startIdx, endIdx);
}

export function cleanMathBackslashes(text: string): string {
  if (!text) return "";

  return text.replace(/\\{2,}([a-zA-Z$%_&#{}])/g, (_, char) => `\\${char}`);
}

export function normalizeQuestionMarkdown(raw: string): string {
  if (!raw) return "";

  // 1. Remove raw [HÌNH_ẢNH: ...] tags if left in text
  let res = raw.replace(/\[HÌNH_ẢNH:\s*[^\]]+\]/gi, "").trim();

  // 2. Normalize standard LaTeX delimiters \( ... \) and \[ ... \] into $ ... $ and $$ ... $$
  res = res
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner) => `$$${inner.trim()}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner) => `$${inner.trim()}$`);

  // 3. Normalize redundant/escaped backslashes before LaTeX commands or symbols
  // (e.g. \\\ce -> \ce, \\ce -> \ce, \\rightarrow -> \rightarrow, \\Delta -> \Delta)
  res = cleanMathBackslashes(res);

  // 4. Protect existing math blocks ($...$ and $$...$$) from mutation
  const mathBlocks: string[] = [];
  res = res.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, (match) => {
    let math = match;

    if (!math.startsWith("$$") && !math.includes("\\begin{")) {
      const inner = math.slice(1, -1);
      const cleanedInner = inner
        .replace(/^\\{2,}\s*/, "")
        .replace(/\s*\\{2,}$/, "")
        .replace(/\\{2,}(?=\s|$)/g, " ")
        .trim();

      math = `$${cleanedInner}$`;
    }

    const idx = mathBlocks.length;
    mathBlocks.push(math);

    return `___MATH_PROTECTED_${idx}___`;
  });

  // 5. Auto-wrap bare \ce{...}, \frac{...}{...}, and \sqrt{...} outside of $
  res = res.replace(/\\ce\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, inner) => `$\\ce{${inner}}$`);
  res = res.replace(
    /\\frac\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\})*)\}/g,
    (_m, num, den) => `$\\frac{${num}}{${den}}$`,
  );
  res = res.replace(/\\sqrt\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_m, inner) => `$\\sqrt{${inner}}$`);

  // 6. Auto-wrap bare arrows and math symbols: \rightarrow, \rightleftharpoons, \uparrow, \downarrow, \Delta, \approx, \le, \ge, \times, \cdot, \pm
  res = res.replace(
    /\\(rightarrow|rightleftharpoons|leftarrow|uparrow|downarrow|Delta|approx|le|ge|times|div|cdot|pm)\b/g,
    (_m, sym) => `$\\${sym}$`,
  );

  // 7. Restore protected math blocks
  for (let i = 0; i < mathBlocks.length; i++) {
    const block = mathBlocks[i] ?? "";
    res = res.replace(`___MATH_PROTECTED_${i}___`, () => block);
  }

  // 8. Clean up multiple blank lines (keep max 1 blank line = \n\n)
  res = res.replace(/\n{3,}/g, "\n\n");

  return res;
}

export type TResolveQuestionImageOptions = {
  explicitImageUrl?: string | null;
  contextText: string;
  contentText: string;
  imagesMap: Record<string, string>;
};

function resolveQuestionImage(options: TResolveQuestionImageOptions): string | null {
  const { explicitImageUrl, contextText, contentText, imagesMap } = options;

  // 1. If explicitImageUrl matches an image ID directly
  if (explicitImageUrl && imagesMap[explicitImageUrl]) {
    return imagesMap[explicitImageUrl];
  }

  // 2. If explicitImageUrl is already a data URI or URL
  if (
    explicitImageUrl &&
    (explicitImageUrl.startsWith("data:") || explicitImageUrl.startsWith("http"))
  ) {
    return explicitImageUrl;
  }

  // 3. Look for [HÌNH_ẢNH: IMAGE_PAGE_X_Y] placeholder in contextText or contentText
  const match = `${contextText}\n${contentText}`.match(/\[HÌNH_ẢNH:\s*([A-Za-z0-9_]+)\]/i);
  if (match?.[1]) {
    const imageId = match[1].trim();
    if (imagesMap[imageId]) {
      return imagesMap[imageId];
    }
  }

  return null;
}

export function stripOptionPrefix(text: string): string {
  if (!text) return "";

  return text.replace(/^[A-D]\.\s*/i, "").trim();
}

export function sanitizeQuestionContext(
  rawContext: string,
  sectionType?: string,
  hasSubItems = false,
): string {
  if (!rawContext) return "";
  let text = rawContext.trim();

  // Strip leading "Câu 18." or "Câu 18: "
  text = text.replace(/^(?:CÂU|Câu|Bài)\s*\d+[.:-]\s*/i, "");

  // If subitems exist, strip answer sheets and structural question tables
  if (hasSubItems) {
    // Strip answer sheet prompt (e.g. "Trả lời: 1-...; 2-...")
    text = text.replace(/\n\s*(?:Trả lời|Đáp án):\s*\d+-[^\n]*/gi, "");

    // For matching or true_false, remove layout table headers
    if (sectionType === "matching" || sectionType === "true_false") {
      text = text.replace(
        /(?:\n|^)\|?\s*(?:Yêu cầu|Thí nghiệm|Phát biểu|Nội dung|Mệnh đề)\s*\|[\s\S]*?(?=\n\s*[A-F]\.|\n\n|$)/gi,
        "",
      );

      // Remove trailing options block if present in context (e.g. A. 1\nB. 2...)
      text = text.replace(/\n\s*[A-F]\.\s+[^\n]+(?:\n\s*[A-F]\.\s+[^\n]+)*/gi, "");
    }

    // For group_mcq: remove trailing child question statement or options leaked into context
    if (sectionType === "group_mcq") {
      text = text.replace(/(?:\n|^)\s*(?:CÂU|Câu|Bài)\s*\d+[.:-][\s\S]*$/i, "");
      text = text.replace(/(?:\n|^)\s*[A-D]\.\s+[^\n]+(?:\n\s*[A-D]\.\s+[^\n]+)*/gi, "");
    }
  }

  return text.trim();
}

export function resolveStandardSubItemPoints(sectionType?: string): string {
  if (sectionType === "group_mcq" || sectionType === "short_answer") {
    return "6.00";
  }

  return "1.50";
}

export function repairTruncatedJson(str: string): string {
  let cleaned = str.trim();
  const startObj = cleaned.indexOf("{");
  const startArr = cleaned.indexOf("[");

  if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
    cleaned = cleaned.slice(startObj);
  } else if (startArr !== -1) {
    cleaned = cleaned.slice(startArr);
  }

  try {
    JSON.parse(cleaned);

    return cleaned;
  } catch {
    // If invalid JSON, proceed with heuristic repair
  }

  // 1. If cut off inside a string literal, close it
  let inString = false;
  let escape = false;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escape) {
      escape = false;
    } else if (char === "\\") {
      escape = true;
    } else if (char === '"') {
      inString = !inString;
    }
  }

  if (inString) {
    cleaned += '"';
  }

  // 2. Strip dangling trailing comma or key
  cleaned = cleaned.replace(/,\s*$/, "").replace(/:\s*$/, ": null");

  // 3. Balance unclosed brackets and braces
  const stack: string[] = [];
  inString = false;
  escape = false;
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escape) {
      escape = false;
    } else if (char === "\\") {
      escape = true;
    } else if (char === '"') {
      inString = !inString;
    } else if (!inString) {
      if (char === "{" || char === "[") {
        stack.push(char);
      } else if (char === "}" && stack[stack.length - 1] === "{") {
        stack.pop();
      } else if (char === "]" && stack[stack.length - 1] === "[") {
        stack.pop();
      }
    }
  }

  while (stack.length > 0) {
    const open = stack.pop();
    if (open === "{") cleaned += "}";
    else if (open === "[") cleaned += "]";
  }

  return cleaned;
}

export type TGroupMcqSubItem = {
  orderIndex: number;
  label: string;
  content: string;
  options: string[] | null;
  correctAnswer: string | null;
  points: string;
  explanation: string | null;
};

export type TGroupMcqQuestion = {
  orderIndex: number;
  contextContent: string;
  imageUrl: string | null;
  subItems: TGroupMcqSubItem[];
};

export function groupMcqFlatRawItems(rawList: unknown[]): TGroupMcqQuestion[] {
  const hasValidSubItems = rawList.some((item) => {
    const rawSub = (item as Record<string, unknown>)?.subItems;

    return Array.isArray(rawSub) && rawSub.length > 1;
  });

  if (hasValidSubItems) {
    return rawList as TGroupMcqQuestion[];
  }

  const groups: TGroupMcqQuestion[] = [];
  let currentGroup: TGroupMcqQuestion | null = null;

  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i] as Record<string, unknown>;
    const rawSubList = Array.isArray(item.subItems)
      ? (item.subItems as Record<string, unknown>[])
      : [];
    const firstSub = rawSubList[0];

    const rawContext = String(item.contextContent || "");
    const rawContent = String(item.content || firstSub?.content || "");
    const combined = `${rawContext}\n${rawContent}`.trim();
    const explicitImg = (item.imageUrl as string | null) ?? null;

    const qMatch = combined.match(
      /([\s\S]*?)(?:(?:\n+|^)\s*(?:CÂU|Câu|Bài)\s*(\d+)[.:-]\s*)([\s\S]*)/i,
    );

    let passage = "";
    let qLabel = String(firstSub?.label || `Câu ${i + 1}`);
    let qContent = combined;

    if (qMatch) {
      passage = qMatch[1]?.trim() ?? "";
      qLabel = `Câu ${qMatch[2]}`;
      qContent = qMatch[3]?.trim() ?? "";
    } else if (rawContext && rawContent && rawContext !== rawContent) {
      passage = rawContext.trim();
      qContent = rawContent.replace(passage, "").trim();
    } else {
      passage = rawContext.trim();
      qContent = rawContent.trim() || rawContext.trim();
    }

    let rawOpts: string[] | null = null;
    if (Array.isArray(item.options)) {
      rawOpts = item.options.map((o) => stripOptionPrefix(String(o)));
    } else if (
      Array.isArray(item.subItems) &&
      (item.subItems[0] as Record<string, unknown>)?.options
    ) {
      const firstSubOpts = (item.subItems[0] as Record<string, unknown>).options;
      if (Array.isArray(firstSubOpts)) {
        rawOpts = firstSubOpts.map((o) => stripOptionPrefix(String(o)));
      }
    }

    // Strip trailing options block from question content if present
    qContent = qContent
      .replace(/(?:\n|^)\s*[A-D]\.\s+[^\n]+(?:\n\s*[A-D]\.\s+[^\n]+)*/gi, "")
      .trim();

    const normP = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
    const canJoinCurrent =
      currentGroup !== null &&
      passage.length > 20 &&
      (normP(currentGroup.contextContent).includes(normP(passage).slice(0, 50)) ||
        normP(passage).includes(normP(currentGroup.contextContent).slice(0, 50)));

    const subItem: TGroupMcqSubItem = {
      orderIndex: (currentGroup?.subItems.length ?? 0) + 1,
      label: qLabel,
      content: qContent,
      options: rawOpts,
      correctAnswer: item.correctAnswer ? String(item.correctAnswer) : null,
      points: "6.00",
      explanation: item.explanation ? String(item.explanation) : null,
    };

    if (canJoinCurrent && currentGroup) {
      subItem.orderIndex = currentGroup.subItems.length + 1;
      currentGroup.subItems.push(subItem);
      if (!currentGroup.imageUrl && explicitImg) {
        currentGroup.imageUrl = explicitImg;
      }
    } else {
      currentGroup = {
        orderIndex: groups.length + 1,
        contextContent: passage || rawContext || "",
        imageUrl: explicitImg,
        subItems: [subItem],
      };
      groups.push(currentGroup);
    }
  }

  return groups;
}

export function safeParseQuestions(
  rawResponse: string,
  imagesMap: Record<string, string> = {},
  sectionType?: "true_false" | "group_mcq" | "matching" | "short_answer",
) {
  try {
    const repaired = repairTruncatedJson(rawResponse);
    let parsed: Record<string, unknown> | unknown[] | null = null;
    try {
      parsed = JSON.parse(repaired) as Record<string, unknown> | unknown[];
    } catch {
      return [];
    }

    if (!parsed) return [];

    let rawList: unknown[] = [];

    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      rawList = parsed.questions;
    }

    if (sectionType === "group_mcq" && rawList.length > 0) {
      rawList = groupMcqFlatRawItems(rawList);
    }

    return rawList.map((rawItem: unknown, qIdx: number) => {
      const item = rawItem as Record<string, unknown>;
      const rawSubItems = item.subItems;

      const rawContext = String(item.contextContent || (rawSubItems ? `Câu ${qIdx + 1}` : ""));
      const rawContent = String(item.content || "");
      const explicitImg = (item.imageUrl as string | null) ?? null;
      const resolvedImageUrl = resolveQuestionImage({
        explicitImageUrl: explicitImg,
        contextText: rawContext,
        contentText: rawContent,
        imagesMap,
      });

      let questionOptions = Array.isArray(item.options)
        ? (item.options as string[]).map((opt) => normalizeQuestionMarkdown(String(opt)))
        : null;

      if (sectionType === "group_mcq" && questionOptions) {
        questionOptions = questionOptions.map(stripOptionPrefix);
      }

      // Fallback: If sectionType === "matching" and no options found in item.options,
      // extract options from rawContext or rawContent before context sanitization.
      if (sectionType === "matching" && (!questionOptions || questionOptions.length === 0)) {
        const textToScan = `${rawContext}\n${rawContent}`;
        const optionMatches = textToScan.match(/(?:^|\n|\|)\s*([A-F]\.\s+[^|\n]+)/gi);
        if (optionMatches && optionMatches.length >= 2) {
          questionOptions = optionMatches.map((m) =>
            normalizeQuestionMarkdown(m.replace(/^[|\s]+/, "").trim()),
          );
        }
      }

      // Nếu model trả về flat question không có subItems
      if (!rawSubItems || !Array.isArray(rawSubItems) || rawSubItems.length === 0) {
        const normalizedContent = normalizeQuestionMarkdown(
          rawContent || rawContext || `Câu ${qIdx + 1}`,
        );

        return {
          orderIndex: Number(item.orderIndex) || qIdx + 1,
          contextContent: normalizedContent,
          imageUrl: resolvedImageUrl,
          subItems: [
            {
              orderIndex: 1,
              label: String(item.label || "1"),
              content: normalizedContent,
              options: questionOptions,
              correctAnswer: item.correctAnswer ? String(item.correctAnswer) : null,
              acceptableAnswers: null,
              points: resolveStandardSubItemPoints(sectionType),
              explanation: item.explanation
                ? normalizeQuestionMarkdown(String(item.explanation))
                : null,
            },
          ],
        };
      }

      // Nếu đã có subItems chuẩn, làm sạch contextContent để không bị lặp lại cấu trúc câu hỏi
      const cleanedContext = sanitizeQuestionContext(
        rawContext,
        sectionType,
        rawSubItems.length > 0,
      );
      const normalizedContext = normalizeQuestionMarkdown(cleanedContext || "");

      return {
        orderIndex: Number(item.orderIndex) || qIdx + 1,
        contextContent: normalizedContext,
        imageUrl: resolvedImageUrl,
        subItems: rawSubItems.map((rawSub: unknown, sIdx: number) => {
          const sub = rawSub as Record<string, unknown>;
          let subContent = normalizeQuestionMarkdown(String(sub.content || ""));

          if (sectionType === "group_mcq") {
            if (normalizedContext && subContent.startsWith(normalizedContext)) {
              subContent = subContent.slice(normalizedContext.length).trim();
            } else if (normalizedContext && subContent === normalizedContext) {
              subContent = "";
            }
            subContent = subContent.replace(/^(?:CÂU|Câu|Bài)\s*\d+[.:-]\s*/i, "").trim();
          }

          let subOptions =
            Array.isArray(sub.options) && sub.options.length > 0
              ? (sub.options as string[]).map((opt) => normalizeQuestionMarkdown(String(opt)))
              : questionOptions;

          if (sectionType === "group_mcq" && subOptions) {
            subOptions = subOptions.map(stripOptionPrefix);
          }

          return {
            orderIndex: Number(sub.orderIndex) || sIdx + 1,
            label: String(sub.label || sIdx + 1),
            content: subContent,
            options: subOptions,
            correctAnswer: sub.correctAnswer ? String(sub.correctAnswer) : null,
            acceptableAnswers: null,
            points: resolveStandardSubItemPoints(sectionType),
            explanation: sub.explanation
              ? normalizeQuestionMarkdown(String(sub.explanation))
              : null,
          };
        }),
      };
    });
  } catch {
    return [];
  }
}
