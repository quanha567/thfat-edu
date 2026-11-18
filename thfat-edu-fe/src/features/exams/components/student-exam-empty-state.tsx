"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, FlaskConical, RotateCcw, SearchX, Trophy } from "lucide-react";
import Link from "next/link";

export type TStudentExamEmptyStateProps = {
  hasActiveFilter: boolean;
  onResetFilters?: () => void;
};

export function StudentExamEmptyState({
  hasActiveFilter,
  onResetFilters,
}: TStudentExamEmptyStateProps) {
  if (hasActiveFilter) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-8 text-center backdrop-blur-sm sm:p-12 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 shadow-inner dark:bg-neutral-800 dark:text-neutral-400">
          <SearchX className="h-8 w-8" />
        </div>

        <h3 className="mt-5 text-lg font-bold text-neutral-800 sm:text-xl dark:text-neutral-100">
          Không tìm thấy đề thi phù hợp
        </h3>

        <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          Không có đề thi nào khớp với từ khóa tìm kiếm hoặc trạng thái bạn đã chọn. Hãy thử điều
          chỉnh lại bộ lọc.
        </p>

        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-6 gap-2 rounded-xl border-neutral-300 font-semibold shadow-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            <RotateCcw className="h-4 w-4" />
            Xóa bộ lọc &amp; Xem tất cả
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-primary-200/80 bg-gradient-to-b from-primary-50/40 via-white to-primary-50/20 p-8 text-center shadow-xs sm:p-14 dark:border-primary-900/40 dark:from-primary-950/20 dark:via-neutral-900/60 dark:to-primary-950/10">
      {/* Decorative background blur glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary-400/10 blur-3xl" />

      {/* Modern Badge Icon */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-200 bg-white text-primary-600 shadow-lg shadow-primary-500/10 dark:border-primary-800 dark:bg-neutral-800 dark:text-primary-400">
        <FlaskConical className="h-10 w-10 animate-pulse duration-1000" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-primary-500" />
        </span>
      </div>

      <h3 className="mt-6 text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50">
        Phòng thi đang chuẩn bị đề mới
      </h3>

      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
        Thầy cô đang hoàn thiện các bộ đề thi thử Hóa học mới nhất chuẩn ma trận đề thi tốt nghiệp
        THPT. Trong thời gian này, bạn có thể củng cố kiến thức hoặc xem bảng xếp hạng.
      </p>

      {/* Quick Action CTAs */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="gap-2 rounded-xl shadow-md">
          <Link href="/articles">
            <BookOpen className="h-4 w-4" />
            Đọc bài viết ôn tập
          </Link>
        </Button>

        <Button asChild variant="outline" className="gap-2 rounded-xl">
          <Link href="/leaderboard">
            <Trophy className="text-gold-500 h-4 w-4" />
            Xem Bảng xếp hạng
          </Link>
        </Button>
      </div>
    </div>
  );
}
