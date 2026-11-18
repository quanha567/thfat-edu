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
    <div className="fixed inset-x-0 bottom-4 z-40 mx-auto max-w-4xl px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between gap-4 rounded-2xl border border-primary-200/80 bg-white/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary font-extrabold text-primary-foreground text-sm shadow-md">
            #{myRank.rank}
          </div>

          <Avatar className="h-9 w-9 border border-primary-100">
            <AvatarImage src={myRank.avatarUrl ?? undefined} alt={myRank.fullName} />
            <AvatarFallback
              className={`bg-gradient-to-br ${getAvatarGradient(myRank.fullName)} font-bold text-xs text-white shadow-inner ring-1 ring-white/20 select-none`}
            >
              {getInitials(myRank.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {myRank.fullName} <span className="font-normal text-primary">(Vị trí của bạn)</span>
            </p>
            {myRank.schoolName && (
              <p className="truncate text-xs text-muted-foreground">{myRank.schoolName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span>{formatLeaderboardDuration(myRank.totalDurationSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 font-extrabold text-primary sm:text-base">
            <Trophy className="text-gold-500 h-4 w-4" />
            <span>{formatLeaderboardScore(myRank.totalScore)}</span>
            <span className="text-xs font-medium text-muted-foreground">điểm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
