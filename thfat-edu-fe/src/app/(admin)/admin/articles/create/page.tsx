import { AdminPageHeader } from "@/components/layout/admin";
import { ArticleForm } from "@/features/articles";

export const metadata = {
  title: "Tạo bài viết mới | ThFat Edu Admin",
  description: "Soạn thảo bài viết mới bằng trình soạn thảo Tiptap",
};

export default function AdminCreateArticlePage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-8 lg:px-8">
      <AdminPageHeader
        title="Tạo bài viết mới"
        description="Soạn thảo nội dung bài viết, phân loại chuyên mục và thiết lập xuất bản"
      />
      <div className="w-full">
        <ArticleForm />
      </div>
    </div>
  );
}
