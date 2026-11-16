import { AdminPageHeader } from "@/components/layout/admin";
import { Button } from "@/components/ui/button";
import { ExamListTable } from "@/features/exams/components/exam-list-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Đề thi | ThFat Edu Admin",
  description: "Danh sách và quản lý đề thi trong hệ thống",
};

export default function AdminExamsPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Đề thi"
        actions={
          <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/exams/create">
              <Plus className="size-3.5" />
              <span>Tạo đề thi mới</span>
            </Link>
          </Button>
        }
      />
      <ExamListTable />
    </div>
  );
}
