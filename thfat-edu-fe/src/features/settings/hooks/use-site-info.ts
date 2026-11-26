import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TSiteInfo } from "../types/settings.types";

export function useSiteInfo() {
  return useQuery<TSiteInfo>({
    queryKey: queryKeys.settings.site(),
    queryFn: async () => {
      const res = await fetch(`${getApiBaseUrl()}/admin/settings/site`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải thông tin site."));
      }

      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
