"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  ChevronsDownUp,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";

export type TExamEditorSidebarProgressProps = {
  percentComplete: number;
  errorCount: number;
  hasErrors: boolean;
  onCollapseAll: () => void;
  onExpandAll: () => void;
};

export function ExamEditorSidebarProgress({
  percentComplete,
  errorCount,
  hasErrors,
  onCollapseAll,
  onExpandAll,
}: TExamEditorSidebarProgressProps) {
  return (
    <div className="border-border/60 bg-muted/20 border-b p-3.5 space-y-2.5 shrink-0">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-foreground/90">
          <Sparkles className="size-3.5 text-primary" />
          <span>Tiến độ hợp lệ</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums font-mono ${
            hasErrors
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {percentComplete}%
        </span>
      </div>

      <Progress value={percentComplete} className="h-1.5 rounded-full" />

      <div className="flex items-center justify-between pt-0.5 text-xs">
        {hasErrors ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
            <AlertCircle className="size-3 shrink-0" />
            <span>{errorCount} câu cần kiểm tra</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3 shrink-0" />
            <span>Tất cả hợp lệ</span>
          </span>
        )}

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onCollapseAll}
            className="text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800 h-6 px-1.5 text-[11px] gap-1 rounded-md"
            title="Thu gọn tất cả câu hỏi"
          >
            <ChevronsDownUp className="size-3" />
            <span className="hidden sm:inline">Thu gọn</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onExpandAll}
            className="text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800 h-6 px-1.5 text-[11px] gap-1 rounded-md"
            title="Mở rộng tất cả câu hỏi"
          >
            <ChevronsUpDown className="size-3" />
            <span className="hidden sm:inline">Mở rộng</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
