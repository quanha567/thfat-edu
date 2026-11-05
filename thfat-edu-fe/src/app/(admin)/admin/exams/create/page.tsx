import { AdminPageHeader } from "@/components/layout/admin/admin-page-header";
import { ExamPdfUploader } from "@/features/exams/components/exam-pdf-uploader";

export const metadata = {
  title: "Tạo & Nhập đề thi | ThFat Edu Admin",
  description: "Bóc tách đề thi từ PDF bằng NVIDIA Vision",
};

export default function AdminExamsCreatePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tạo đề thi mới"
        description="Số hóa đề thi Hóa học tự động từ file PDF hoặc khởi tạo bộ câu hỏi thủ công."
      />
      <ExamPdfUploader />
    </div>
  );
}
