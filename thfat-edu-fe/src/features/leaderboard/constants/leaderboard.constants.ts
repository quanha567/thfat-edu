import { type TTimeframe } from "../types/leaderboard.types";

export const LEADERBOARD_TIMEFRAME_LABELS: Record<TTimeframe, string> = {
  this_week: "Tuần này",
  this_month: "Tháng này",
  all_time: "Tất cả",
};

export const LEADERBOARD_ACHIEVEMENT_LABELS: Record<TTimeframe, Record<1 | 2 | 3, string>> = {
  this_week: {
    1: "Top 1 Tuần này",
    2: "Top 2 Tuần này",
    3: "Top 3 Tuần này",
  },
  this_month: {
    1: "Top 1 Tháng này",
    2: "Top 2 Tháng này",
    3: "Top 3 Tháng này",
  },
  all_time: {
    1: "Top 1 Toàn thời gian",
    2: "Top 2 Toàn thời gian",
    3: "Top 3 Toàn thời gian",
  },
};

export const PODIUM_COLORS = {
  1: {
    border: "border-gold-400/50 shadow-gold-500/20",
    ring: "ring-gold-400 border-gold-300",
    badge: "bg-gradient-to-r from-gold-400 to-gold-500 text-primary-950",
    pedestalGradient:
      "from-gold-300 via-warning-400 to-gold-500 border-warning-300 shadow-gold-400/30",
    pedestalTop: "bg-gradient-to-b from-warning-200 to-gold-300 border-warning-100",
  },
  2: {
    border: "border-neutral-300/50 shadow-neutral-400/20",
    ring: "ring-neutral-300 border-neutral-200",
    badge: "bg-gradient-to-r from-neutral-200 to-neutral-400 text-neutral-900",
    pedestalGradient:
      "from-neutral-200 via-neutral-300 to-neutral-400 border-neutral-200 shadow-neutral-300/30",
    pedestalTop: "bg-gradient-to-b from-white to-neutral-200 border-white",
  },
  3: {
    border: "border-gold-700/50 shadow-gold-800/20",
    ring: "ring-gold-600 border-gold-500",
    badge: "bg-gradient-to-r from-gold-600 to-gold-700 text-gold-100",
    pedestalGradient: "from-gold-600 via-gold-700 to-gold-800 border-gold-500 shadow-gold-700/30",
    pedestalTop: "bg-gradient-to-b from-gold-500 to-gold-600 border-gold-400",
  },
} as const;

export function formatLeaderboardDuration(totalDurationSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalDurationSeconds));

  if (safeSeconds < 60) {
    return `${safeSeconds} giây`;
  }

  if (safeSeconds >= 3600) {
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);

    if (minutes === 0) {
      return `${hours} giờ`;
    }

    return `${hours} giờ ${minutes} phút`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (seconds === 0) {
    return `${minutes} phút`;
  }

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutes} phút ${formattedSeconds} giây`;
}

export function formatLeaderboardScore(score: number): string {
  return Number(score).toFixed(2);
}
