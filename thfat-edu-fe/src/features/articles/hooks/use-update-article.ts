import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TArticleDetail, TUpdateArticleInput } from "../types/article.types";

export type TUpdateArticleVariables = {
  id: string;
  data: TUpdateArticleInput;
};

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation<TArticleDetail, Error, TUpdateArticleVariables>({
    mutationFn: async ({ id, data }) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật bài viết."));
      }

      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.articles.detail(updated.id), updated);
      queryClient.setQueryData(queryKeys.articles.detail(updated.slug), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      const msg =
        updated.status === "published"
          ? "Cập nhật và xuất bản bài viết thành công!"
          : "Lưu thay đổi bài viết thành công!";
      toast.success(msg);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật bài viết.");
    },
  });
}
