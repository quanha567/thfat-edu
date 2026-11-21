"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/features/articles/hooks/use-articles";
import { ArrowRight, ChevronDown, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TResourcesDropdownProps = {
  label: string;
  href: string;
};

export function ResourcesDropdown({ label, href }: TResourcesDropdownProps) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);

  const { data, isLoading } = useArticles({
    query: { page: 1, limit: 5 },
    isAdmin: false,
  });

  const articles = data?.items ?? [];

  function renderArticleList() {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 p-2">
          {["skel-res-1", "skel-res-2", "skel-res-3", "skel-res-4", "skel-res-5"].map((key) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-4/5 bg-white/15" />
              <Skeleton className="h-3 w-1/3 bg-white/10" />
            </div>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return <div className="py-6 text-center text-xs text-white/60">Chưa có bài viết nào</div>;
    }

    return (
      <div className="flex flex-col gap-0.5">
        {articles.slice(0, 5).map((article) => {
          const formattedDate = article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString("vi-VN")
            : new Date(article.createdAt).toLocaleDateString("vi-VN");

          return (
            <DropdownMenuItem
              key={article.id}
              asChild
              className="group cursor-pointer rounded-lg p-2.5 text-white/90 transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white"
            >
              <Link href={`/articles/${article.slug}`} className="flex w-full flex-col gap-1">
                <span className="group-hover:text-primary-300 line-clamp-2 text-xs leading-snug font-semibold text-white/95 transition-colors">
                  {article.title}
                </span>
                <div className="text-xxs flex items-center gap-2 text-white/60">
                  {article.category && (
                    <span className="rounded bg-white/15 px-1.5 py-0.5 font-medium text-white/85">
                      {article.category.name}
                    </span>
                  )}
                  <span>{formattedDate}</span>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex h-auto cursor-pointer items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-white/15 text-white shadow-xs backdrop-blur-md"
              : "text-white/85 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span>{label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-80 border-white/10 bg-[#071d49]/95 p-2 text-white shadow-xl backdrop-blur-xl sm:w-96"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-white/80">
          <span className="flex items-center gap-1.5">
            <Newspaper className="text-primary-300 h-3.5 w-3.5" />
            <span>Bài viết mới nhất</span>
          </span>
          <span className="text-xxs rounded-full bg-white/10 px-2 py-0.5 font-medium text-white/70">
            5 bài mới
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 bg-white/10" />

        {renderArticleList()}

        <DropdownMenuSeparator className="my-1 bg-white/10" />

        <DropdownMenuItem
          asChild
          className="text-primary-300 focus:text-primary-200 cursor-pointer rounded-lg p-2 text-center text-xs font-semibold hover:bg-white/10 focus:bg-white/10"
        >
          <Link href={href} className="flex w-full items-center justify-center gap-1.5 py-1">
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
