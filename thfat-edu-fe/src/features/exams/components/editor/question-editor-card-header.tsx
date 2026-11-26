"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Copy, Loader2, Sparkles } from "lucide-react";

import { QuestionDeleteDialog } from "./question-delete-dialog";

export type TQuestionEditorCardHeaderProps = {
  questionNumber: number;
  customBadge?: string;
  pointsLabel?: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isCollapsed?: boolean;
  isSolving?: boolean;
  onToggleCollapse?: () => void;
  onAutoSolve?: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export function QuestionEditorCardHeader({
  questionNumber,
  customBadge,
  pointsLabel: _pointsLabel,
  canMoveUp,
  canMoveDown,
  isCollapsed,
  isSolving = false,
  onToggleCollapse,
  onAutoSolve,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: TQuestionEditorCardHeaderProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className={`space-y-2 ${isCollapsed ? "" : "border-border/30 border-b pb-2"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onToggleCollapse && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onToggleCollapse}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isCollapsed ? "Mở rộng câu hỏi" : "Thu gọn câu hỏi"}
              >
                {isCollapsed ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronUp className="size-4" />
                )}
              </Button>
            )}

            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 border px-2.5 py-0.5 text-xs font-bold transition-colors">
              {customBadge || `Câu ${questionNumber}`}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {onAutoSolve && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={onAutoSolve}
                    disabled={isSolving}
                    className="text-primary hover:bg-primary/10 hover:text-primary h-7 px-2 text-xs font-semibold"
                  >
                    {isSolving ? (
                      <Loader2 className="mr-1 size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 size-3.5" />
                    )}
                    {isSolving ? "Đang giải..." : "AI Giải câu này"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tự động suy luận và điền đáp án bằng AI</TooltipContent>
              </Tooltip>
            )}

            <div className="bg-border/60 mx-0.5 h-3.5 w-px" />

            <div className="flex items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 hover:opacity-100">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={onMoveUp}
                    disabled={!canMoveUp}
                    aria-label="Di chuyển lên"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Di chuyển lên</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={onMoveDown}
                    disabled={!canMoveDown}
                    aria-label="Di chuyển xuống"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Di chuyển xuống</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={onDuplicate}
                    aria-label="Nhân bản câu hỏi"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Nhân bản câu hỏi</TooltipContent>
              </Tooltip>

              <QuestionDeleteDialog questionNumber={questionNumber} onDelete={onDelete} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
