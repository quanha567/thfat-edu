import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TExamFilterParams, type TQuizListResponse } from "../types";

export function useExams(params: TExamFilterParams = {}) {
  return useQuery<TQuizListResponse>({
    queryKey: queryKeys.exams.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.status) searchParams.set("status", params.status);
      if (params.search) searchParams.set("search", params.search);

      const res = await fetch(`/api/quizzes?${searchParams.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải danh sách đề thi."));
      }

      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
