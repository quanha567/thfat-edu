"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
} from "lucide-react";

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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="border-border/40 bg-muted/10 border-b px-3.5 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Badge className="text-[11px] font-bold px-2 py-0.5 shrink-0 bg-primary text-primary-foreground shadow-2xs">
            Câu {activeQuestionNumber}
          </Badge>
          {activeSectionTitle && (
            <Badge
              variant="outline"
              className="truncate text-[10px] max-w-[140px] font-medium border-border/70 bg-background/60"
            >
              {activeSectionTitle}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onPrev}
            disabled={!hasPrev}
            className="h-7 w-7 p-0 rounded-md border-border/70"
            title="Câu trước"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <span className="text-[11px] font-mono font-medium text-muted-foreground px-1 tabular-nums">
            {currentIndex >= 0 ? currentIndex + 1 : 0}/{totalQuestions}
          </span>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onNext}
            disabled={!hasNext}
            className="h-7 w-7 p-0 rounded-md border-border/70"
            title="Câu sau"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 p-3.5">
        <ExamEditorLivePreview
          question={activeQuestion}
          sectionTitle={activeSectionTitle}
          sectionType={activeSectionType}
          questionNumber={activeQuestionNumber}
        />
      </ScrollArea>

      <div className="border-border/40 bg-muted/10 border-t px-3 py-2 flex items-center justify-between shrink-0 text-xs">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onJumpToEditor}
          className="text-primary hover:text-primary hover:bg-primary/10 h-7 px-2 text-xs font-semibold gap-1 rounded-md transition-colors"
        >
          <LocateFixed className="size-3.5 mr-0.5" />
          Cuộn tới câu này
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onSwitchToIndex}
          className="text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800 h-7 px-2 text-xs font-medium gap-1 rounded-md transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Về mục lục
        </Button>
      </div>
    </div>
  );
}
