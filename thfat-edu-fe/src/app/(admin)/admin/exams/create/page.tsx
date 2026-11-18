import { ExamCreatePageClient } from "@/features/exams/components/create/exam-create-page-client";

export const metadata = {
  title: "Tạo đề thi từ tệp | ThFat Edu Admin",
  description: "Tải lên tệp đề thi PDF để bóc tách câu hỏi và lưu vào hệ thống",
};

export default function AdminExamCreatePage() {
  return <ExamCreatePageClient />;
}
