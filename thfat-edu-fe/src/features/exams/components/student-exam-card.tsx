"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, RotateCcw } from "lucide-react";
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

function getBadgeConfig(
  isCompleted: boolean,
  isInProgress: boolean,
  canTakeExam: boolean,
): TBadgeConfig {
  if (isInProgress) {
    return {
      variant: "default",
      className: "bg-amber-500 text-white hover:bg-amber-600",
      text: "Đang làm dở",
    };
  }

  if (isCompleted) {
    if (!canTakeExam) {
      return {
        variant: "secondary",
        className: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
        text: "Hết lượt thi",
      };
    }

    return {
      variant: "secondary",
      className:
        "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950 dark:text-primary-300 border",
      text: "Đã nộp bài",
    };
  }

  return {
    variant: "outline",
    className: "border-primary-500 text-primary-700",
    text: "Chưa làm",
  };
}

function renderAttemptCountText(maxAttempts?: number | null, attemptCount = 0) {
  if (maxAttempts) {
    return (
      <span>
        Lượt thi: <strong>{attemptCount}</strong>/{maxAttempts}
      </span>
    );
  }

  if (attemptCount > 0) {
    return (
      <span>
        Đã thi: <strong>{attemptCount}</strong> lần
      </span>
    );
  }

  return null;
}

function renderSecondaryAction(canTakeExam: boolean, cooldownRemaining: number, examId: string) {
  if (canTakeExam) {
    return (
      <Button asChild className="flex-1">
        <Link href={`/exams/${examId}/room`} className="flex items-center gap-1">
          <RotateCcw className="h-3.5 w-3.5" />
          Thi lại
        </Link>
      </Button>
    );
  }

  if (cooldownRemaining > 0) {
    return (
      <Button disabled variant="outline" className="flex-1 text-xs">
        Chờ {Math.ceil(cooldownRemaining / 60)}p để thi lại
      </Button>
    );
  }

  return null;
}

export function StudentExamCard({ exam }: TStudentExamCardProps) {
  const isCompleted = exam.attemptStatus === "submitted";
  const isInProgress = exam.attemptStatus === "in_progress";
  const canTakeExam = exam.canTakeExam ?? !isCompleted;
  const cooldownRemaining = exam.cooldownRemainingSeconds ?? 0;
  const attemptCount = exam.attemptCount ?? (isCompleted ? 1 : 0);
  const maxAttempts = exam.maxAttempts;
  const displayScore = exam.displayScore ?? exam.score;

  const badgeConfig = getBadgeConfig(isCompleted, isInProgress, canTakeExam);

  return (
    <Card className="flex flex-col justify-between border-neutral-200 transition-shadow hover:shadow-sm dark:border-neutral-800">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
            {badgeConfig.text}
          </Badge>

          {isCompleted && displayScore !== null && (
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {displayScore}
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

      <CardContent className="space-y-2 pt-0">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{exam.durationMinutes} phút</span>
          </div>

          <div>{renderAttemptCountText(maxAttempts, attemptCount)}</div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2">
        {isInProgress && (
          <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
            <Link href={`/exams/${exam.id}/room`}>Tiếp tục làm bài</Link>
          </Button>
        )}

        {!isInProgress && isCompleted && (
          <div className="flex w-full gap-2">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/exams/${exam.id}/result`}>Xem kết quả</Link>
            </Button>
            {renderSecondaryAction(canTakeExam, cooldownRemaining, exam.id)}
          </div>
        )}

        {!isInProgress && !isCompleted && (
          <Button asChild className="w-full">
            <Link href={`/exams/${exam.id}/room`}>Bắt đầu làm bài</Link>
          </Button>
        )}
      </CardFooter>
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
