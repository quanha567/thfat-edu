import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

import type { TTopExam } from "../types";

export type TTopExamsCardProps = {
  topExams: TTopExam[];
};

export function TopExamsCard({ topExams }: TTopExamsCardProps) {
  return (
    <Card className="border-border bg-card shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Flame className="text-gold-500 size-4" />
            <CardTitle className="text-base font-bold">Top đề thi phổ biến</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Các đề thi thu hút nhiều lượt tham gia nhất
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
          <Link href="/admin/exams">
            <span>Tất cả</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {topExams.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-xs">
            Chưa có đề thi nào có lượt làm bài trong kỳ này.
          </div>
        ) : (
          <div className="space-y-3">
            {topExams.map((exam, idx) => (
              <div
                key={exam.quizId}
                className="border-border/60 bg-muted/30 hover:bg-muted/60 flex flex-col gap-1.5 rounded-lg border p-2.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-xxs text-primary flex size-5 shrink-0 items-center justify-center rounded-full font-bold">
                      {idx + 1}
                    </span>
                    <Link
                      href={`/admin/exams/${exam.quizId}/edit`}
                      className="text-foreground line-clamp-1 text-xs font-semibold hover:underline"
                    >
                      {exam.title}
                    </Link>
                  </div>
                  <span className="text-foreground shrink-0 text-xs font-bold">
                    {exam.averageScore}đ
                  </span>
                </div>

                <div className="text-xxs text-muted-foreground flex items-center justify-between">
                  <span>
                    {exam.totalAttempts} lượt thi • {exam.durationMinutes} phút
                  </span>
                  <span>Hoàn thành {exam.completionRate}%</span>
                </div>

                <Progress value={exam.completionRate} className="h-1.5" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
