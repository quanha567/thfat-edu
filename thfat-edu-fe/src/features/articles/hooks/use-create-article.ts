import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { TArticleDetail, TCreateArticleInput } from "../types/article.types";

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation<TArticleDetail, Error, TCreateArticleInput>({
    mutationFn: async (input: TCreateArticleInput) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/admin/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tạo bài viết mới."));
      }

      return res.json();
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      const msg =
        created.status === "published"
          ? "Xuất bản bài viết thành công!"
          : "Lưu bản nháp bài viết thành công!";
      toast.success(msg);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra khi tạo bài viết.");
    },
  });
}
