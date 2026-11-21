import { AdminPageHeader } from "@/components/layout/admin";
import { Button } from "@/components/ui/button";
import { ArticleListTable } from "@/features/articles";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Quản lý bài viết | ThFat Edu Admin",
  description: "Danh sách và quản lý bài viết, tin tức, cẩm nang học tập",
};

export default function AdminArticlesPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6 lg:px-8 lg:py-6">
      <AdminPageHeader
        title="Quản lý bài viết"
        description="Soạn thảo, quản lý và xuất bản các bài viết, tin tức khảo thí và cẩm nang ôn thi"
        actions={
          <Button asChild size="sm" className="gap-1.5 text-xs font-semibold">
            <Link href="/admin/articles/create">
              <FilePlus2 className="size-3.5" />
              <span>Viết bài mới</span>
            </Link>
          </Button>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <ArticleListTable />
      </div>
    </div>
  );
}
