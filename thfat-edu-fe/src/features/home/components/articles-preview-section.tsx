"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleCard, useArticles } from "@/features/articles";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";

export function ArticlesPreviewSection() {
  const { data, isLoading } = useArticles({
    query: { page: 1, limit: 3 },
    isAdmin: false,
  });

  const articles = data?.items ?? [];

  if (!isLoading && articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-background border-t border-border/60 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="text-primary-600 dark:text-primary-400 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <Newspaper className="size-4" />
              Bản tin ThFat Edu
            </span>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Tin tức & Cẩm nang ôn thi
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Các thông báo mới nhất và bài viết hướng dẫn phương pháp giải đề Hóa học.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="gap-1.5 self-start text-xs font-semibold sm:self-auto">
            <Link href="/articles">
              Xem tất cả bài viết
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["preview-skel-1", "preview-skel-2", "preview-skel-3"].map((key) => (
              <div key={key} className="space-y-3 rounded-xl border border-border p-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
