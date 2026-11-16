import { AdminPageHeader } from "@/components/layout/admin";
import { ArticleListTable } from "@/features/articles";

export const metadata = {
  title: "Quản lý bài viết | ThFat Edu Admin",
  description: "Danh sách và quản lý bài viết, tin tức, cẩm nang học tập",
};

export default function AdminArticlesPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-8 lg:px-8">
      <AdminPageHeader
        title="Quản lý bài viết"
        description="Soạn thảo, quản lý và xuất bản các bài viết, tin tức khảo thí và cẩm nang ôn thi"
      />
      <div className="w-full">
        <ArticleListTable />
      </div>
    </div>
  );
}
