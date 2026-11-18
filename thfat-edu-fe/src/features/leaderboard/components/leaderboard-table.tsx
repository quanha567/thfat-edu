import { getAvatarGradient, getInitials } from "@/components/base";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown } from "lucide-react";

import {
  formatLeaderboardDuration,
  formatLeaderboardScore,
} from "../constants/leaderboard.constants";
import { type TLeaderboardItem, type TTimeframe } from "../types/leaderboard.types";

export type TLeaderboardTableProps = {
  items: TLeaderboardItem[];
  currentUserId?: string;
  timeframe?: TTimeframe;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center">
        <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 via-gold-400 to-gold-500 font-black text-xs sm:text-sm text-primary-950 shadow-sm shadow-gold-500/25 ring-2 ring-gold-200/90">
          <Crown className="absolute -top-2.5 h-3.5 w-3.5 text-gold-500 fill-gold-400 drop-shadow-xs" />
          <span>1</span>
        </div>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 font-black text-xs sm:text-sm text-neutral-800 shadow-sm shadow-neutral-400/20 ring-2 ring-neutral-200/90">
          <span>2</span>
        </div>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-b from-gold-600 via-gold-700 to-gold-800 font-black text-xs sm:text-sm text-gold-100 shadow-sm shadow-gold-900/20 ring-2 ring-gold-500/60">
          <span>3</span>
        </div>
      </div>
    );
  }

  return (
    <span className="font-semibold text-muted-foreground text-xs sm:text-sm">
      {rank}
    </span>
  );
}

export function LeaderboardTable({
  items,
  currentUserId,
}: TLeaderboardTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-md">
        <p className="text-sm font-medium text-muted-foreground">
          Chưa có bảng xếp hạng cho khoảng thời gian này.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[620px]">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-20 text-center text-xs font-bold text-muted-foreground">
                Hạng
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Học viên
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Trường
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-muted-foreground">
                Điểm số
              </TableHead>
              <TableHead className="text-center text-xs font-bold text-muted-foreground">
                Thời gian
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isMe = currentUserId === item.userId;

              return (
                <TableRow
                  key={item.userId}
                  className={`border-b border-border transition-colors hover:bg-secondary/40 ${
                    isMe ? "bg-secondary/80 font-medium" : ""
                  }`}
                >
                  {/* Rank Column */}
                  <TableCell className="text-center">
                    <RankBadge rank={item.rank} />
                  </TableCell>

                  {/* Student Column */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border shadow-2xs">
                        <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(item.fullName)} font-bold text-xs text-white shadow-inner ring-1 ring-white/20 select-none`}
                        >
                          {getInitials(item.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.fullName}
                        </p>
                        {isMe && (
                          <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary-700">
                            Bạn
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* School Column */}
                  <TableCell className="text-sm text-muted-foreground">
                    <span className="line-clamp-1">{item.schoolName || "—"}</span>
                  </TableCell>

                  {/* Score Column */}
                  <TableCell className="text-center font-bold text-foreground text-sm">
                    {formatLeaderboardScore(item.totalScore)}
                  </TableCell>

                  {/* Duration Column */}
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {formatLeaderboardDuration(item.totalDurationSeconds)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
