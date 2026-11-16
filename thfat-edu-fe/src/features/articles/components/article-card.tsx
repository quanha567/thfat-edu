import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { TArticleItem } from "../types/article.types";

export type TArticleCardProps = {
  article: TArticleItem;
};

export function ArticleCard({ article }: TArticleCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("vi-VN")
    : new Date(article.createdAt).toLocaleDateString("vi-VN");

  return (
    <Card className="group border-border/80 bg-card hover:border-primary-500/50 flex flex-col overflow-hidden rounded-xl shadow-2xs transition-all hover:shadow-sm">
      <Link
        href={`/articles/${article.slug}`}
        className="relative aspect-video w-full overflow-hidden bg-muted"
      >
        {article.thumbnailUrl ? (
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="from-primary-500/10 to-primary-700/20 flex size-full items-center justify-center bg-gradient-to-br text-muted-foreground/60">
            <span className="font-bold text-sm tracking-wide">ThFat Edu</span>
          </div>
        )}

        {article.category && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/90 text-foreground backdrop-blur-xs font-semibold text-[11px] shadow-2xs"
            >
              {article.category.name}
            </Badge>
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2">
          <Link href={`/articles/${article.slug}`}>
            <h3 className="group-hover:text-primary-600 dark:group-hover:text-primary-400 font-bold text-base text-foreground transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {article.excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-muted-foreground text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {publishedDate}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Eye className="size-3.5" />
            {article.viewCount} lượt xem
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
