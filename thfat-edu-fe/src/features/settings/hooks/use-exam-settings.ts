import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TExamSettings } from "../types/settings.types";

export function useExamSettings() {
  return useQuery<TExamSettings>({
    queryKey: queryKeys.settings.exam(),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/settings/exam`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải cấu hình khảo thí."));
      }

      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
