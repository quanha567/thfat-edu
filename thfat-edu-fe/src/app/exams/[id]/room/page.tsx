import { Spinner } from "@/components/ui/spinner";
import { ExamRoomContainer } from "@/features/exams/components/exam-room-container";
import { Suspense } from "react";

export const metadata = {
  title: "Phòng thi trực tuyến | ThFat Edu",
  description: "Không gian làm bài thi trắc nghiệm Hóa học chuẩn cấu trúc",
};

export default function ExamRoomPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-50">
          <Spinner className="text-primary-600 h-8 w-8" />
          <p className="text-sm font-medium text-neutral-600">Đang chuẩn bị phòng thi...</p>
        </div>
      }
    >
      <ExamRoomContainer params={params} />
    </Suspense>
  );
}
