import { type TExamDifficulty, type TExamStatus, type TQuizListItem } from "../types";

export const DEFAULT_EXAM_DURATION = 50;
export const DEFAULT_EXAM_POINTS = "150.00";

export const CHEMISTRY_TOPICS = [
  "Hóa học vô cơ",
  "Hóa học hữu cơ",
  "Phản ứng hóa học",
  "Hóa học thực tiễn",
] as const;

export type TChemistryTopic = (typeof CHEMISTRY_TOPICS)[number];

export const EXAM_STATUS_FILTER_OPTIONS = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang hoạt động", value: "published" },
  { label: "Tạm dừng", value: "archived" },
  { label: "Bản nháp", value: "draft" },
] as const;

export const EXAM_DIFFICULTY_FILTER_OPTIONS = [
  { label: "Tất cả độ khó", value: "all" },
  { label: "Dễ", value: "easy" },
  { label: "Trung bình", value: "medium" },
  { label: "Khó", value: "hard" },
] as const;

export const EXAM_STATUS_CONFIG: Record<
  TExamStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  published: {
    label: "Đang hoạt động",
    dotClass: "bg-success-600",
    badgeClass: "text-success-700",
  },
  archived: {
    label: "Tạm dừng",
    dotClass: "bg-neutral-400",
    badgeClass: "text-neutral-500",
  },
  draft: {
    label: "Bản nháp",
    dotClass: "bg-warning-500",
    badgeClass: "text-warning-700",
  },
};

export const EXAM_DIFFICULTY_CONFIG: Record<
  TExamDifficulty,
  { label: string; badgeClass: string }
> = {
  easy: {
    label: "Dễ",
    badgeClass:
      "rounded-full bg-success-50 text-success-700 border-0 px-3 py-0.5 text-xs font-semibold shadow-2xs dark:bg-success-950/50 dark:text-success-300",
  },
  medium: {
    label: "TB",
    badgeClass:
      "rounded-full bg-primary-50 text-primary-700 border-0 px-3 py-0.5 text-xs font-semibold shadow-2xs dark:bg-primary-950/50 dark:text-primary-300",
  },
  hard: {
    label: "Khó",
    badgeClass:
      "rounded-full bg-warning-50 text-warning-700 border-0 px-3 py-0.5 text-xs font-semibold shadow-2xs dark:bg-warning-950/50 dark:text-warning-300",
  },
};

export function formatExamCode(id: string, index?: number): string {
  if (typeof index === "number") {
    return `VSAT-${String(index + 1).padStart(4, "0")}`;
  }

  const numericPart = id.replace(/\D/g, "");
  if (numericPart.length >= 4) {
    return `VSAT-${numericPart.slice(-4)}`;
  }

  return `VSAT-${id.slice(0, 4).toUpperCase()}`;
}

export function getExamDifficulty(exam: TQuizListItem, index?: number): TExamDifficulty {
  const seed = (index ?? 0) + exam.totalQuestions + (exam.title.length % 5);
  if (seed % 3 === 0) return "easy";
  if (seed % 3 === 1) return "medium";

  return "hard";
}

export function getExamTopic(exam: TQuizListItem, index?: number): TChemistryTopic {
  const seed = (index ?? 0) + (exam.title.length % 4);

  return CHEMISTRY_TOPICS[seed % CHEMISTRY_TOPICS.length];
}

export function getExamAttempts(exam: TQuizListItem, index?: number): string {
  const attemptsList = ["8.5K", "6.2K", "4.7K", "3.9K", "3.1K", "2.8K", "2.2K", "1.9K"];
  if (typeof index === "number" && index < attemptsList.length) {
    return attemptsList[index];
  }

  const base = (((index ?? 0) * 13 + exam.totalSubItems * 7 + 31) % 90) + 10;

  return `${(base / 10).toFixed(1)}K`;
}
