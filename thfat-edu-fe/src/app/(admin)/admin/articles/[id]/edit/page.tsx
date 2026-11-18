import { AdminPageHeader } from "@/components/layout/admin";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

import { AdminEditArticleClient } from "./edit-client";

export const metadata = {
  title: "Chỉnh sửa bài viết | ThFat Edu Admin",
  description: "Cập nhật nội dung và trạng thái bài viết",
};

export type TAdminEditArticlePageProps = {
  params: Promise<{ id: string }>;
};

async function ArticleEditLoader({ params }: TAdminEditArticlePageProps) {
  const { id } = await params;

  return <AdminEditArticleClient id={id} />;
}

export default function AdminEditArticlePage({ params }: TAdminEditArticlePageProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-8 lg:px-8">
      <AdminPageHeader
        title="Chỉnh sửa bài viết"
        description="Cập nhật nội dung, thay đổi chuyên mục hoặc điều chỉnh trạng thái xuất bản"
      />
      <div className="w-full">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
              <Spinner className="text-primary h-8 w-8" />
              <p className="text-muted-foreground text-sm font-medium">Đang tải bài viết...</p>
            </div>
          }
        >
          <ArticleEditLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
