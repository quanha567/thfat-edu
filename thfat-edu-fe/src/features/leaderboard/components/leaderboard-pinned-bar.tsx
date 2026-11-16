import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, User } from "lucide-react";

import { type TLeaderboardItem } from "../types/leaderboard.types";

export type TLeaderboardPinnedBarProps = {
  myRank: TLeaderboardItem | null;
};

export function LeaderboardPinnedBar({ myRank }: TLeaderboardPinnedBarProps) {
  if (!myRank) {
    return null;
  }

  return (
    <div className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-40 border-t px-4 py-3 shadow-2xl backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-lg px-2.5 py-1 text-sm font-black shadow-xs">
            #{myRank.rank}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={myRank.avatarUrl ?? undefined} alt={myRank.fullName} />
            <AvatarFallback className="bg-muted text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-semibold">
              {myRank.fullName} (Vị trí của bạn)
            </p>
            <p className="text-muted-foreground text-xs">{myRank.totalExams} bài thi hoàn thành</p>
          </div>
        </div>

        <div className="text-primary flex items-center gap-1.5 text-base font-extrabold">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span>{myRank.totalScore} điểm</span>
        </div>
      </div>
    </div>
  );
}
