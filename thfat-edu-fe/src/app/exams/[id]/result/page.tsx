import { Spinner } from "@/components/ui/spinner";
import { ExamResultContainer } from "@/features/exams/components/exam-result-container";
import { Suspense } from "react";

export const metadata = {
  title: "Kết quả bài thi | ThFat Edu",
  description: "Bảng điểm chi tiết và đánh giá năng lực bài thi Hóa học",
};

export default function ExamResultPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <Spinner className="text-primary-600 h-8 w-8" />
        </div>
      }
    >
      <ExamResultContainer params={params} />
    </Suspense>
  );
}
