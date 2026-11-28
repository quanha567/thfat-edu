import { ExamCreatePageClient } from "@/features/exams/components/create/exam-create-page-client";

export const metadata = {
  title: "Tạo đề thi mới | ThFat Edu Admin",
  description: "Nhập đề thi thủ công hoặc tạo bằng AI từ tệp PDF",
};

export default function AdminExamCreatePage() {
  return <ExamCreatePageClient />;
}
