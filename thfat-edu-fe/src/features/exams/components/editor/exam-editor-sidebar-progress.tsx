"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

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
    <div className="border-border/40 bg-muted/10 flex shrink-0 items-center justify-between border-b px-3.5 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            hasErrors ? "bg-destructive animate-pulse" : "bg-success-500",
          )}
        />
        <span className="text-foreground text-xs font-semibold">
          {hasErrors ? `${errorCount} câu cần kiểm tra` : "Đề thi hợp lệ"}
        </span>
        <span className="text-muted-foreground text-xxs font-mono">({percentComplete}%)</span>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onCollapseAll}
          className="text-muted-foreground hover:text-foreground text-xxs h-6.5 cursor-pointer gap-1 rounded px-2"
          title="Thu gọn tất cả câu hỏi"
        >
          <ChevronsDownUp className="size-3" />
          <span>Thu gọn</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onExpandAll}
          className="text-muted-foreground hover:text-foreground text-xxs h-6.5 cursor-pointer gap-1 rounded px-2"
          title="Mở rộng tất cả câu hỏi"
        >
          <ChevronsUpDown className="size-3" />
          <span>Mở rộng</span>
        </Button>
      </div>
    </div>
  );
}
