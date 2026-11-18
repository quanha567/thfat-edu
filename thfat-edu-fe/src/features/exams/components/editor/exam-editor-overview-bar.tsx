"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, FileText, Settings2, Trophy } from "lucide-react";

import { type TExamStatus } from "../../types";

export type TExamEditorOverviewBarProps = {
  title: string;
  durationMinutes: number;
  totalPoints: string;
  status: TExamStatus;
  pdfUrl?: string | null;
  onOpenEdit: () => void;
};

const STATUS_CONFIG: Record<
  TExamStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Bản nháp", variant: "secondary" },
  published: { label: "Đã xuất bản", variant: "default" },
  archived: { label: "Lưu trữ", variant: "outline" },
};

export function ExamEditorOverviewBar({
  title,
  durationMinutes,
  totalPoints,
  status,
  pdfUrl,
  onOpenEdit,
}: TExamEditorOverviewBarProps) {
  const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <div className="bg-card border-border flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-2.5 shadow-2xs">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-muted-foreground text-xs font-semibold">Đề thi:</span>
          <span className="text-foreground max-w-md truncate text-xs font-bold sm:text-sm">
            {title || "Chưa đặt tên đề thi"}
          </span>
        </div>

        <div className="bg-border hidden h-4 w-px sm:block" />

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
            <Clock className="size-3.5" />
            <span>{durationMinutes} phút</span>
          </div>

          <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
            <Trophy className="size-3.5" />
            <span>{totalPoints} điểm</span>
          </div>

          <Badge variant={currentStatus.variant} className="text-[11px] font-semibold">
            {currentStatus.label}
          </Badge>

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
              title={pdfUrl}
            >
              <FileText className="size-3.5" />
              <span>PDF gốc</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onOpenEdit}
        className="gap-1.5 text-xs font-semibold"
      >
        <Settings2 className="size-3.5" />
        <span>Cài đặt đề thi</span>
      </Button>
    </div>
  );
}
