import type { TArticleItem } from "../types/article.types";

type TArticleDateFormat = "short" | "long";

export function formatArticleDate(
  article: Pick<TArticleItem, "publishedAt" | "createdAt">,
  format: TArticleDateFormat = "short",
): string {
  const date = new Date(article.publishedAt ?? article.createdAt);

  if (format === "long") {
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("vi-VN");
}

export function formatViewCount(viewCount: number): string {
  return `${viewCount.toLocaleString("vi-VN")} lượt xem`;
}
