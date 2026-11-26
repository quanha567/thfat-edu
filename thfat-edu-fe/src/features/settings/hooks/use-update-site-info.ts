import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { revalidateSiteInfo } from "../actions/revalidate-site-info";
import { type TSiteInfo, type TUpdateSiteInfoInput } from "../types/settings.types";

export function useUpdateSiteInfo() {
  const queryClient = useQueryClient();

  return useMutation<TSiteInfo, Error, TUpdateSiteInfoInput>({
    mutationFn: async (input: TUpdateSiteInfoInput) => {
      const res = await fetch(`${getApiBaseUrl()}/admin/settings/site`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật thông tin site."));
      }

      return res.json();
    },
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.settings.site(), updated);
      await revalidateSiteInfo();
      toast.success("Đã cập nhật thông tin site.");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi lưu thông tin site.");
    },
  });
}
