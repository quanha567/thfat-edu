"use client";

import { ChemRenderer } from "@/components/chemistry/chem-renderer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

import { type TExamRoomQuestion, type TSectionType } from "../types";
import { sanitizeDisplayContext } from "../utils/sanitize-context";
import { GroupMcqOptions } from "./group-mcq-options";
import { MatchingTable } from "./matching-table";
import { TrueFalseTable } from "./true-false-table";

export type TExamQuestionViewerProps = {
  question: TExamRoomQuestion;
  sectionType: TSectionType;
  questionNumber: number;
  answersMap: Record<string, { selectedAnswer: string | null; isFlagged: boolean }>;
  onAnswerChange: (subItemId: string, value: string) => void;
  onToggleFlag: (subItemId: string) => void;
};

type TRenderSectionContentOptions = Omit<TExamQuestionViewerProps, "questionNumber"> & {
  isSingleSubItem: boolean;
};

function formatSubLabel(label?: string | null): string {
  if (!label) {
    return "";
  }

  if (label.toLowerCase().includes("câu")) {
    return `${label}.`;
  }

  return `Câu ${label}.`;
}

function renderSectionContent({
  question,
  sectionType,
  answersMap,
  onAnswerChange,
  onToggleFlag,
  isSingleSubItem,
}: TRenderSectionContentOptions) {
  if (sectionType === "true_false") {
    return (
      <TrueFalseTable
        subItems={question.subItems}
        answersMap={answersMap}
        onAnswerChange={onAnswerChange}
        onToggleFlag={onToggleFlag}
      />
    );
  }

  if (sectionType === "matching") {
    return (
      <MatchingTable
        subItems={question.subItems}
        answersMap={answersMap}
        onAnswerChange={onAnswerChange}
        onToggleFlag={onToggleFlag}
        contextContent={question.contextContent}
      />
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {question.subItems.map((si) => {
        const state = answersMap[si.id];
        const selectedAnswer = state?.selectedAnswer ?? "";
        const isFlagged = state?.isFlagged ?? false;
        const isContentDifferent =
          si.content.trim() !== question.contextContent?.trim() && !isSingleSubItem;
        const subLabel = formatSubLabel(si.label);

        return (
          <div key={si.id} id={`subitem-${si.id}`} className="scroll-mt-24 space-y-3">
            {isContentDifferent && (
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 text-sm leading-relaxed font-medium text-neutral-900">
                  {subLabel && (
                    <span className="shrink-0 font-bold text-neutral-800">{subLabel}</span>
                  )}
                  <ChemRenderer content={si.content} />
                </div>

                {!isSingleSubItem && (
                  <button
                    type="button"
                    onClick={() => onToggleFlag(si.id)}
                    title={isFlagged ? "Bỏ đánh dấu" : "Đánh dấu xem lại"}
                    className={cn(
                      "shrink-0 rounded-md p-1.5 transition-colors",
                      isFlagged
                        ? "bg-warning-100 text-warning-700 hover:bg-warning-200"
                        : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600",
                    )}
                  >
                    <Flag className={cn("h-4 w-4", isFlagged && "fill-current")} />
                  </button>
                )}
              </div>
            )}

            <div>
              {sectionType === "group_mcq" && (
                <GroupMcqOptions
                  subItemId={si.id}
                  options={si.options}
                  selectedAnswer={selectedAnswer}
                  onAnswerChange={onAnswerChange}
                />
              )}
              {sectionType === "short_answer" && (
                <Input
                  type="text"
                  placeholder="Nhập câu trả lời (số hoặc ký hiệu)..."
                  value={selectedAnswer}
                  onChange={(e) => onAnswerChange(si.id, e.target.value)}
                  className="max-w-xs bg-white font-medium"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ExamQuestionViewer({
  question,
  sectionType,
  questionNumber,
  answersMap,
  onAnswerChange,
  onToggleFlag,
}: TExamQuestionViewerProps) {
  const isSingleSubItem = question.subItems.length === 1;
  const singleSubItem = isSingleSubItem ? question.subItems[0] : null;
  const isSingleFlagged = singleSubItem ? Boolean(answersMap[singleSubItem.id]?.isFlagged) : false;
  const displayContext = sanitizeDisplayContext(
    question.contextContent,
    sectionType,
    question.subItems.length > 0,
  );

  return (
    <div
      id={`question-${question.id}`}
      className="scroll-mt-20 scroll-mb-36 space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 items-start gap-2.5 text-sm leading-relaxed">
            <span className="bg-primary-100 text-primary-800 inline-flex shrink-0 rounded-md px-2.5 py-1 text-xs font-bold">
              {sectionType === "group_mcq" && question.subItems.length > 1
                ? `Chùm câu hỏi (Câu ${questionNumber} – ${questionNumber + question.subItems.length - 1})`
                : `Câu ${questionNumber}`}
            </span>
            {displayContext && (
              <div className="prose prose-neutral max-w-none pt-0.5 text-sm font-medium text-neutral-900">
                <ChemRenderer content={displayContext} />
              </div>
            )}
          </div>

          {singleSubItem && (
            <button
              type="button"
              onClick={() => onToggleFlag(singleSubItem.id)}
              title={isSingleFlagged ? "Bỏ đánh dấu" : "Đánh dấu xem lại"}
              className={cn(
                "shrink-0 rounded-md p-1.5 transition-colors",
                isSingleFlagged
                  ? "bg-warning-100 text-warning-700 hover:bg-warning-200"
                  : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600",
              )}
            >
              <Flag className={cn("h-4 w-4", isSingleFlagged && "fill-current text-warning-500")} />
            </button>
          )}
        </div>

        {question.imageUrl && (
          <div className="my-2 flex justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.imageUrl}
              alt={`Hình ảnh câu ${questionNumber}`}
              className="max-h-80 max-w-full rounded-md object-contain"
            />
          </div>
        )}
      </div>

      {renderSectionContent({
        question,
        sectionType,
        answersMap,
        onAnswerChange,
        onToggleFlag,
        isSingleSubItem,
      })}
    </div>
  );
}
