import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TCategory, TUpdateCategoryInput } from "../types/category.types";

export type TUpdateCategoryVariables = {
  id: string;
  data: TUpdateCategoryInput;
};

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<TCategory, Error, TUpdateCategoryVariables>({
    mutationFn: async ({ id, data }) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật chuyên mục."));
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      toast.success("Cập nhật chuyên mục thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật chuyên mục.");
    },
  });
}
