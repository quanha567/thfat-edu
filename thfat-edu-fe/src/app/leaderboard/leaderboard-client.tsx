"use client";

import {
  LeaderboardFilters,
  LeaderboardPinnedBar,
  LeaderboardPodium,
  LeaderboardSkeleton,
  LeaderboardTable,
} from "@/features/leaderboard/components";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { type TTimeframe } from "@/features/leaderboard/types/leaderboard.types";
import { parseAsString, useQueryState } from "nuqs";

export function LeaderboardClient() {
  const [timeframe, setTimeframe] = useQueryState(
    "timeframe",
    parseAsString.withDefault("all_time"),
  );

  const validTimeframe: TTimeframe =
    timeframe === "this_week" || timeframe === "this_month"
      ? (timeframe as TTimeframe)
      : "all_time";

  const { data, isLoading } = useLeaderboard({
    timeframe: validTimeframe,
    page: 1,
    limit: 50,
  });

  const items = data?.items ?? [];
  const top3 = items.slice(0, 3);
  const remaining = items.slice(3);

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
          Bảng Vinh Danh
        </h1>
        <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base">
          Tôn vinh những học viên xuất sắc nhất và nỗ lực bứt phá trong quá trình rèn luyện Hóa học.
        </p>
      </div>

      <LeaderboardFilters
        timeframe={validTimeframe}
        onTimeframeChange={(val) => void setTimeframe(val)}
      />

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          {top3.length > 0 && <LeaderboardPodium topItems={top3} />}
          <LeaderboardTable items={remaining.length > 0 ? remaining : items} />
          <LeaderboardPinnedBar myRank={data?.myRank ?? null} />
        </>
      )}
    </div>
  );
}
