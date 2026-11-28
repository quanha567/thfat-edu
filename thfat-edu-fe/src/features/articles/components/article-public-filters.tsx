"use client";

import { Input } from "@/components/ui/input";
import { type TCategory } from "@/features/categories";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export type TArticlePublicFiltersProps = {
  categories: TCategory[];
  categorySlug: string;
  onCategoryChange: (slug: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function ArticlePublicFilters({
  categories,
  categorySlug,
  onCategoryChange,
  search,
  onSearchChange,
}: TArticlePublicFiltersProps) {
  const tabs = [{ slug: "all", name: "Tất cả" }, ...categories];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:pb-0">
        {tabs.map((tab) => {
          const isActive = categorySlug === tab.slug;

          return (
            <button
              key={tab.slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(tab.slug)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary-600 bg-primary-600 text-white shadow-xs"
                  : "text-muted-foreground hover:border-primary-300 hover:text-foreground bg-background border-neutral-200 dark:border-neutral-800",
              )}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm bài viết..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background h-9 rounded-full pl-10 text-sm"
        />
      </div>
    </div>
  );
}
