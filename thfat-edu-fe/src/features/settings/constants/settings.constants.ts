export const DEFAULT_EXAM_SETTINGS_VALUES = {
  maxAttempts: 1,
  scorePolicy: "highest",
  cooldownMinutes: 0,
  showScoreImmediately: true,
  showExplanationPolicy: "immediately",
} as const;

export const ATTEMPT_PRESETS = [
  { label: "1 lần (Thi chuẩn)", value: 1 },
  { label: "2 lần", value: 2 },
  { label: "3 lần", value: 3 },
  { label: "5 lần", value: 5 },
  { label: "Không giới hạn (0)", value: 0 },
] as const;

export const EXPLANATION_OPTIONS = [
  {
    value: "immediately",
    title: "Hiển thị ngay sau nộp",
    description: "Xem được đáp án đúng và lời giải chi tiết ngay khi thi xong.",
  },
  {
    value: "exam_closed",
    title: "Khi kỳ thi kết thúc",
    description: "Chỉ hiển thị lời giải khi kỳ thi đã đóng hạn làm bài.",
  },
  {
    value: "never",
    title: "Không hiển thị",
    description: "Ẩn đáp án và giải thích để tránh lộ ngân hàng câu hỏi.",
  },
] as const;

export const COOLDOWN_PRESETS = [
  { label: "0p (Thi ngay)", value: 0 },
  { label: "5 phút", value: 5 },
  { label: "15 phút", value: 15 },
  { label: "30 phút", value: 30 },
  { label: "60 phút", value: 60 },
] as const;
