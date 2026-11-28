"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, FileText, type LucideIcon, Play, Repeat, RotateCcw } from "lucide-react";
import Link from "next/link";

import { type TStudentExamListItem } from "../types";

export type TStudentExamCardProps = {
  exam: TStudentExamListItem;
};

type TStatusConfig = {
  badgeClass: string;
  dotClass: string;
  text: string;
};

function getStatusConfig(
  isCompleted: boolean,
  isInProgress: boolean,
  canTakeExam: boolean,
): TStatusConfig {
  if (isInProgress) {
    return {
      badgeClass: "bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-300",
      dotClass: "bg-warning-500 animate-pulse",
      text: "Đang làm",
    };
  }

  if (isCompleted && !canTakeExam) {
    return {
      badgeClass: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
      dotClass: "bg-neutral-400",
      text: "Hết lượt",
    };
  }

  if (isCompleted) {
    return {
      badgeClass: "bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-300",
      dotClass: "bg-success-500",
      text: "Đã nộp",
    };
  }

  return {
    badgeClass: "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300",
    dotClass: "bg-primary-500",
    text: "Chưa làm",
  };
}

function getAttemptText(maxAttempts: number | null | undefined, attemptCount: number) {
  if (maxAttempts && maxAttempts > 0) return `${attemptCount}/${maxAttempts} lượt`;

  return `${attemptCount} lượt`;
}

function renderSecondaryAction(canTakeExam: boolean, cooldownRemaining: number, examId: string) {
  if (canTakeExam) {
    return (
      <Button
        asChild
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 flex-1 rounded-xl font-semibold text-white"
      >
        <Link href={`/exams/${examId}/room`}>
          <RotateCcw className="h-4 w-4" />
          Thi lại
        </Link>
      </Button>
    );
  }

  if (cooldownRemaining > 0) {
    return (
      <Button
        disabled
        variant="outline"
        size="lg"
        className="flex-1 rounded-xl text-xs font-medium"
      >
        Chờ {Math.ceil(cooldownRemaining / 60)}p
      </Button>
    );
  }

  return null;
}

type TMetaProps = {
  icon: LucideIcon;
  text: string;
};

function Meta({ icon: Icon, text }: TMetaProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-neutral-400" />
      {text}
    </span>
  );
}

export function StudentExamCard({ exam }: TStudentExamCardProps) {
  const isCompleted = exam.attemptStatus === "submitted";
  const isInProgress = exam.attemptStatus === "in_progress";
  const canTakeExam = exam.canTakeExam ?? !isCompleted;
  const cooldownRemaining = exam.cooldownRemainingSeconds ?? 0;
  const attemptCount = exam.attemptCount ?? (isCompleted ? 1 : 0);
  const displayScore = exam.displayScore ?? exam.score;
  const status = getStatusConfig(isCompleted, isInProgress, canTakeExam);

  const scoreNum = displayScore ? parseFloat(displayScore) : 0;
  const totalNum = parseFloat(exam.totalPoints) || 150;
  const scorePercentage = Math.min(100, Math.max(0, Math.round((scoreNum / totalNum) * 100)));

  return (
    <Card className="flex h-full flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium tracking-wide text-neutral-400">
          {exam.code}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
          {status.text}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="line-clamp-2 text-lg leading-snug font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {exam.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <Meta icon={Clock} text={`${exam.durationMinutes} phút`} />
          <Meta
            icon={FileText}
            text={
              exam.totalQuestions > 0
                ? `${exam.totalQuestions} câu`
                : `${parseFloat(exam.totalPoints)} điểm`
            }
          />
          <Meta icon={Repeat} text={getAttemptText(exam.maxAttempts, attemptCount)} />
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {isCompleted && displayScore !== null && (
          <div className="space-y-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-success-700 dark:text-success-400 text-3xl leading-none font-extrabold">
                {displayScore}
              </span>
              <span className="text-sm text-neutral-400">/ {totalNum} điểm</span>
            </div>
            <div className="bg-success-100 dark:bg-success-900/40 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-success-600 h-full rounded-full"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        )}

        {isInProgress && (
          <Button
            asChild
            size="lg"
            className="bg-warning-500 hover:bg-warning-600 w-full rounded-xl font-semibold text-white"
          >
            <Link href={`/exams/${exam.id}/room`}>
              <Play className="h-4 w-4 fill-current" />
              Tiếp tục làm bài
            </Link>
          </Button>
        )}

        {!isInProgress && isCompleted && (
          <div className="flex w-full items-center gap-2">
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-xl font-semibold">
              <Link href={`/exams/${exam.id}/result`}>Xem kết quả</Link>
            </Button>
            {renderSecondaryAction(canTakeExam, cooldownRemaining, exam.id)}
          </div>
        )}

        {!isInProgress && !isCompleted && (
          <Button
            asChild
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 w-full rounded-xl font-semibold text-white"
          >
            <Link href={`/exams/${exam.id}/room`}>
              <Play className="h-4 w-4 fill-current" />
              Bắt đầu làm bài
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ExamCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
