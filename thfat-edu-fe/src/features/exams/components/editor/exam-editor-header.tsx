"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ExternalLink, Eye, Loader2, PenLine, Save } from "lucide-react";

export type TExamEditorHeaderProps = {
  title: string;
  isDirty: boolean;
  isSaving: boolean;
  examId: string;
  editorMode: "edit" | "preview";
  onToggleEditorMode: (mode: "edit" | "preview") => void;
  onSave: () => void;
  onBack: () => void;
};

export function ExamEditorHeader({
  title,
  isDirty,
  isSaving,
  examId,
  editorMode,
  onToggleEditorMode,
  onSave,
  onBack,
}: TExamEditorHeaderProps) {
  const handlePreview = () => {
    if (!examId) return;
    window.open(`/exams/${examId}`, "_blank");
  };

  return (
    <header className="border-border bg-background sticky top-0 z-20 flex h-14 w-full shrink-0 items-center justify-between border-b px-4 shadow-xs md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              aria-label="Quay lại danh sách đề thi"
            >
              <ArrowLeft className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Quay lại danh sách đề thi</TooltipContent>
        </Tooltip>

        <div className="flex min-w-0 items-center gap-2.5">
          <h1 className="text-foreground truncate text-sm font-bold sm:text-base">
            {title || "Chỉnh sửa đề thi"}
          </h1>

          {isDirty ? (
            <Badge
              variant="outline"
              className="border-warning-500/30 bg-warning-500/10 text-warning-700 dark:text-warning-400 text-[11px] font-medium"
            >
              Chưa lưu thay đổi
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-success-500/30 bg-success-500/10 text-success-700 dark:text-success-400 text-[11px] font-medium"
            >
              <Check className="mr-1 size-3" />
              Đã lưu
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="bg-muted/60 flex items-center rounded-lg p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onToggleEditorMode("edit")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all",
              editorMode === "edit"
                ? "bg-background text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <PenLine className="size-3.5" />
            <span className="hidden sm:inline">Soạn thảo</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleEditorMode("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all",
              editorMode === "preview"
                ? "bg-background text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="gap-1.5 text-xs font-semibold"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Phòng thi</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Mở giao diện làm bài của học sinh</TooltipContent>
        </Tooltip>

        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="gap-1.5 text-xs font-semibold shadow-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Lưu thay đổi</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
