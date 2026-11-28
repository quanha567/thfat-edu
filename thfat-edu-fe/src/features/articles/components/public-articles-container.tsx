"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import { useArticles } from "../hooks/use-articles";
import { ArticleCard } from "./article-card";
import { ArticleFeaturedCard } from "./article-featured-card";
import { ArticlePublicFilters } from "./article-public-filters";

const PAGE_SIZE = 12;
const SKELETON_KEYS = Array.from({ length: 6 }, (_, i) => `article-skeleton-${i + 1}`);
const GRID_CLASS = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

export function PublicArticlesContainer() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [categorySlug, setCategorySlug] = useQueryState(
    "category",
    parseAsString.withDefault("all"),
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const categoryId =
    categorySlug === "all" ? undefined : categories.find((c) => c.slug === categorySlug)?.id;

  const { data, isLoading } = useArticles({
    query: {
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      categoryId,
    },
    isAdmin: false,
  });

  const articles = data?.items ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);
  const isPending = isLoading || (categorySlug !== "all" && isCategoriesLoading);
  const hasFilter = categorySlug !== "all" || Boolean(search.trim());
  const showFeatured = page === 1 && !hasFilter && articles.length > 1;
  const [featured, ...rest] = articles;
  const gridItems = showFeatured ? rest : articles;

  function handleCategoryChange(slug: string) {
    void setCategorySlug(slug === "all" ? null : slug);
    void setPage(null);
  }

  function handleSearchChange(value: string) {
    void setSearch(value || null);
    void setPage(null);
  }

  function handlePageChange(next: number) {
    void setPage(next === 1 ? null : next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderContent() {
    if (isPending) {
      return (
        <div className={GRID_CLASS}>
          {SKELETON_KEYS.map((key) => (
            <div key={key} className="border-border space-y-3 rounded-2xl border p-4">
              <Skeleton className="aspect-16/10 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="border-border/80 bg-card rounded-2xl border p-12 text-center">
          <p className="text-foreground font-semibold">
            {search ? "Không tìm thấy bài viết phù hợp." : "Chưa có bài viết nào."}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Hãy thử từ khóa hoặc chuyên mục khác.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {showFeatured && featured && <ArticleFeaturedCard article={featured} />}

        <div className={GRID_CLASS}>
          {gridItems.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">
          Tin tức <span className="text-primary-600 dark:text-primary-400">&amp; Cẩm nang</span>
        </h1>
        <p className="text-muted-foreground text-base">Thông tin kỳ thi và kinh nghiệm ôn luyện.</p>
      </div>

      <ArticlePublicFilters
        categories={categories}
        categorySlug={categorySlug}
        onCategoryChange={handleCategoryChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      {renderContent()}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="rounded-full"
          >
            Trang trước
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="rounded-full"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
