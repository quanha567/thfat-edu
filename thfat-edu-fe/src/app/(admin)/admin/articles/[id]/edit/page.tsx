import { AdminPageHeader } from "@/components/layout/admin";

import { AdminEditArticleClient } from "./edit-client";

export const metadata = {
  title: "Chỉnh sửa bài viết | ThFat Edu Admin",
  description: "Cập nhật nội dung và trạng thái bài viết",
};

export type TAdminEditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditArticlePage({ params }: TAdminEditArticlePageProps) {
  const { id } = await params;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-8 lg:px-8">
      <AdminPageHeader
        title="Chỉnh sửa bài viết"
        description="Cập nhật nội dung, thay đổi chuyên mục hoặc điều chỉnh trạng thái xuất bản"
      />
      <div className="w-full">
        <AdminEditArticleClient id={id} />
      </div>
    </div>
  );
}
