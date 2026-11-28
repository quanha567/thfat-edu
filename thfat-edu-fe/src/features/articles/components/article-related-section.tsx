"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useArticles } from "../hooks/use-articles";
import { ArticleCard } from "./article-card";

const RELATED_COUNT = 3;

export type TArticleRelatedSectionProps = {
  currentId: string;
  categoryId: string | null;
};

export function ArticleRelatedSection({ currentId, categoryId }: TArticleRelatedSectionProps) {
  const { data } = useArticles({
    query: { limit: RELATED_COUNT + 1, categoryId: categoryId ?? undefined },
    isAdmin: false,
  });

  const related = (data?.items ?? [])
    .filter((article) => article.id !== currentId)
    .slice(0, RELATED_COUNT);

  if (related.length === 0) return null;

  return (
    <section className="border-border mx-auto max-w-5xl space-y-6 border-t pt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Bài viết khác</h2>
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/articles">
            Xem tất cả
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
