"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ArticleForm, useArticle } from "@/features/articles";

export type TAdminEditArticleClientProps = {
  id: string;
};

export function AdminEditArticleClient({ id }: TAdminEditArticleClientProps) {
  const { data: article, isLoading, error } = useArticle({ idOrSlug: id, isAdmin: true });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-xl border p-6 text-center">
        <p className="text-sm font-semibold">
          Không thể tải thông tin bài viết này hoặc bài viết không tồn tại.
        </p>
      </div>
    );
  }

  return <ArticleForm article={article} />;
}
