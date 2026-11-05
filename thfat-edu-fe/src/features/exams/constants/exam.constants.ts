import { type TExamStatus, type TSectionType } from "../types";

export const DEFAULT_EXAM_DURATION = 50;
export const DEFAULT_EXAM_POINTS = "150.00";

export const EXAM_STATUS_CONFIG: Record<
  TExamStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: {
    label: "Bản nháp",
    variant: "secondary",
  },
  published: {
    label: "Đã xuất bản",
    variant: "default",
  },
  archived: {
    label: "Đã lưu trữ",
    variant: "outline",
  },
};

export const SECTION_CONFIGS: Record<
  TSectionType,
  {
    title: string;
    description: string;
    defaultQuestionsCount: number;
    defaultSubItemsCount: number;
    pointsPerItem: string;
    totalRawPoints: number;
  }
> = {
  true_false: {
    title: "Phần I: Đúng / Sai",
    description: "9 câu hỏi lớn, mỗi câu 4 mệnh đề đúng/sai (1.50 điểm/mệnh đề đúng).",
    defaultQuestionsCount: 9,
    defaultSubItemsCount: 36,
    pointsPerItem: "1.50",
    totalRawPoints: 54,
  },
  group_mcq: {
    title: "Phần II: Trắc nghiệm theo nhóm",
    description: "6 đoạn ngữ cảnh thí nghiệm, 24 câu trắc nghiệm con (1.50 điểm/câu).",
    defaultQuestionsCount: 6,
    defaultSubItemsCount: 24,
    pointsPerItem: "1.50",
    totalRawPoints: 36,
  },
  matching: {
    title: "Phần III: Ghép hợp",
    description: "5 câu ghép hợp, 20 cặp ghép nối hai cột (1.50 điểm/cặp đúng).",
    defaultQuestionsCount: 5,
    defaultSubItemsCount: 20,
    pointsPerItem: "1.50",
    totalRawPoints: 30,
  },
  short_answer: {
    title: "Phần IV: Trả lời ngắn",
    description: "5 câu điền số/kết quả tính toán Hóa học (6.00 điểm/câu đúng).",
    defaultQuestionsCount: 5,
    defaultSubItemsCount: 5,
    pointsPerItem: "6.00",
    totalRawPoints: 30,
  },
};
