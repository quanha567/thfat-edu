import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import type { TArticleDetail } from "../types/article.types";

export type TUseArticleOptions = {
  idOrSlug: string;
  isAdmin?: boolean;
};

export function useArticle({ idOrSlug, isAdmin = false }: TUseArticleOptions) {
  return useQuery<TArticleDetail>({
    queryKey: queryKeys.articles.detail(idOrSlug),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const endpoint = isAdmin ? `/admin/articles/${idOrSlug}` : `/articles/${idOrSlug}`;
      const res = await fetch(`${baseUrl}${endpoint}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải chi tiết bài viết."));
      }

      return res.json();
    },
    enabled: Boolean(idOrSlug),
    staleTime: 60 * 1000,
  });
}
