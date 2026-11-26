"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, FileText, GraduationCap, Play, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";

import { formatExamCode } from "../constants/exam.constants";
import { type TStudentExamListItem } from "../types";

export type TStudentExamCardProps = {
  exam: TStudentExamListItem;
};

type TBadgeConfig = {
  className: string;
  dotClass: string;
  text: string;
};

function getBadgeConfig(
  isCompleted: boolean,
  isInProgress: boolean,
  canTakeExam: boolean,
): TBadgeConfig {
  if (isInProgress) {
    return {
      className:
        "border-warning-200/90 bg-warning-50 text-warning-700 dark:border-warning-800/60 dark:bg-warning-950/50 dark:text-warning-300 font-semibold",
      dotClass: "bg-warning-500 animate-pulse",
      text: "Đang làm",
    };
  }

  if (isCompleted) {
    if (!canTakeExam) {
      return {
        className:
          "border-neutral-200 bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 font-medium",
        dotClass: "bg-neutral-400",
        text: "Hết lượt làm bài",
      };
    }

    return {
      className:
        "border-success-200/90 bg-success-50 text-success-700 dark:border-success-800/60 dark:bg-success-950/50 dark:text-success-300 font-semibold",
      dotClass: "bg-success-500",
      text: "Đã nộp bài",
    };
  }

  return {
    className:
      "border-primary-200/80 bg-primary-50/70 text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-300 font-medium",
    dotClass: "bg-primary-500",
    text: "Chưa làm",
  };
}

function renderAttemptCountText(maxAttempts?: number | null, attemptCount = 0) {
  if (maxAttempts && maxAttempts > 0) {
    return (
      <span>
        Lượt thi:{" "}
        <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
          {attemptCount}
        </strong>
        /{maxAttempts}
      </span>
    );
  }

  if (attemptCount > 0) {
    return (
      <span>
        Đã thi:{" "}
        <strong className="font-semibold text-neutral-800 dark:text-neutral-200">
          {attemptCount}
        </strong>{" "}
        lần
      </span>
    );
  }

  return <span className="text-neutral-400">Lượt thi: Không giới hạn</span>;
}

function renderSecondaryAction(canTakeExam: boolean, cooldownRemaining: number, examId: string) {
  if (canTakeExam) {
    return (
      <Button
        asChild
        size="lg"
        className="bg-primary-600 hover:bg-primary-700 flex-1 rounded-xl font-semibold text-white shadow-xs transition-colors"
      >
        <Link href={`/exams/${examId}/room`} className="flex items-center justify-center gap-1.5">
          <RotateCcw className="h-4 w-4" />
          <span>Thi lại</span>
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
  const examCode = formatExamCode(exam.id);

  const badgeConfig = getBadgeConfig(isCompleted, isInProgress, canTakeExam);

  const scoreNum = displayScore ? parseFloat(displayScore) : 0;
  const totalNum = parseFloat(exam.totalPoints) || 150;
  const scorePercentage = Math.min(100, Math.max(0, Math.round((scoreNum / totalNum) * 100)));

  return (
    <Card className="group hover:border-primary-300 dark:hover:border-primary-700 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Top subtle ambient glow */}
      <div className="bg-primary-500/5 group-hover:bg-primary-500/10 pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300" />

      {/* Top section: Code, Status & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="text-xxs inline-flex items-center gap-1.5 rounded-md border border-neutral-200/80 bg-neutral-50 px-2 py-0.5 font-mono font-semibold tracking-wide text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
            <GraduationCap className="text-primary-600 dark:text-primary-400 h-3 w-3" />
            <span>{examCode}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${badgeConfig.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${badgeConfig.dotClass}`} />
            <span>{badgeConfig.text}</span>
          </div>
        </div>

        <h3 className="group-hover:text-primary-600 line-clamp-2 text-base font-bold tracking-tight text-neutral-900 transition-colors sm:text-lg dark:text-neutral-100 dark:group-hover:text-cyan-400">
          {exam.title}
        </h3>

        {exam.description && (
          <p className="mt-1 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
            {exam.description}
          </p>
        )}
      </div>

      {/* Middle section: Metrics & Score Summary */}
      <div className="mt-5 space-y-3">
        {/* Score banner when completed */}
        {isCompleted && displayScore !== null && (
          <div className="border-success-100 bg-success-50/50 dark:border-success-950 dark:bg-success-950/20 rounded-xl border p-2.5">
            <div className="flex items-center justify-between">
              <div className="text-success-800 dark:text-success-300 flex items-center gap-1.5 text-xs font-semibold">
                <Trophy className="text-success-600 h-3.5 w-3.5" />
                <span>Điểm đạt được:</span>
              </div>
              <div className="text-success-900 dark:text-success-200 text-xs font-bold">
                <span className="text-success-700 dark:text-success-400 text-sm font-extrabold">
                  {displayScore}
                </span>
                <span className="text-neutral-400"> / {exam.totalPoints}đ</span>
              </div>
            </div>
            <div className="bg-success-200/60 dark:bg-success-900/40 mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-success-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Info badges row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2.5 py-2 dark:border-neutral-800 dark:bg-neutral-800/40">
            <Clock className="text-primary-500 h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{exam.durationMinutes} phút</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50/80 px-2.5 py-2 dark:border-neutral-800 dark:bg-neutral-800/40">
            <FileText className="text-primary-500 h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">
              {exam.totalQuestions > 0
                ? `${exam.totalQuestions} câu hỏi`
                : `${exam.totalPoints} điểm`}
            </span>
          </div>
        </div>

        {/* Attempt count details */}
        <div className="flex items-center justify-between px-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{renderAttemptCountText(maxAttempts, attemptCount)}</span>
          <span className="text-xxs font-mono text-neutral-400">{exam.totalPoints}đ tối đa</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        {isInProgress && (
          <Button
            asChild
            size="lg"
            className="group/btn bg-warning-500 hover:bg-warning-600 w-full rounded-xl font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <Link
              href={`/exams/${exam.id}/room`}
              className="flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-current transition-transform duration-200 group-hover/btn:scale-110" />
              <span>Tiếp tục làm bài</span>
              <ArrowRight className="ml-auto h-4 w-4 opacity-70 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        )}

        {!isInProgress && isCompleted && (
          <div className="flex w-full items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 rounded-xl border-neutral-200 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Link
                href={`/exams/${exam.id}/result`}
                className="flex items-center justify-center gap-1.5"
              >
                <FileText className="h-4 w-4 text-neutral-500" />
                <span>Xem kết quả</span>
              </Link>
            </Button>
            {renderSecondaryAction(canTakeExam, cooldownRemaining, exam.id)}
          </div>
        )}

        {!isInProgress && !isCompleted && (
          <Button
            asChild
            size="lg"
            className="group/btn bg-primary-600 hover:bg-primary-700 w-full rounded-xl font-semibold text-white shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <Link
              href={`/exams/${exam.id}/room`}
              className="flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-current transition-transform duration-200 group-hover/btn:scale-110" />
              <span>Bắt đầu làm bài</span>
              <ArrowRight className="ml-auto h-4 w-4 opacity-70 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ExamCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <div className="flex items-center justify-between pb-3">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
      </div>

      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
