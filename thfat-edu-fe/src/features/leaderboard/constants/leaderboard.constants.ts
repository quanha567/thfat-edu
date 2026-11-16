import { type TTimeframe } from "../types/leaderboard.types";

export const LEADERBOARD_TIMEFRAME_LABELS: Record<TTimeframe, string> = {
  this_week: "Tuần này",
  this_month: "Tháng này",
  all_time: "Tất cả",
};

export const PODIUM_COLORS = {
  1: {
    border: "border-amber-400/50 shadow-amber-500/20",
    badge: "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950",
    ring: "ring-amber-400",
  },
  2: {
    border: "border-slate-300/50 shadow-slate-400/20",
    badge: "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900",
    ring: "ring-slate-300",
  },
  3: {
    border: "border-amber-700/50 shadow-amber-800/20",
    badge: "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100",
    ring: "ring-amber-600",
  },
} as const;
