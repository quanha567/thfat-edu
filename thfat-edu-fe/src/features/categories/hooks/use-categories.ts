import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import type { TCategory } from "../types/category.types";

export function useCategories() {
  return useQuery<TCategory[]>({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/categories`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải danh sách chuyên mục."));
      }

      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
