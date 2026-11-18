"use client";

import { Button } from "@/components/ui/button";

import { LEADERBOARD_TIMEFRAME_LABELS } from "../constants/leaderboard.constants";
import { type TTimeframe } from "../types/leaderboard.types";

export type TLeaderboardFiltersProps = {
  timeframe: TTimeframe;
  onTimeframeChange: (val: TTimeframe) => void;
};

export function LeaderboardFilters({
  timeframe,
  onTimeframeChange,
}: TLeaderboardFiltersProps) {
  const options: TTimeframe[] = ["this_week", "this_month", "all_time"];

  return (
    <div className="bg-muted/60 mx-auto flex max-w-sm items-center justify-center gap-2 rounded-xl p-1 backdrop-blur-md">
      {options.map((key) => {
        const isActive = timeframe === key;

        return (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
              isActive ? "shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onTimeframeChange(key)}
          >
            {LEADERBOARD_TIMEFRAME_LABELS[key]}
          </Button>
        );
      })}
    </div>
  );
}
