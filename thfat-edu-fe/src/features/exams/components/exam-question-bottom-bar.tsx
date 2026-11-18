"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useMemo } from "react";

import { type TExamRoomSection } from "../types";
import { getQuestionState } from "./exam-question-palette";
import { ExamQuestionStrip } from "./exam-question-strip";

export type TExamQuestionBottomBarProps = {
  sections: TExamRoomSection[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  activeQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function ExamQuestionBottomBar({
  sections,
  answersMap,
  activeQuestionId,
  onSelectQuestion,
  onPrevQuestion,
  onNextQuestion,
  canPrev,
  canNext,
}: TExamQuestionBottomBarProps) {
  const flattenedQuestions = useMemo(() => {
    let count = 0;

    return sections.flatMap((sec) =>
      sec.questions.map((q) => {
        count++;

        return { ...q, index: count, sectionTitle: sec.title };
      }),
    );
  }, [sections]);

  const totalQuestions = flattenedQuestions.length;

  const { completedCount, partialCount, flaggedCount } = useMemo(() => {
    let completed = 0;
    let partial = 0;
    let flagged = 0;

    for (const q of flattenedQuestions) {
      const state = getQuestionState(q, answersMap);
      if (state.isFullyAnswered) completed++;
      if (state.isPartiallyAnswered) partial++;
      if (state.isFlagged) flagged++;
    }

    return { completedCount: completed, partialCount: partial, flaggedCount: flagged };
  }, [flattenedQuestions, answersMap]);

  const unansweredCount = Math.max(0, totalQuestions - completedCount - partialCount);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200/80 bg-white/95 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md sm:py-2.5">
      {/* Hàng chú thích nằm ngay trên danh sách câu hỏi */}
      <div className="text-2xs flex items-center justify-center gap-3 border-b border-neutral-100 px-4 pb-1.5 text-neutral-600 sm:gap-6 sm:text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="bg-primary-700 h-2.5 w-2.5 rounded-xs sm:h-3 sm:w-3" />
          <span>Đã làm ({completedCount})</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="border-primary-600 bg-primary-50 h-2.5 w-2.5 rounded-xs border-2 sm:h-3 sm:w-3" />
          <span>Làm một phần ({partialCount})</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="h-2.5 w-2.5 rounded-xs border border-neutral-300 bg-white sm:h-3 sm:w-3" />
          <span>Chưa làm ({unansweredCount})</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="bg-warning-500 flex h-2.5 w-2.5 items-center justify-center rounded-xs text-white sm:h-3 sm:w-3">
            <Flag className="h-1.5 w-1.5 fill-current sm:h-2 sm:w-2" />
          </span>
          <span>Đánh dấu ({flaggedCount})</span>
        </div>

        <div className="hidden font-semibold text-neutral-500 md:inline">
          ({completedCount}/{totalQuestions} câu)
        </div>
      </div>

      {/* Hàng danh sách câu hỏi + Nút chuyển trái phải */}
      <div className="container mx-auto flex items-center justify-between gap-2 px-3 pt-1.5 sm:gap-3 sm:px-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevQuestion}
          disabled={!canPrev}
          className="shrink-0 gap-1 text-xs font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Câu trước</span>
        </Button>

        <ExamQuestionStrip
          questions={flattenedQuestions}
          answersMap={answersMap}
          activeQuestionId={activeQuestionId}
          onSelectQuestion={onSelectQuestion}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNextQuestion}
          disabled={!canNext}
          className="shrink-0 gap-1 text-xs font-semibold"
        >
          <span className="hidden sm:inline">Câu sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
}
