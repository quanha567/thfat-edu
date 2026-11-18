"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ChevronLeft, ChevronRight, LocateFixed } from "lucide-react";

import { type TQuizQuestion, type TSectionType } from "../../types";
import { ExamEditorLivePreview } from "./exam-editor-live-preview";

export type TExamEditorSidebarPreviewTabProps = {
  activeQuestion: TQuizQuestion | null;
  activeSectionTitle?: string;
  activeSectionType?: TSectionType;
  activeQuestionNumber: number;
  currentIndex: number;
  totalQuestions: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onJumpToEditor: () => void;
  onSwitchToIndex: () => void;
};

export function ExamEditorSidebarPreviewTab({
  activeQuestion,
  activeSectionTitle,
  activeSectionType,
  activeQuestionNumber,
  currentIndex,
  totalQuestions,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onJumpToEditor,
  onSwitchToIndex,
}: TExamEditorSidebarPreviewTabProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-border/40 bg-muted/10 flex shrink-0 items-center justify-between border-b px-3.5 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Badge className="bg-primary text-primary-foreground shrink-0 px-2 py-0.5 text-[11px] font-bold shadow-2xs">
            Câu {activeQuestionNumber}
          </Badge>
          {activeSectionTitle && (
            <Badge
              variant="outline"
              className="border-border/70 bg-background/60 max-w-[140px] truncate text-[10px] font-medium"
            >
              {activeSectionTitle}
            </Badge>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onPrev}
            disabled={!hasPrev}
            className="border-border/70 h-7 w-7 rounded-md p-0"
            title="Câu trước"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="text-muted-foreground px-1 font-mono text-[11px] font-medium tabular-nums">
            {currentIndex >= 0 ? currentIndex + 1 : 0}/{totalQuestions}
          </span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onNext}
            disabled={!hasNext}
            className="border-border/70 h-7 w-7 rounded-md p-0"
            title="Câu sau"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 p-3.5">
        <ExamEditorLivePreview
          question={activeQuestion}
          sectionTitle={activeSectionTitle}
          sectionType={activeSectionType}
          questionNumber={activeQuestionNumber}
        />
      </ScrollArea>

      <div className="border-border/40 bg-muted/10 flex shrink-0 items-center justify-between border-t px-3 py-2 text-xs">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onJumpToEditor}
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 gap-1 rounded-md px-2 text-xs font-semibold transition-colors"
        >
          <LocateFixed className="mr-0.5 size-3.5" />
          Cuộn tới câu này
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSwitchToIndex}
          className="text-muted-foreground hover:text-foreground h-7 gap-1 rounded-md px-2 text-xs font-medium transition-colors hover:bg-neutral-200/50 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="size-3.5" />
          Về mục lục
        </Button>
      </div>
    </div>
  );
}
