import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_ARTICLE_THUMBNAIL } from "../constants";
import type { TArticleItem } from "../types/article.types";
import { formatArticleDate, formatViewCount } from "../utils/format-article";

export type TArticleFeaturedCardProps = {
  article: TArticleItem;
};

export function ArticleFeaturedCard({ article }: TArticleFeaturedCardProps) {
  const href = `/articles/${article.slug}`;

  return (
    <div className="group border-border/80 bg-card grid overflow-hidden rounded-3xl border shadow-xs transition-shadow hover:shadow-md md:grid-cols-2">
      <Link href={href} className="bg-muted relative block aspect-16/10 md:aspect-auto md:min-h-80">
        <Image
          src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        {article.category && (
          <span className="text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase">
            {article.category.name}
          </span>
        )}

        <h2 className="text-foreground line-clamp-3 text-2xl leading-tight font-black tracking-tight sm:text-3xl">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-muted-foreground line-clamp-3 text-base leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <p className="text-muted-foreground text-sm">
          {formatArticleDate(article)} · {formatViewCount(article.viewCount)}
        </p>

        <Button asChild size="lg" className="mt-2 w-fit rounded-xl font-semibold">
          <Link href={href}>
            Đọc bài viết
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
