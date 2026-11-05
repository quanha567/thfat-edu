"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

import { useExamDetail } from "../hooks/use-exam-detail";
import { ExamEditorWorkspace } from "./exam-editor-workspace";

export type TExamEditContainerProps = {
  examId: string;
};

export function ExamEditContainer({ examId }: TExamEditContainerProps) {
  const { data: exam, isLoading, error } = useExamDetail(examId);

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-3">
        <Spinner className="text-primary size-8" />
        <p className="text-muted-foreground text-sm">Đang tải dữ liệu đề thi và câu hỏi...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-3 text-center">
        <FileQuestion className="text-destructive/60 size-12" />
        <h3 className="text-foreground text-lg font-semibold">Không tìm thấy đề thi</h3>
        <p className="text-muted-foreground text-sm">
          {error ? (error as Error).message : "Đề thi không tồn tại hoặc đã bị xóa."}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/admin/exams">
            <ArrowLeft className="mr-1.5 size-4" /> Quay lại ngân hàng đề
          </Link>
        </Button>
      </div>
    );
  }

  return <ExamEditorWorkspace exam={exam} />;
}
