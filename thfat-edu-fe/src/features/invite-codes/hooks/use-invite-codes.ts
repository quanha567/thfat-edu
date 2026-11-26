import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getInviteCodesApiUrl } from "../invite-link";
import { type TInviteCodesListParams, type TInviteCodesListResponse } from "../types";

export function useInviteCodes(params: TInviteCodesListParams = {}) {
  return useQuery<TInviteCodesListResponse>({
    queryKey: queryKeys.inviteCodes.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.status && params.status !== "all") searchParams.set("status", params.status);

      const res = await fetch(getInviteCodesApiUrl(`/invite-codes?${searchParams.toString()}`), {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải danh sách mã mời."));
      }

      return res.json();
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}
