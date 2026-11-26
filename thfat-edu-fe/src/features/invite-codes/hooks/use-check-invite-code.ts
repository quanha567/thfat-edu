import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { getInviteCodesApiUrl } from "../invite-link";

export function useCheckInviteCode(code: string) {
  return useQuery<{ valid: true }>({
    queryKey: queryKeys.inviteCodes.check(code),
    queryFn: async () => {
      const res = await fetch(getInviteCodesApiUrl(`/register/check/${encodeURIComponent(code)}`), {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Mã mời không hợp lệ."));
      }

      return res.json();
    },
    enabled: code.length > 0,
    retry: false,
    staleTime: 60 * 1000,
  });
}
