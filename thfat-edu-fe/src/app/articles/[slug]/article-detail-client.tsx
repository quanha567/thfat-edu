"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ArticleDetailView, useArticle } from "@/features/articles";
import { use } from "react";

export type TArticleDetailClientProps = {
  params: Promise<{ slug: string }>;
};

export function ArticleDetailClient({ params }: TArticleDetailClientProps) {
  const { slug } = use(params);
  const { data: article, isLoading, error } = useArticle({ idOrSlug: slug, isAdmin: false });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-12">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="space-y-3 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-foreground">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Bài viết này không tồn tại hoặc đã được chuyển vào lưu trữ. Vui lòng quay lại danh sách bài viết.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <ArticleDetailView article={article} />
    </div>
  );
}
