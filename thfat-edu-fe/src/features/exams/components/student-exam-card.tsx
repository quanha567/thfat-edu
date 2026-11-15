"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import Link from "next/link";

import { type TStudentExamListItem } from "../types";

export type TStudentExamCardProps = {
  exam: TStudentExamListItem;
};

type TBadgeConfig = {
  variant: "outline" | "default" | "secondary";
  className: string;
  text: string;
};

function getBadgeConfig(isCompleted: boolean, isInProgress: boolean): TBadgeConfig {
  if (isCompleted) {
    return {
      variant: "secondary",
      className: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
      text: "Đã nộp bài",
    };
  }

  if (isInProgress) {
    return {
      variant: "default",
      className: "bg-amber-500 text-white hover:bg-amber-600",
      text: "Đang làm dở",
    };
  }

  return {
    variant: "outline",
    className: "border-primary-500 text-primary-700",
    text: "Chưa làm",
  };
}

function renderActionButton(examId: string, isCompleted: boolean, isInProgress: boolean) {
  if (isCompleted) {
    return (
      <Button asChild variant="outline" className="w-full">
        <Link href={`/exams/${examId}/result`}>Xem điểm số</Link>
      </Button>
    );
  }

  if (isInProgress) {
    return (
      <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
        <Link href={`/exams/${examId}/room`}>Tiếp tục làm bài</Link>
      </Button>
    );
  }

  return (
    <Button asChild className="w-full">
      <Link href={`/exams/${examId}/room`}>Bắt đầu làm bài</Link>
    </Button>
  );
}

export function StudentExamCard({ exam }: TStudentExamCardProps) {
  const isCompleted = exam.attemptStatus === "submitted";
  const isInProgress = exam.attemptStatus === "in_progress";
  const badgeConfig = getBadgeConfig(isCompleted, isInProgress);

  return (
    <Card className="flex flex-col justify-between border-neutral-200 transition-shadow hover:shadow-sm dark:border-neutral-800">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
            {badgeConfig.text}
          </Badge>

          {isCompleted && exam.score !== null && (
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {exam.score}
              <span className="ml-0.5 text-xs font-normal text-neutral-400">
                {" "}
                / {exam.totalPoints}đ
              </span>
            </span>
          )}
        </div>

        <CardTitle className="line-clamp-2 text-base leading-snug font-semibold text-neutral-900 dark:text-neutral-100">
          {exam.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{exam.durationMinutes} phút</span>
        </div>
      </CardContent>

      <CardFooter>{renderActionButton(exam.id, isCompleted, isInProgress)}</CardFooter>
    </Card>
  );
}

export function ExamCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}
