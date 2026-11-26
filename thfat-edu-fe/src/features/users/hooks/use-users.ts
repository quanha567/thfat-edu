import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { type TUserFilterParams, type TUsersListResponse } from "../types";

export function useUsers(params: TUserFilterParams = {}) {
  return useQuery<TUsersListResponse>({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.search && params.search.trim()) searchParams.set("search", params.search.trim());
      if (params.role && params.role !== "all") searchParams.set("role", params.role);
      if (params.status && params.status !== "all") searchParams.set("status", params.status);
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

      const baseUrl = getApiBaseUrl();
      const cleanBase = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
      const res = await fetch(`${cleanBase}/users?${searchParams.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải danh sách người dùng."));
      }

      return res.json();
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
