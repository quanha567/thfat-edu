import { getAvatarGradient, getInitials } from "@/components/base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Trophy } from "lucide-react";

import {
  formatLeaderboardDuration,
  formatLeaderboardScore,
} from "../constants/leaderboard.constants";
import { type TLeaderboardItem } from "../types/leaderboard.types";

export type TLeaderboardPinnedBarProps = {
  myRank: TLeaderboardItem | null;
};

export function LeaderboardPinnedBar({ myRank }: TLeaderboardPinnedBarProps) {
  if (!myRank) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 mx-auto max-w-4xl px-4">
      <div className="border-primary-200/80 pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border bg-white/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold shadow-md">
            #{myRank.rank}
          </div>

          <Avatar className="border-primary-100 h-9 w-9 border">
            <AvatarImage src={myRank.avatarUrl ?? undefined} alt={myRank.fullName} />
            <AvatarFallback
              className={`bg-gradient-to-br ${getAvatarGradient(myRank.fullName)} text-xs font-bold text-white shadow-inner ring-1 ring-white/20 select-none`}
            >
              {getInitials(myRank.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-bold">
              {myRank.fullName} <span className="text-primary font-normal">(Vị trí của bạn)</span>
            </p>
            {myRank.schoolName && (
              <p className="text-muted-foreground truncate text-xs">{myRank.schoolName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm sm:gap-6">
          <div className="text-muted-foreground hidden items-center gap-1.5 text-xs sm:flex">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span>{formatLeaderboardDuration(myRank.totalDurationSeconds)}</span>
          </div>

          <div className="text-primary flex items-center gap-1.5 font-extrabold sm:text-base">
            <Trophy className="text-gold-500 h-4 w-4" />
            <span>{formatLeaderboardScore(myRank.totalScore)}</span>
            <span className="text-muted-foreground text-xs font-medium">điểm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
