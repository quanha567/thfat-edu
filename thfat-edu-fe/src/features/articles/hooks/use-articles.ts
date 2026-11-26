import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { TArticleQuery, TPaginatedArticles } from "../types/article.types";

export type TUseArticlesOptions = {
  query?: TArticleQuery;
  isAdmin?: boolean;
};

export function useArticles({ query = {}, isAdmin = false }: TUseArticlesOptions = {}) {
  const queryParams = new URLSearchParams();
  if (query.page) queryParams.set("page", String(query.page));
  if (query.limit) queryParams.set("limit", String(query.limit));
  if (query.status) queryParams.set("status", query.status);
  if (query.categoryId) queryParams.set("categoryId", query.categoryId);
  if (query.search) queryParams.set("search", query.search);

  const queryString = queryParams.toString();
  const endpoint = isAdmin ? "/admin/articles" : "/articles";

  return useQuery<TPaginatedArticles>({
    queryKey: queryKeys.articles.list({ ...query, isAdmin }),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải danh sách bài viết."));
      }

      return res.json();
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
