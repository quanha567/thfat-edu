"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories";
import { Search } from "lucide-react";
import { useState } from "react";

import { useArticles } from "../hooks/use-articles";
import { ArticleCard } from "./article-card";

export function PublicArticlesContainer() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useCategories();

  const queryParams = {
    page,
    limit: 12,
    search: search.trim() || undefined,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
  };

  const { data, isLoading } = useArticles({ query: queryParams, isAdmin: false });
  const articles = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {["skel-1", "skel-2", "skel-3", "skel-4", "skel-5", "skel-6"].map((key) => (
            <div key={key} className="border-border space-y-3 rounded-xl border p-4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="border-border/80 bg-card rounded-2xl border p-12 text-center shadow-2xs">
          <p className="text-muted-foreground text-base font-semibold">
            {search
              ? "Không tìm thấy bài viết phù hợp với từ khóa."
              : "Chưa có bài viết nào trong chuyên mục này."}
          </p>
          <span className="text-muted-foreground/80 mt-1 block text-xs">
            Vui lòng quay lại sau hoặc thử tìm kiếm với từ khóa khác.
          </span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header Banner */}
      <div className="mb-10 text-center sm:mb-12">
        <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          Tin tức & Cẩm nang học tập
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm sm:text-base">
          Cập nhật thông tin mới nhất về các kỳ thi khảo thí, quy chế thi, kinh nghiệm ôn luyện và
          kiến thức trọng tâm từ ThFat Edu.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
            className="rounded-full text-xs font-semibold"
          >
            Tất cả
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={selectedCategory === c.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(c.id);
                setPage(1);
              }}
              className="rounded-full text-xs font-semibold"
            >
              {c.name}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-full pl-9 text-xs sm:text-sm"
          />
        </div>
      </div>

      {renderContent()}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs"
          >
            Trang trước
          </Button>
          <span className="text-muted-foreground text-xs font-medium">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
