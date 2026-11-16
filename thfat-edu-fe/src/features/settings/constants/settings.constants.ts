export const ATTEMPT_PRESETS = [
  { label: "1 lần (Thi chuẩn)", value: 1 },
  { label: "2 lần", value: 2 },
  { label: "3 lần", value: 3 },
  { label: "5 lần", value: 5 },
  { label: "Không giới hạn (0)", value: 0 },
] as const;

export const COOLDOWN_PRESETS = [
  { label: "0p (Thi ngay)", value: 0 },
  { label: "5 phút", value: 5 },
  { label: "15 phút", value: 15 },
  { label: "30 phút", value: 30 },
  { label: "60 phút", value: 60 },
] as const;
