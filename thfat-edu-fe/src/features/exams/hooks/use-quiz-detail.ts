import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TQuizDetail } from "../types";

export function useQuizDetail(id: string) {
  return useQuery<TQuizDetail>({
    queryKey: queryKeys.exams.detail(id),
    queryFn: async () => {
      if (!id) {
        throw new Error("Thiếu mã đề thi.");
      }

      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/quizzes/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải chi tiết đề thi."));
      }

      return res.json();
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}
