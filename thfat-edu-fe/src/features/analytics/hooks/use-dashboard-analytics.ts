import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import type { TAnalyticsTimeRange, TDashboardAnalytics } from "../types";

export function useDashboardAnalytics(timeRange: TAnalyticsTimeRange = "7d") {
  return useQuery<TDashboardAnalytics>({
    queryKey: queryKeys.analytics.dashboard(timeRange),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const url = new URL(`${baseUrl}/analytics/dashboard`);
      url.searchParams.set("timeRange", timeRange);

      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          extractApiErrorMessage(errorData, "Không thể tải số liệu thống kê Dashboard."),
        );
      }

      return res.json();
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}
