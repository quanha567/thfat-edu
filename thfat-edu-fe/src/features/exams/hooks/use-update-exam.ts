import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type TQuizDetail, type TUpdateQuizInput } from "../types";

export function useUpdateExam(id: string) {
  const queryClient = useQueryClient();

  return useMutation<TQuizDetail, Error, TUpdateQuizInput>({
    mutationFn: async (input) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/quizzes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật đề thi."));
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.exams.detail(id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
    },
  });
}
