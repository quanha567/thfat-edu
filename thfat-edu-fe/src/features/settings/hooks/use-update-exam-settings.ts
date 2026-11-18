import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type TExamSettings, type TUpdateExamSettingsInput } from "../types/settings.types";

export function useUpdateExamSettings() {
  const queryClient = useQueryClient();

  return useMutation<TExamSettings, Error, TUpdateExamSettingsInput>({
    mutationFn: async (input: TUpdateExamSettingsInput) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/settings/exam`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật cấu hình khảo thí."));
      }

      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.settings.exam(), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.studentExams.all });
      toast.success("Cập nhật cấu hình khảo thí thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi lưu cấu hình.");
    },
  });
}
