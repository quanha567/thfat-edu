import { AdminPageHeader } from "@/components/layout/admin/admin-page-header";
import { ExamListTable } from "@/features/exams/components/exam-list-table";

export const metadata = {
  title: "Ngân hàng đề thi | ThFat Edu Admin",
  description: "Quản lý và số hóa ngân hàng đề thi môn Hóa học",
};

export default function AdminExamsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ngân hàng đề thi"
        description="Quản lý các bộ đề thi thử Hóa học 150 điểm, nhập đề tự động từ PDF và biên tập câu hỏi."
      />
      <ExamListTable />
    </div>
  );
}
