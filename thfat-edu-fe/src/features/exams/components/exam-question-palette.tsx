"use client";

import { Flag } from "lucide-react";

import { type TExamRoomQuestion, type TExamRoomSection } from "../types";

export type TExamQuestionPaletteProps = {
  sections: TExamRoomSection[];
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  activeQuestionId?: string | null;
  onSelectQuestion: (questionId: string) => void;
  className?: string;
};

export function getQuestionState(
  q: TExamRoomQuestion,
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>,
) {
  const totalInQ = q.subItems.length;
  const answeredInQ = q.subItems.filter((si) => Boolean(answersMap[si.id]?.selectedAnswer)).length;
  const isFlagged = q.subItems.some((si) => Boolean(answersMap[si.id]?.isFlagged));
  const isFullyAnswered = totalInQ > 0 && answeredInQ === totalInQ;
  const isPartiallyAnswered = answeredInQ > 0 && answeredInQ < totalInQ;

  return { isFullyAnswered, isPartiallyAnswered, isFlagged };
}

export function getButtonClassName(
  isFullyAnswered: boolean,
  isPartiallyAnswered: boolean,
  isActive = false,
): string {
  if (isFullyAnswered) {
    if (isActive) {
      return "border-2 border-primary-300 bg-primary-800 text-white font-black shadow-sm z-10";
    }

    return "bg-primary-700 text-white hover:bg-primary-800";
  }

  if (isPartiallyAnswered) {
    if (isActive) {
      return "border-2 border-primary-800 bg-primary-100 text-primary-900 font-black shadow-xs z-10";
    }

    return "border-2 border-primary-600 bg-primary-50 text-primary-900 font-extrabold hover:bg-primary-100";
  }

  if (isActive) {
    return "border-2 border-primary-600 bg-primary-50/50 text-primary-700 font-extrabold shadow-xs z-10";
  }

  return "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50";
}

export function ExamQuestionPalette({
  sections,
  answersMap,
  activeQuestionId,
  onSelectQuestion,
  className = "",
}: TExamQuestionPaletteProps) {
  const allQuestions = sections.flatMap((s) => s.questions);
  const totalQuestions = allQuestions.length;

  const completedQuestionsCount = allQuestions.filter((q) => {
    const { isFullyAnswered } = getQuestionState(q, answersMap);

    return isFullyAnswered;
  }).length;

  const flaggedQuestionsCount = allQuestions.filter((q) => {
    const { isFlagged } = getQuestionState(q, answersMap);

    return isFlagged;
  }).length;

  let globalQuestionIndex = 0;

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-900">Bảng câu hỏi</h3>
        <span className="text-xs font-medium text-neutral-500">
          {completedQuestionsCount} / {totalQuestions} câu
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
        <div className="flex items-center gap-1.5">
          <span className="bg-primary-700 h-3 w-3 rounded-xs" />
          <span>Đã làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="border-primary-600 bg-primary-50 h-3 w-3 rounded-xs border-2" />
          <span>Làm một phần</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-xs border border-neutral-300 bg-white" />
          <span>Chưa làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="bg-warning-500 flex h-3 w-3 items-center justify-center rounded-xs text-white">
            <Flag className="h-2 w-2 fill-current" />
          </span>
          <span>Đánh dấu ({flaggedQuestionsCount})</span>
        </div>
      </div>

      <div className="max-h-[calc(100vh-280px)] space-y-4 overflow-y-auto pr-1">
        {sections.map((section, sIndex) => (
          <div key={section.id || sIndex} className="space-y-2">
            <p className="truncate text-xs font-semibold text-neutral-500">{section.title}</p>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-4 md:grid-cols-5">
              {section.questions.map((q) => {
                globalQuestionIndex++;
                const questionNumber = globalQuestionIndex;
                const { isFullyAnswered, isPartiallyAnswered, isFlagged } = getQuestionState(
                  q,
                  answersMap,
                );
                const isActive = q.id === activeQuestionId;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onSelectQuestion(q.id)}
                    className={`relative flex h-9 w-full items-center justify-center rounded-md text-xs font-bold transition-all ${getButtonClassName(
                      isFullyAnswered,
                      isPartiallyAnswered,
                      isActive,
                    )}`}
                  >
                    {questionNumber}
                    {isFlagged && (
                      <span className="bg-warning-500 absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-white shadow-xs">
                        <Flag className="h-2 w-2 fill-current" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
