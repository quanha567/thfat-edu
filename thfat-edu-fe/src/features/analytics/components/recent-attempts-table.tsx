import { BaseAvatar } from "@/components/base";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { TRecentAttempt } from "../types";

export type TRecentAttemptsTableProps = {
  recentAttempts: TRecentAttempt[];
};

export function RecentAttemptsTable({ recentAttempts }: TRecentAttemptsTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === "submitted") {
      return (
        <Badge
          variant="outline"
          className="text-xxs border-success-500/40 bg-success-500/10 text-success-600 dark:text-success-400 font-semibold"
        >
          Đã nộp
        </Badge>
      );
    }
    if (status === "in_progress") {
      return (
        <Badge
          variant="outline"
          className="text-xxs border-warning-500/40 bg-warning-500/10 text-warning-600 dark:text-warning-400 font-semibold"
        >
          Đang làm
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="text-xxs border-error-500/40 bg-error-500/10 text-error-600 dark:text-error-400 font-semibold"
      >
        Bỏ dở
      </Badge>
    );
  };

  return (
    <Card className="border-border bg-card shadow-2xs">
      <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold">Lượt làm bài gần nhất</CardTitle>
          <CardDescription className="text-xs">
            Dòng hoạt động thi cử thời gian thực của thí sinh trên hệ thống
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
          <Link href="/admin/exams">
            <span>Quản lý đề thi</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentAttempts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">Chưa có lượt làm bài nào gần đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Thí sinh</TableHead>
                  <TableHead className="text-xs">Đề thi</TableHead>
                  <TableHead className="text-xs">Điểm số</TableHead>
                  <TableHead className="text-xs">Trạng thái</TableHead>
                  <TableHead className="text-xs">Thời gian</TableHead>
                  <TableHead className="text-right text-xs">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAttempts.map((attempt) => {
                  const dateStr = attempt.submittedAt ?? attempt.startedAt;
                  const formattedDate = dateStr ? format(parseISO(dateStr), "HH:mm dd/MM") : "—";

                  return (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BaseAvatar
                            src={attempt.studentAvatar}
                            name={attempt.studentName}
                            size="sm"
                            className="size-7"
                          />
                          <div className="flex flex-col">
                            <span className="text-foreground line-clamp-1 text-xs font-semibold">
                              {attempt.studentName}
                            </span>
                            <span className="text-xxs text-muted-foreground line-clamp-1">
                              {attempt.studentEmail}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/exams/${attempt.quizId}/edit`}
                          className="text-foreground line-clamp-1 text-xs font-medium hover:underline"
                        >
                          {attempt.quizTitle}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs font-bold">
                        {attempt.normalizedScore !== null ? `${attempt.normalizedScore}đ` : "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(attempt.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Link href={`/admin/exams/${attempt.quizId}/edit`}>Chi tiết</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
