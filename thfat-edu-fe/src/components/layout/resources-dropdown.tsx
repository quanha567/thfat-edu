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
import { DEFAULT_ARTICLE_THUMBNAIL } from "@/features/articles/constants";
import { useArticles } from "@/features/articles/hooks/use-articles";
import { formatArticleDate } from "@/features/articles/utils/format-article";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
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
        <div className="flex flex-col gap-3 p-2.5">
          {["skel-res-1", "skel-res-2", "skel-res-3", "skel-res-4", "skel-res-5"].map((key) => (
            <div key={key} className="flex gap-3">
              <Skeleton className="h-14 w-20 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-4/5 bg-white/15" />
                <Skeleton className="h-3 w-1/3 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (articles.length === 0) {
      return <div className="py-6 text-center text-sm text-white/60">Chưa có bài viết nào</div>;
    }

    return (
      <div className="flex flex-col">
        {articles.slice(0, 5).map((article) => (
          <DropdownMenuItem
            key={article.id}
            asChild
            className="group cursor-pointer items-start gap-3 rounded-xl p-2.5 text-white/90 transition-colors hover:bg-white/10 focus:bg-white/10 focus:text-white"
          >
            <Link href={`/articles/${article.slug}`} className="flex w-full items-start gap-3">
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10">
                <Image
                  src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                <span className="group-hover:text-primary-300 line-clamp-2 text-sm leading-snug font-semibold text-white transition-colors">
                  {article.title}
                </span>
                <span className="text-xs text-white/60">
                  {article.category ? `${article.category.name} · ` : ""}
                  {formatArticleDate(article)}
                </span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
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
        className="bg-surface-dark-mid/95 w-96 rounded-2xl border-white/10 p-2 text-white shadow-xl backdrop-blur-xl sm:w-[26rem]"
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-semibold tracking-wide text-white/60 uppercase">
          Bài viết mới nhất
        </DropdownMenuLabel>

        {renderArticleList()}

        <DropdownMenuSeparator className="my-1.5 bg-white/10" />

        <DropdownMenuItem
          asChild
          className="text-primary-300 focus:text-primary-200 cursor-pointer rounded-lg p-2 text-sm font-semibold hover:bg-white/10 focus:bg-white/10"
        >
          <Link href={href} className="flex w-full items-center justify-between gap-1.5 py-1">
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
