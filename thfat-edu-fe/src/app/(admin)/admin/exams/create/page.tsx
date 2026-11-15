import { ExamCreatePageClient } from "@/features/exams/components/create/exam-create-page-client";

export const metadata = {
  title: "Tạo & Import đề thi mới | ThFat Edu Admin",
  description: "Trình bóc tách và tạo đề thi tự động bằng AI",
};

export default function AdminExamCreatePage() {
  return <ExamCreatePageClient />;
}
