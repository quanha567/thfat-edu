"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { type TExamRoomQuestion } from "../types";
import { getButtonClassName, getQuestionState } from "./exam-question-palette";

export type TExamQuestionStripItem = TExamRoomQuestion & {
  index: number;
  sectionTitle: string;
};

export type TExamQuestionStripProps = {
  questions: TExamQuestionStripItem[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  activeQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
};

export function ExamQuestionStrip({
  questions,
  answersMap,
  activeQuestionId,
  onSelectQuestion,
}: TExamQuestionStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = stripRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    if (!activeQuestionId || !stripRef.current) return;

    const activeEl = stripRef.current.querySelector<HTMLButtonElement>(
      `[data-question-id="${activeQuestionId}"]`,
    );

    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
      setTimeout(checkScroll, 300);
    }
  }, [activeQuestionId, checkScroll]);

  const handleScrollLeft = () => {
    stripRef.current?.scrollBy({ left: -220, behavior: "smooth" });
    setTimeout(checkScroll, 250);
  };

  const handleScrollRight = () => {
    stripRef.current?.scrollBy({ left: 220, behavior: "smooth" });
    setTimeout(checkScroll, 250);
  };

  return (
    <div className="flex min-w-0 flex-1 items-center justify-center px-1 sm:px-2">
      <div className="flex max-w-full min-w-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          className={cn(
            "h-8 w-8 min-w-8 rounded-lg shrink-0 border-neutral-200 bg-white text-neutral-700 shadow-2xs hover:bg-neutral-100 transition-opacity",
            !canScrollLeft && "opacity-30 cursor-not-allowed",
          )}
          title="Cuộn sang trái"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={stripRef}
          className="flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto scroll-smooth px-1.5 py-1 [&::-webkit-scrollbar]:hidden"
        >
          {questions.map((q) => {
            const { isFullyAnswered, isPartiallyAnswered, isFlagged } = getQuestionState(
              q,
              answersMap,
            );
            const isActive = q.id === activeQuestionId;

            return (
              <button
                key={q.id}
                data-question-id={q.id}
                type="button"
                onClick={() => onSelectQuestion(q.id)}
                title={`Câu ${q.index}: ${q.sectionTitle}`}
                className={`relative flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-all ${getButtonClassName(
                  isFullyAnswered,
                  isPartiallyAnswered,
                  isActive,
                )}`}
              >
                {q.index}
                {isFlagged && (
                  <span className="bg-warning-500 absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full text-white shadow-xs">
                    <Flag className="h-2 w-2 fill-current" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          className={cn(
            "h-8 w-8 min-w-8 rounded-lg shrink-0 border-neutral-200 bg-white text-neutral-700 shadow-2xs hover:bg-neutral-100 transition-opacity",
            !canScrollRight && "opacity-30 cursor-not-allowed",
          )}
          title="Cuộn sang phải"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
