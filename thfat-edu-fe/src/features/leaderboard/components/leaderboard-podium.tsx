import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy } from "lucide-react";

import { PODIUM_COLORS } from "../constants/leaderboard.constants";
import { type TLeaderboardItem } from "../types/leaderboard.types";

export type TLeaderboardPodiumProps = {
  topItems: TLeaderboardItem[];
};

export function LeaderboardPodium({ topItems }: TLeaderboardPodiumProps) {
  const first = topItems.find((item) => item.rank === 1);
  const second = topItems.find((item) => item.rank === 2);
  const third = topItems.find((item) => item.rank === 3);

  const displayOrder = [
    { item: second, rank: 2, height: "h-56", order: "order-1" },
    { item: first, rank: 1, height: "h-64", order: "order-2" },
    { item: third, rank: 3, height: "h-48", order: "order-3" },
  ];

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-3 items-end gap-3 pt-6 pb-4 sm:gap-6">
      {displayOrder.map(({ item, rank, height, order }) => {
        const config = PODIUM_COLORS[rank as 1 | 2 | 3];

        if (!item) {
          return (
            <div key={rank} className={`${order} flex flex-col items-center opacity-40`}>
              <div className="mb-3 h-16 w-16 rounded-full border-2 border-dashed border-white/20" />
              <div className={`w-full ${height} rounded-t-2xl border border-white/10 bg-white/5`} />
            </div>
          );
        }

        const initials = item.fullName.slice(0, 2).toUpperCase();

        return (
          <div key={item.userId} className={`${order} group flex flex-col items-center`}>
            {rank === 1 && (
              <Crown className="mb-1 h-8 w-8 animate-bounce text-amber-400 duration-1000" />
            )}

            <div className="relative mb-3">
              <Avatar className={`h-16 w-16 border-2 sm:h-20 sm:w-20 ${config.ring} shadow-lg`}>
                <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                <AvatarFallback className="bg-primary-900 font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -right-1 -bottom-2 rounded-full px-2 py-0.5 text-xs font-black shadow-md ${config.badge}`}
              >
                #{rank}
              </span>
            </div>

            <p className="text-foreground line-clamp-1 text-center text-sm font-semibold sm:text-base">
              {item.fullName}
            </p>
            {item.schoolName && (
              <p className="text-muted-foreground mb-2 line-clamp-1 text-center text-xs">
                {item.schoolName}
              </p>
            )}

            <div
              className={`flex w-full ${height} flex-col items-center justify-start rounded-t-2xl border-t border-x ${config.border} bg-gradient-to-b from-white/10 to-white/5 p-3 text-center shadow-md transition-all group-hover:from-white/15 sm:p-4`}
            >
              <div className="text-primary-400 flex items-center gap-1 text-base font-extrabold sm:text-lg">
                <Trophy className="h-4 w-4" />
                <span>{item.totalScore}</span>
              </div>
              <p className="text-muted-foreground mt-1 text-[11px]">{item.totalExams} bài thi</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
