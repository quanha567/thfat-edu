"use client";

import { Calendar, Star, Trophy } from "lucide-react";

import { type TTimeframe } from "../types/leaderboard.types";

export type TLeaderboardHeroProps = {
  timeframe: TTimeframe;
  onTimeframeChange: (val: TTimeframe) => void;
};

const TIMEFRAME_OPTIONS: Array<{ key: TTimeframe; label: string; icon: typeof Trophy }> = [
  { key: "this_week", label: "Tuần này", icon: Trophy },
  { key: "this_month", label: "Tháng này", icon: Calendar },
  { key: "all_time", label: "Tất cả", icon: Star },
];

export function LeaderboardHero({ timeframe, onTimeframeChange }: TLeaderboardHeroProps) {
  return (
    <div className="flex flex-col gap-6 text-white sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Clean Trophy Badge + Title */}
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Bảng <span className="text-cyan-300">Xếp Hạng</span>
          </h1>
          <p className="text-primary-100/80 max-w-xl text-xs font-normal sm:text-sm">
            Danh sách thí sinh có điểm số cao nhất trong các kỳ thi thử V-SAT môn Hóa học.
          </p>
        </div>
      </div>

      {/* Right: Timeframe Filter Pills (Scrollbar-free) */}
      <div className="inline-flex [scrollbar-width:none] items-center gap-1 self-start rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-md sm:self-center [&::-webkit-scrollbar]:hidden">
        {TIMEFRAME_OPTIONS.map(({ key, label, icon: Icon }) => {
          const isActive = timeframe === key;

          return (
            <button
              key={key}
              type="button"
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:px-4 sm:py-2 sm:text-sm ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => onTimeframeChange(key)}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
