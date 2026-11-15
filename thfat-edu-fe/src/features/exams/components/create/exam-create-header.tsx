"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Loader2, Save, Sparkles } from "lucide-react";
import Link from "next/link";

export type TExamCreateHeaderProps = {
  isSaving: boolean;
  canSave: boolean;
  onSave: () => void;
};

export function ExamCreateHeader({ isSaving, canSave, onSave }: TExamCreateHeaderProps) {
  return (
    <div className="border-border flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Link
            href="/admin/exams"
            className="hover:text-foreground flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Quản lý đề thi</span>
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-semibold">Tạo & Import đề thi</span>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-h2 text-foreground font-bold tracking-tight">
            Import đề thi bằng AI
          </h1>
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            <Sparkles className="size-3" />
            NVIDIA NIM
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
          <Link href="/admin/exams">Hủy bỏ</Link>
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="gap-1.5 text-xs font-semibold"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Đang lưu đề...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Lưu vào Ngân hàng Đề</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
