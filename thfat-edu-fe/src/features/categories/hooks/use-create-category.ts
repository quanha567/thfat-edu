import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TCategory, TCreateCategoryInput } from "../types/category.types";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<TCategory, Error, TCreateCategoryInput>({
    mutationFn: async (input: TCreateCategoryInput) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tạo chuyên mục mới."));
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      toast.success("Tạo chuyên mục mới thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo chuyên mục.");
    },
  });
}
