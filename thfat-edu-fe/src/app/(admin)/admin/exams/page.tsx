import { ExamListTable } from "@/features/exams/components/exam-list-table";
import { ExamPageHero } from "@/features/exams/components/exam-page-hero";

export const metadata = {
  title: "Quản lý đề thi | ThFat Edu Admin",
  description: "Tạo, quản lý và theo dõi các đề thi V-SAT hiệu quả",
};

export default function AdminExamsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 lg:px-8 lg:py-6">
      <ExamPageHero />
      <ExamListTable />
    </div>
  );
}
