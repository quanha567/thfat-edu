import type { TAnalyticsTimeRange } from "./types";

export const TIME_RANGE_OPTIONS: Array<{ value: TAnalyticsTimeRange; label: string }> = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày qua" },
  { value: "30d", label: "30 ngày qua" },
  { value: "all", label: "Toàn thời gian" },
];

export const DEFAULT_TIME_RANGE: TAnalyticsTimeRange = "7d";

export const SCORE_TIER_COLORS: Record<string, string> = {
  kem: "var(--color-error-500)",
  yeu: "var(--color-warning-500)",
  trung_binh: "var(--color-gold-500)",
  kha: "var(--color-cyan-500)",
  gioi: "var(--color-primary-700)",
};
