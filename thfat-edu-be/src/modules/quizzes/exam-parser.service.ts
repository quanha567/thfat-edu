import { env } from "../../config/env";
import { type TSectionType } from "../../db/schema/quizzes";

export type TParsedSubItem = {
  orderIndex: number;
  label: string;
  content: string;
  options?: string[];
  correctAnswer?: string;
  acceptableAnswers?: string[];
  points: string;
  explanation?: string;
};

export type TParsedQuestion = {
  orderIndex: number;
  contextContent: string;
  imageUrl?: string;
  subItems: TParsedSubItem[];
};

export type TParsedSection = {
  sectionType: TSectionType;
  title: string;
  orderIndex: number;
  questions: TParsedQuestion[];
};

export type TParsedExamData = {
  title: string;
  description?: string;
  durationMinutes: number;
  totalPoints: string;
  sections: TParsedSection[];
};

const DEFAULT_SECTIONS: { type: TSectionType; title: string; orderIndex: number }[] = [
  { type: "true_false", title: "Phần I: Câu hỏi Đúng / Sai", orderIndex: 0 },
  { type: "group_mcq", title: "Phần II: Câu hỏi trắc nghiệm theo nhóm", orderIndex: 1 },
  { type: "matching", title: "Phần III: Câu hỏi ghép hợp", orderIndex: 2 },
  { type: "short_answer", title: "Phần IV: Câu hỏi trả lời ngắn", orderIndex: 3 },
];

export function normalizeExamData(raw: Partial<TParsedExamData>): TParsedExamData {
  const existingSections = raw.sections ?? [];
  const normalizedSections: TParsedSection[] = DEFAULT_SECTIONS.map((def) => {
    const found = existingSections.find((s) => s.sectionType === def.type);
    if (found) {
      return {
        sectionType: def.type,
        title: found.title || def.title,
        orderIndex: def.orderIndex,
        questions: (found.questions ?? []).map((q, qIdx) => ({
          orderIndex: q.orderIndex ?? qIdx + 1,
          contextContent: q.contextContent ?? "",
          imageUrl: q.imageUrl,
          subItems: (q.subItems ?? []).map((item, itemIdx) => ({
            orderIndex: item.orderIndex ?? itemIdx + 1,
            label: item.label ?? String.fromCharCode(97 + (itemIdx % 26)),
            content: item.content ?? "",
            options: item.options,
            correctAnswer: item.correctAnswer,
            acceptableAnswers: item.acceptableAnswers,
            points: item.points ?? (def.type === "short_answer" ? "6.00" : "1.50"),
            explanation: item.explanation,
          })),
        })),
      };
    }

    return {
      sectionType: def.type,
      title: def.title,
      orderIndex: def.orderIndex,
      questions: [],
    };
  });

  return {
    title: raw.title?.trim() || "Đề thi Hóa học mới",
    description: raw.description?.trim(),
    durationMinutes: raw.durationMinutes && raw.durationMinutes > 0 ? raw.durationMinutes : 50,
    totalPoints: "150.00",
    sections: normalizedSections,
  };
}

export async function parseExamWithNvidia(imageBuffersBase64: string[]): Promise<TParsedExamData> {
  const apiKey = env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY chưa được cấu hình trong biến môi trường.");
  }

  const systemPrompt = `Bạn là chuyên gia thẩm định và số hóa đề thi môn Hóa học cho học sinh THPT và ôn thi Đánh giá Năng lực (ĐGNL).
Nhiệm vụ của bạn là đọc các hình ảnh đề thi được cung cấp và bóc tách thành cấu trúc JSON chuẩn mực tuyệt đối với 4 phần (tổng 150 điểm thô):
1. Phần I (true_false): Đúng / Sai gồm các câu hỏi, mỗi câu có các ý a, b, c, d (mỗi ý 1.50 điểm).
2. Phần II (group_mcq): Chùm câu hỏi trắc nghiệm dựa trên đoạn thông tin/ngữ cảnh/thí nghiệm (mỗi câu trắc nghiệm 1.50 điểm).
3. Phần III (matching): Câu hỏi ghép hợp nối cột (mỗi cặp ghép 1.50 điểm).
4. Phần IV (short_answer): Câu hỏi trả lời ngắn/điền số (mỗi câu 6.00 điểm, kèm danh sách acceptableAnswers).

Quy tắc công thức hóa học: Bắt buộc viết dưới dạng chuẩn KaTeX / LaTeX với cú pháp \\ce{...} (ví dụ \\ce{Fe^{3+}}, \\ce{H2SO4}, \\ce{Al2(SO4)3}).
Chỉ trả về duy nhất định dạng JSON thuần túy (không kèm markdown backticks \`\`\`json).`;

  const contentPayload: unknown[] = [
    { type: "text", text: "Trích xuất đề thi Hóa học này thành JSON 4 phần theo đúng hướng dẫn." },
  ];

  for (const b64 of imageBuffersBase64) {
    contentPayload.push({
      type: "image_url",
      image_url: {
        url: `data:image/png;base64,${b64}`,
      },
    });
  }

  const response = await fetch(`${env.NVIDIA_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: env.NVIDIA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentPayload },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API Error (${response.status}): ${errorText}`);
  }

  const result = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const rawContent = result.choices?.[0]?.message?.content?.trim() ?? "{}";
  const cleanedJson = rawContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");

  let parsedJson: Partial<TParsedExamData>;
  try {
    parsedJson = JSON.parse(cleanedJson) as Partial<TParsedExamData>;
  } catch {
    throw new Error("Không thể chuyển đổi phản hồi từ NVIDIA Vision thành JSON hợp lệ.");
  }

  return normalizeExamData(parsedJson);
}
