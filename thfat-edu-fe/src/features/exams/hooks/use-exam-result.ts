import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TAttemptResult } from "../types";

export function useExamResult(quizId: string) {
  return useQuery<TAttemptResult>({
    queryKey: queryKeys.studentExams.result(quizId),
    queryFn: async () => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/student-exams/${quizId}/result`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tải kết quả bài thi."));
      }

      return res.json();
    },
    enabled: Boolean(quizId),
    staleTime: 60 * 1000,
  });
}
