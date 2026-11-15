"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { useExamResult } from "../hooks/use-exam-result";
import { ExamResultSummary } from "./exam-result-summary";

export type TExamResultContainerProps = {
  params: Promise<{ id: string }>;
};

export function ExamResultContainer({ params }: TExamResultContainerProps) {
  const { id: examId } = use(params);
  const { data, isLoading, isError, error } = useExamResult(examId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <Spinner className="text-primary-600 h-8 w-8" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md text-center">
          <p className="text-lg font-bold text-neutral-800">Không tìm thấy kết quả bài thi</p>
          <p className="mt-1 text-sm text-neutral-500">
            {error?.message || "Bài thi chưa được nộp hoặc chưa có kết quả."}
          </p>
          <Button asChild variant="outline" className="mt-4 gap-2">
            <Link href="/exams">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách đề thi
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/60 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 print:min-h-0 print:bg-white print:p-0">
      <ExamResultSummary result={data} />
    </div>
  );
}
