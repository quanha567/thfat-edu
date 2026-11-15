import { type TSectionType } from "../types";

export function sanitizeDisplayContext(
  rawContext: string,
  sectionType: TSectionType,
  hasSubItems: boolean,
): string {
  if (!rawContext) return "";
  let text = rawContext.trim();

  // Strip leading "Câu 18." or "Câu 18: " since questionNumber badge already displays it
  text = text.replace(/^(?:CÂU|Câu|Bài)\s*\d+[.:-]\s*/i, "");

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

      if (sectionType === "matching") {
        text = text.replace(
          /(?:Cột\s*[A1]\s*(?:\([^)]+\)|:[^\n\-|]+)\s*(?:[-–|và,]\s*)?Cột\s*[B2]\s*(?:\([^)]+\)|:[^\n\-|]+))/gi,
          "",
        );
      }
    }
  }

  return text.trim();
}
