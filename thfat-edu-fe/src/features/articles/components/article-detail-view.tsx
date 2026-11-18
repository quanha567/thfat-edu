import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_ARTICLE_THUMBNAIL } from "../constants";
import type { TArticleDetail } from "../types/article.types";
import { ArticleMarkdownRenderer } from "./article-markdown-renderer";

export type TArticleDetailViewProps = {
  article: TArticleDetail;
};

export function ArticleDetailView({ article }: TArticleDetailViewProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(article.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const authorInitials = article.author?.fullName
    ? article.author.fullName.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* Back Button */}
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Link href="/articles">
            <ArrowLeft className="size-4" />
            Quay lại danh sách bài viết
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        {article.category && (
          <Link href={`/articles?category=${article.category.slug}`}>
            <Badge variant="secondary" className="font-semibold text-xs">
              {article.category.name}
            </Badge>
          </Link>
        )}

        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            {article.excerpt}
          </p>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-border">
              {article.author?.avatarUrl && (
                <AvatarImage src={article.author.avatarUrl} alt={article.author.fullName} />
              )}
              <AvatarFallback className="font-semibold text-xs">{authorInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-xs sm:text-sm">
                {article.author?.fullName ?? "Quản trị viên ThFat Edu"}
              </span>
              <span className="text-muted-foreground text-[11px] sm:text-xs">Tác giả bài viết</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="size-3.5" />
              {article.viewCount} lượt xem
            </span>
          </div>
        </div>
      </div>

      {/* Featured Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <Image
          src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
          alt={article.title}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      {/* Article Markdown Content */}
      <ArticleMarkdownRenderer
        content={article.content}
        className="text-foreground/90 leading-relaxed"
      />
    </article>
  );
}
