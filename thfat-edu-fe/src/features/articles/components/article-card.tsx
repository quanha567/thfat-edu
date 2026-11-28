import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

import { DEFAULT_ARTICLE_THUMBNAIL } from "../constants";
import type { TArticleItem } from "../types/article.types";
import { formatArticleDate, formatViewCount } from "../utils/format-article";

export type TArticleCardProps = {
  article: TArticleItem;
};

export function ArticleCard({ article }: TArticleCardProps) {
  const href = `/articles/${article.slug}`;

  return (
    <Card className="group border-border/80 bg-card flex h-full flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-xs transition-shadow hover:shadow-md">
      <Link href={href} className="bg-muted relative block aspect-16/10 w-full overflow-hidden">
        <Image
          src={article.thumbnailUrl || DEFAULT_ARTICLE_THUMBNAIL}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {article.category && (
          <span className="text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase">
            {article.category.name}
          </span>
        )}

        <Link href={href} className="space-y-2">
          <h3 className="text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 text-lg leading-snug font-bold tracking-tight transition-colors">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </Link>

        <p className="text-muted-foreground mt-auto pt-2 text-xs">
          {formatArticleDate(article)} · {formatViewCount(article.viewCount)}
        </p>
      </div>
    </Card>
  );
}
