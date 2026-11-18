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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <ExamEditorSidebarProgress
        percentComplete={percentComplete}
        errorCount={errorCount}
        hasErrors={hasErrors}
        onCollapseAll={onCollapseAll}
        onExpandAll={onExpandAll}
      />

      <ScrollArea className="flex-1 min-h-0 px-3.5 py-2.5">
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

      <div className="border-border/40 bg-muted/10 border-t px-3.5 py-2 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
          <span className="text-[11px]">Đang chọn:</span>
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold text-xs font-mono">
            Câu {activeQuestionNumber}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSwitchToPreview}
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 px-2 text-xs font-semibold gap-1 rounded cursor-pointer"
        >
          <Eye className="size-3.5" />
          <span>Xem trước câu này</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
