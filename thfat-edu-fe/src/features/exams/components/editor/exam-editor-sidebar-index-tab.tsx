"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Eye } from "lucide-react";
import { useMemo } from "react";

import { type TQuizSection } from "../../types";
import { ExamEditorSidebarProgress } from "./exam-editor-sidebar-progress";
import { ExamEditorSidebarSectionGroup } from "./exam-editor-sidebar-section-group";

export type TExamEditorSidebarIndexTabProps = {
  sections: TQuizSection[];
  errorQuestionKeys: Set<string>;
  totalQuestions: number;
  activeKey: string | null;
  activeQuestionNumber: number;
  onSelectQuestion: (sectionIdx: number, questionIdx: number) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onSwitchToPreview: () => void;
};

export function ExamEditorSidebarIndexTab({
  sections,
  errorQuestionKeys,
  totalQuestions,
  activeKey,
  activeQuestionNumber,
  onSelectQuestion,
  onExpandAll,
  onCollapseAll,
  onSwitchToPreview,
}: TExamEditorSidebarIndexTabProps) {
  const errorCount = errorQuestionKeys.size;
  const validCount = Math.max(0, totalQuestions - errorCount);
  const percentComplete =
    totalQuestions > 0 ? Math.round((validCount / totalQuestions) * 100) : 100;
  const hasErrors = errorCount > 0;

  const sectionStartNumbers = useMemo(() => {
    const startNumbers: number[] = [];
    let running = 0;

    for (const sec of sections) {
      startNumbers.push(running + 1);
      if (sec.sectionType === "group_mcq") {
        const totalSubs = sec.questions.reduce((acc, q) => acc + (q.subItems?.length || 1), 0);
        running += Math.max(sec.questions.length, totalSubs);
      } else {
        running += sec.questions.length;
      }
    }

    return startNumbers;
  }, [sections]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ExamEditorSidebarProgress
        percentComplete={percentComplete}
        errorCount={errorCount}
        hasErrors={hasErrors}
        onCollapseAll={onCollapseAll}
        onExpandAll={onExpandAll}
      />

      <ScrollArea className="min-h-0 flex-1 px-3.5 py-2.5">
        <div className="space-y-3">
          {sections.map((section, sIdx) => (
            <ExamEditorSidebarSectionGroup
              key={section.sectionType || sIdx}
              section={section}
              sectionIndex={sIdx}
              startQuestionNumber={sectionStartNumbers[sIdx] ?? 1}
              errorQuestionKeys={errorQuestionKeys}
              activeKey={activeKey}
              onSelectQuestion={onSelectQuestion}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-border/40 bg-muted/10 flex shrink-0 items-center justify-between border-t px-3.5 py-2 text-xs">
        <div className="text-muted-foreground flex min-w-0 items-center gap-1.5">
          <span className="text-[11px]">Đang chọn:</span>
          <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2 py-0.5 font-mono text-xs font-bold">
            Câu {activeQuestionNumber}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSwitchToPreview}
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 cursor-pointer gap-1 rounded px-2 text-xs font-semibold"
        >
          <Eye className="size-3.5" />
          <span>Xem trước câu này</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
