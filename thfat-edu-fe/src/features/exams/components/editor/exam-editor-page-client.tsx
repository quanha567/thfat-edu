"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useQuizDetail } from "../../hooks/use-quiz-detail";
import { ExamEditorContainer } from "./exam-editor-container";

export type TExamEditorPageClientProps = {
  examId: string;
};

export function ExamEditorPageClient({ examId }: TExamEditorPageClientProps) {
  const { data: exam, isLoading, isError, error, refetch } = useQuizDetail(examId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Đang tải dữ liệu đề thi...</p>
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="bg-destructive/10 text-destructive rounded-full p-3">
          <AlertCircle className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-foreground text-base font-bold">Không thể tải đề thi</h2>
          <p className="text-muted-foreground text-xs">
            {error instanceof Error ? error.message : "Đề thi không tồn tại hoặc đã bị xóa."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/exams" className="gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Quay lại danh sách
            </Link>
          </Button>
          <Button size="sm" onClick={() => refetch()} className="text-xs">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return <ExamEditorContainer exam={exam} />;
}
