import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Trophy } from "lucide-react";

import { type TLeaderboardItem } from "../types/leaderboard.types";

export type TLeaderboardTableProps = {
  items: TLeaderboardItem[];
  currentUserId?: string;
};

export function LeaderboardTable({ items, currentUserId }: TLeaderboardTableProps) {
  if (items.length === 0) {
    return (
      <div className="bg-card text-muted-foreground rounded-xl border p-12 text-center shadow-xs">
        <p className="text-sm font-medium">Chưa có bảng xếp hạng cho khoảng thời gian này.</p>
      </div>
    );
  }

  return (
    <div className="bg-card overflow-hidden rounded-xl border shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center text-xs">Hạng</TableHead>
            <TableHead className="text-xs">Học viên</TableHead>
            <TableHead className="text-center text-xs">Số đề</TableHead>
            <TableHead className="hidden text-center text-xs sm:table-cell">Thời gian</TableHead>
            <TableHead className="text-right text-xs">Tổng điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isMe = currentUserId === item.userId;
            const durationMinutes = Math.round(item.totalDurationSeconds / 60);

            return (
              <TableRow
                key={item.userId}
                className={isMe ? "bg-primary-500/10 font-medium" : undefined}
              >
                <TableCell className="text-muted-foreground text-center text-sm font-bold">
                  #{item.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                      <AvatarFallback className="text-xs font-semibold">
                        {item.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {item.fullName} {isMe && "(Bạn)"}
                      </p>
                      {item.schoolName && (
                        <p className="text-muted-foreground truncate text-xs">{item.schoolName}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm">{item.totalExams}</TableCell>
                <TableCell className="text-muted-foreground hidden text-center text-xs sm:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {durationMinutes} phút
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-primary inline-flex items-center gap-1 text-sm font-bold">
                    <Trophy className="h-3.5 w-3.5" />
                    {item.totalScore}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
