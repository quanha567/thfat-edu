import { BaseAvatar } from "@/components/base";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_ARTICLE_THUMBNAIL } from "../constants";
import type { TArticleDetail } from "../types/article.types";
import { formatArticleDate, formatViewCount } from "../utils/format-article";
import { ArticleMarkdownRenderer } from "./article-markdown-renderer";
import { ArticleRelatedSection } from "./article-related-section";

export type TArticleDetailViewProps = {
  article: TArticleDetail;
};

export function ArticleDetailView({ article }: TArticleDetailViewProps) {
  return (
    <article className="space-y-10 pb-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <nav
          aria-label="Breadcrumb"
          className="text-muted-foreground flex items-center gap-1.5 text-sm"
        >
          <Link href="/articles" className="hover:text-foreground transition-colors">
            Bài viết
          </Link>
          {article.category && (
            <>
              <ChevronRight className="size-3.5" />
              <Link
                href={`/articles?category=${article.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {article.category.name}
              </Link>
            </>
          )}
        </nav>

        <h1 className="text-foreground text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed">{article.excerpt}</p>
        )}

        <div className="flex items-center gap-3">
          <BaseAvatar
            src={article.author?.avatarUrl}
            name={article.author?.fullName}
            size="md"
            className="border-border size-10 border"
          />
          <div className="text-sm">
            <p className="text-foreground font-semibold">
              {article.author?.fullName ?? "ThFat Edu"}
            </p>
            <p className="text-muted-foreground">
              {formatArticleDate(article, "long")} · {formatViewCount(article.viewCount)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-3xl">
        <Image
          src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      <ArticleMarkdownRenderer
        content={article.content}
        className="text-foreground/90 mx-auto max-w-3xl text-lg leading-relaxed"
      />

      <ArticleRelatedSection currentId={article.id} categoryId={article.categoryId} />
    </article>
  );
}
