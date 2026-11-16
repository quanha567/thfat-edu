import { AdminPageHeader } from "@/components/layout/admin";
import { CategoryListTable } from "@/features/categories";

export const metadata = {
  title: "Quản lý chuyên mục | ThFat Edu Admin",
  description: "Tạo và quản lý các chuyên mục phân loại bài viết, tin tức và cẩm nang",
};

export default function AdminCategoriesPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-8 lg:px-8">
      <AdminPageHeader
        title="Quản lý chuyên mục"
        description="Tạo và quản lý các chuyên mục phân loại bài viết, tin tức khảo thí và cẩm nang học tập"
      />
      <div className="w-full">
        <CategoryListTable />
      </div>
    </div>
  );
}
