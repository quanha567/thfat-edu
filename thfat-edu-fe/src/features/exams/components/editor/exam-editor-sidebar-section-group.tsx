"use client";

import { Badge } from "@/components/ui/badge";

import { type TQuizSection } from "../../types";

export type TExamEditorSidebarSectionGroupProps = {
  section: TQuizSection;
  sectionIndex: number;
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

export function ExamEditorSidebarSectionGroup({
  section,
  sectionIndex,
  errorQuestionKeys,
  activeKey,
  onSelectQuestion,
}: TExamEditorSidebarSectionGroupProps) {
  const { part, name } = parseSectionTitle(section.title);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-3 space-y-2.5 shadow-2xs transition-colors hover:border-border/90">
      <div className="flex items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {part ? (
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/25">
              {part}
            </span>
          ) : null}
          <span
            className="truncate font-semibold text-foreground/90 text-xs"
            title={section.title}
          >
            {name}
          </span>
        </div>

        <Badge
          variant="secondary"
          className="shrink-0 text-[10px] font-medium px-1.5 py-0 rounded-full text-muted-foreground"
        >
          {section.questions.length} câu
        </Badge>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {section.questions.map((_, qIdx) => {
          const key = `${sectionIndex}-${qIdx}`;
          const isErr = errorQuestionKeys.has(key);
          const isActive = activeKey === key;

          let buttonClass =
            "border border-border/70 bg-neutral-50/70 text-foreground/80 hover:border-primary/40 hover:bg-primary-50/60 hover:text-primary active:scale-95 shadow-2xs dark:bg-neutral-900/40 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-primary-950/40 dark:hover:border-primary-700";

          if (isErr) {
            buttonClass =
              "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold ring-1 ring-destructive/20 relative";
          } else if (isActive) {
            buttonClass =
              "bg-primary text-primary-foreground font-bold border-primary shadow-xs ring-2 ring-primary/25 ring-offset-2 ring-offset-background scale-[1.04] z-10";
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectQuestion(sectionIndex, qIdx)}
              className={`flex h-8 sm:h-8.5 w-full items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-all duration-150 cursor-pointer ${buttonClass}`}
              title={`Chuyển tới câu ${qIdx + 1} (${section.title})`}
            >
              {qIdx + 1}
              {isErr && !isActive && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
