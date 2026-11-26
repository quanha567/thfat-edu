"use client";

import {
  LeaderboardHero,
  LeaderboardPagination,
  LeaderboardPinnedBar,
  LeaderboardPodium,
  LeaderboardSkeleton,
  LeaderboardTable,
} from "@/features/leaderboard/components";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { type TTimeframe } from "@/features/leaderboard/types/leaderboard.types";
import Image from "next/image";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

const DEFAULT_LIMIT = 10;

export function LeaderboardClient() {
  const [timeframe, setTimeframe] = useQueryState(
    "timeframe",
    parseAsString.withDefault("this_week"),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const validTimeframe: TTimeframe =
    timeframe === "this_week" || timeframe === "this_month" || timeframe === "all_time"
      ? (timeframe as TTimeframe)
      : "this_week";

  const currentPage = Math.max(1, page);

  const { data, isLoading } = useLeaderboard({
    timeframe: validTimeframe,
    page: currentPage,
    limit: DEFAULT_LIMIT,
  });

  // Podium always shows the overall top 3, so fetch page 1 (shares the cache key when on page 1).
  const { data: firstPageData, isLoading: isPodiumLoading } = useLeaderboard({
    timeframe: validTimeframe,
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  const handleTimeframeChange = (newTimeframe: TTimeframe) => {
    void setTimeframe(newTimeframe);
    void setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    void setPage(newPage);
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const myRank = data?.myRank ?? null;

  const top3 = (firstPageData?.items ?? []).filter((item) => item.rank >= 1 && item.rank <= 3);
  const isMyRankVisible = myRank ? items.some((item) => item.userId === myRank.userId) : true;

  return (
    <div className="flex flex-1 flex-col justify-between pb-12 sm:pb-16">
      <div>
        {/* Full-width continuous wave hero & podium section */}
        <section className="from-surface-dark via-surface-dark-high to-primary-700 relative w-full overflow-hidden bg-gradient-to-b pt-20 pb-24 text-white sm:pt-24 sm:pb-32">
          {/* Wide Panoramic Chemistry Hero Background */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/leaderboard/leaderboard-hero-bg.jpg"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-30 mix-blend-screen"
            />
            {/* Soft gradient masks for seamless top & bottom blending */}
            <div className="from-surface-dark/75 to-primary-700/85 absolute inset-0 bg-gradient-to-b via-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--surface-dark)_100%)] opacity-50" />
          </div>

          {/* Ambient background glowing orbs */}
          <div className="bg-primary/20 pointer-events-none absolute top-1/4 -left-20 h-72 w-72 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 right-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

          {/* Hero & Podium Content */}
          <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <LeaderboardHero timeframe={validTimeframe} onTimeframeChange={handleTimeframeChange} />

            {isPodiumLoading ? <LeaderboardSkeleton /> : <LeaderboardPodium topItems={top3} />}
          </div>

          {/* Smooth organic wave swoosh at bottom */}
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-full text-white sm:h-24 dark:text-neutral-950"
              preserveAspectRatio="none"
            >
              <path
                d="M0,45 C280,105 520,10 820,55 C1100,95 1300,30 1440,40 L1440,120 L0,120 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

        {/* Table Section cleanly overlapping wave */}
        {!isLoading && (
          <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-4 sm:-mt-18 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <LeaderboardTable
                items={items}
                currentUserId={myRank?.userId}
                timeframe={validTimeframe}
              />

              {total > 0 && (
                <LeaderboardPagination
                  page={Math.max(1, page)}
                  limit={DEFAULT_LIMIT}
                  total={total}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            {!isMyRankVisible && myRank && <LeaderboardPinnedBar myRank={myRank} />}
          </section>
        )}
      </div>
    </div>
  );
}
