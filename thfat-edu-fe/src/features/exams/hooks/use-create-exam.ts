import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type TCreateQuizInput, type TQuizDetail } from "../types";

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation<TQuizDetail, Error, TCreateQuizInput>({
    mutationFn: async (input) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể tạo đề thi mới."));
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
    },
  });
}
