import { MainFooter, MainNavbar } from "@/components/layout";
import { StudentExamListContainer } from "@/features/exams/components/student-exam-list-container";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Thi Thử Hóa Học | ThFat Edu",
  description: "Luyện đề thi thử trực tuyến mô phỏng kỳ thi tốt nghiệp THPT chuẩn Bộ GD&ĐT",
};

export default function StudentExamsPage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary-600 flex min-h-screen flex-col selection:text-white">
      <MainNavbar />
      <main className="flex-1 bg-neutral-50/60 dark:bg-neutral-950/60">
        <Suspense>
          <StudentExamListContainer />
        </Suspense>
      </main>
      <MainFooter />
    </div>
  );
}
