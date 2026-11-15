"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Check, ExternalLink, Loader2, Save } from "lucide-react";

export type TExamEditorHeaderProps = {
  title: string;
  isDirty: boolean;
  isSaving: boolean;
  examId: string;
  onSave: () => void;
  onBack: () => void;
};

export function ExamEditorHeader({
  title,
  isDirty,
  isSaving,
  examId,
  onSave,
  onBack,
}: TExamEditorHeaderProps) {
  const handlePreview = () => {
    if (!examId) return;
    window.open(`/exams/${examId}`, "_blank");
  };

  return (
    <TooltipProvider delayDuration={200}>
      <header className="bg-background/95 supports-backdrop-filter:bg-background/80 border-border sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 shadow-xs backdrop-blur-md md:px-6 lg:px-8">
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
                className="border-amber-500/30 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-400"
              >
                Chưa lưu thay đổi
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
              >
                <Check className="mr-1 size-3" />
                Đã lưu
              </Badge>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
                <span className="hidden sm:inline">Xem trước</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Mở giao diện phòng thi của học sinh</TooltipContent>
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
    </TooltipProvider>
  );
}
