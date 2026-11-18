import { MainFooter, MainNavbar } from "@/components/layout";
import { StudentExamListContainer } from "@/features/exams/components/student-exam-list-container";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Thư Viện Đề Thi & Khảo Thí Hóa Học",
  description:
    "Luyện thi trắc nghiệm Hóa học với ngân hàng đề thi chuẩn cấu trúc, chấm điểm tự động và lời giải chi tiết.",
  alternates: {
    canonical: "/exams",
  },
};

export default function StudentExamsPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 pt-16 dark:bg-neutral-950/60">
        <Suspense>
          <StudentExamListContainer />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
