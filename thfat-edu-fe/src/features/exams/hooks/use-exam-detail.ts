import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TQuizDetail } from "../types";

export function useExamDetail(id: string) {
  return useQuery<TQuizDetail>({
    queryKey: queryKeys.exams.detail(id),
    queryFn: async () => {
      const res = await fetch(`/api/quizzes/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải chi tiết đề thi."));
      }

      return res.json();
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}
