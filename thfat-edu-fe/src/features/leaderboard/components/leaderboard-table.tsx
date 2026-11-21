import { getAvatarGradient, getDefaultAvatar, getInitials } from "@/components/base";
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
        <div className="from-gold-300 via-gold-400 to-gold-500 text-primary-950 shadow-gold-500/25 ring-gold-200/90 relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b text-xs font-black shadow-sm ring-2 sm:h-8 sm:w-8 sm:text-sm">
          <Crown className="text-gold-500 fill-gold-400 absolute -top-2.5 h-3.5 w-3.5 drop-shadow-xs" />
          <span>1</span>
        </div>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300 text-xs font-black text-neutral-800 shadow-sm ring-2 shadow-neutral-400/20 ring-neutral-200/90 sm:h-8 sm:w-8 sm:text-sm">
          <span>2</span>
        </div>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex items-center justify-center">
        <div className="from-gold-600 via-gold-700 to-gold-800 text-gold-100 shadow-gold-900/20 ring-gold-500/60 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b text-xs font-black shadow-sm ring-2 sm:h-8 sm:w-8 sm:text-sm">
          <span>3</span>
        </div>
      </div>
    );
  }

  return <span className="text-muted-foreground text-xs font-semibold sm:text-sm">{rank}</span>;
}

export function LeaderboardTable({ items, currentUserId }: TLeaderboardTableProps) {
  if (items.length === 0) {
    return (
      <div className="border-border bg-card rounded-2xl border p-12 text-center shadow-md">
        <p className="text-muted-foreground text-sm font-medium">
          Chưa có bảng xếp hạng cho khoảng thời gian này.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-md">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[620px]">
          <TableHeader>
            <TableRow className="border-border bg-muted/50 hover:bg-muted/50 border-b">
              <TableHead className="text-muted-foreground w-20 text-center text-xs font-bold">
                Hạng
              </TableHead>
              <TableHead className="text-muted-foreground text-xs font-bold">Học viên</TableHead>
              <TableHead className="text-muted-foreground text-xs font-bold">Trường</TableHead>
              <TableHead className="text-muted-foreground text-center text-xs font-bold">
                Điểm số
              </TableHead>
              <TableHead className="text-muted-foreground text-center text-xs font-bold">
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
                  className={`border-border hover:bg-secondary/40 border-b transition-colors ${
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
                      <Avatar className="border-border h-9 w-9 border shadow-2xs">
                        {(item.avatarUrl || getDefaultAvatar(item.fullName, item.gender)) && (
                          <AvatarImage
                            src={
                              item.avatarUrl ||
                              getDefaultAvatar(item.fullName, item.gender) ||
                              undefined
                            }
                            alt={item.fullName}
                          />
                        )}
                        <AvatarFallback
                          className={`bg-gradient-to-br ${getAvatarGradient(item.fullName)} text-xs font-bold text-white shadow-inner ring-1 ring-white/20 select-none`}
                        >
                          {getInitials(item.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {item.fullName}
                        </p>
                        {isMe && (
                          <span className="bg-primary-100 text-primary-700 text-xxs inline-flex items-center rounded-full px-2 py-0.5 font-bold">
                            Bạn
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* School Column */}
                  <TableCell className="text-muted-foreground text-sm">
                    <span className="line-clamp-1">{item.schoolName || "—"}</span>
                  </TableCell>

                  {/* Score Column */}
                  <TableCell className="text-foreground text-center text-sm font-bold">
                    {formatLeaderboardScore(item.totalScore)}
                  </TableCell>

                  {/* Duration Column */}
                  <TableCell className="text-muted-foreground text-center text-sm">
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
