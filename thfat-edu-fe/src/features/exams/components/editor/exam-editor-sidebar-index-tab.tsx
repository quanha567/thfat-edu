"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Eye } from "lucide-react";

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

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <ExamEditorSidebarProgress
        percentComplete={percentComplete}
        errorCount={errorCount}
        hasErrors={hasErrors}
        onCollapseAll={onCollapseAll}
        onExpandAll={onExpandAll}
      />

      <ScrollArea className="flex-1 min-h-0 p-3">
        <div className="space-y-3">
          {sections.map((section, sIdx) => (
            <ExamEditorSidebarSectionGroup
              key={section.sectionType || sIdx}
              section={section}
              sectionIndex={sIdx}
              errorQuestionKeys={errorQuestionKeys}
              activeKey={activeKey}
              onSelectQuestion={onSelectQuestion}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-border/60 bg-muted/20 border-t px-3.5 py-2.5 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
          <span>Đang chọn:</span>
          <Badge
            variant="secondary"
            className="px-2 py-0.5 text-[11px] font-bold text-foreground bg-background shadow-2xs border border-border/60"
          >
            Câu {activeQuestionNumber}
          </Badge>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSwitchToPreview}
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 px-2.5 text-xs font-semibold gap-1 rounded-md transition-colors"
        >
          <Eye className="size-3.5" />
          <span>Xem trước câu này</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
