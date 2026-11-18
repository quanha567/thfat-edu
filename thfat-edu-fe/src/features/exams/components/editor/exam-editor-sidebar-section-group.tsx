"use client";

import { cn } from "@/lib/utils";

import { type TQuizSection } from "../../types";

export type TExamEditorSidebarSectionGroupProps = {
  section: TQuizSection;
  sectionIndex: number;
  startQuestionNumber?: number;
  errorQuestionKeys: Set<string>;
  activeKey: string | null;
  onSelectQuestion: (sectionIdx: number, questionIdx: number) => void;
};

function parseSectionTitle(rawTitle: string) {
  const match = rawTitle.match(/^(PHẦN\s+[IVXLCDM\d]+)\s*:\s*(.+)$/i);
  if (!match) {
    return { part: null, name: rawTitle };
  }

  return {
    part: match[1].trim(),
    name: match[2].trim(),
  };
}

function getQuestionButtonClass(isActive: boolean, isErr: boolean) {
  if (isActive) {
    return "bg-primary text-primary-foreground font-bold border border-primary shadow-2xs";
  }

  if (isErr) {
    return "border border-destructive/50 bg-destructive/10 text-destructive font-bold hover:bg-destructive/15";
  }

  return "border border-border/60 bg-muted/20 text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary";
}

export function ExamEditorSidebarSectionGroup({
  section,
  sectionIndex,
  startQuestionNumber = 1,
  errorQuestionKeys,
  activeKey,
  onSelectQuestion,
}: TExamEditorSidebarSectionGroupProps) {
  const { part, name } = parseSectionTitle(section.title);

  return (
    <div className="space-y-2 border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between text-xs px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {part ? (
            <span className="font-bold text-primary text-xs shrink-0">{part}:</span>
          ) : null}
          <span className="truncate font-semibold text-foreground text-xs" title={section.title}>
            {name}
          </span>
        </div>

        <span className="text-muted-foreground text-[11px] font-medium shrink-0">
          {section.sectionType === "group_mcq"
            ? `${section.questions.reduce((acc, q) => acc + (q.subItems?.length || 1), 0)} câu (${section.questions.length} chùm)`
            : `${section.questions.length} câu`}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {section.sectionType === "group_mcq"
          ? (() => {
              let subCounter = 0;

              return section.questions.flatMap((q, qIdx) => {
                const qKey = `${sectionIndex}-${qIdx}`;
                const isErr = errorQuestionKeys.has(qKey);
                const isActive = activeKey === qKey;
                const statusClass = getQuestionButtonClass(isActive, isErr);

                if (!q.subItems || q.subItems.length === 0) {
                  const qNum = startQuestionNumber + subCounter++;

                  return (
                    <button
                      key={qKey}
                      type="button"
                      onClick={() => onSelectQuestion(sectionIndex, qIdx)}
                      className={cn(
                        "relative flex h-8 w-full items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors cursor-pointer",
                        statusClass,
                      )}
                      title={`Chuyển tới câu ${qNum} (${section.title})`}
                    >
                      {qNum}
                    </button>
                  );
                }

                return q.subItems.map((si, sIdx) => {
                  const subKey = `${sectionIndex}-${qIdx}-sub-${sIdx}`;
                  const qNum = startQuestionNumber + subCounter++;
                  const parsedLabelNum = si.label?.match(/\d+/)?.[0];
                  const displayNum = parsedLabelNum ? Number(parsedLabelNum) : qNum;

                  return (
                    <button
                      key={subKey}
                      type="button"
                      onClick={() => {
                        onSelectQuestion(sectionIndex, qIdx);
                        const cardId = `question-card-${sectionIndex}-${qIdx}`;
                        const el = document.getElementById(`subitem-${cardId}-${sIdx}`);
                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={cn(
                        "relative flex h-8 w-full items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors cursor-pointer",
                        statusClass,
                      )}
                      title={`Chuyển tới ${si.label || `Câu ${displayNum}`} (${section.title})`}
                    >
                      {displayNum}
                    </button>
                  );
                });
              });
            })()
          : section.questions.map((_, qIdx) => {
              const key = `${sectionIndex}-${qIdx}`;
              const isErr = errorQuestionKeys.has(key);
              const isActive = activeKey === key;
              const statusClass = getQuestionButtonClass(isActive, isErr);
              const questionNumber = startQuestionNumber + qIdx;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectQuestion(sectionIndex, qIdx)}
                  className={cn(
                    "relative flex h-8 w-full items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-colors cursor-pointer",
                    statusClass,
                  )}
                  title={`Chuyển tới câu ${questionNumber} (${section.title})`}
                >
                  {questionNumber}
                  {isErr && !isActive && (
                    <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-destructive" />
                  )}
                </button>
              );
            })}
      </div>
    </div>
  );
}
