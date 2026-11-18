import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type TQuizDetail, type TUpdateQuizInput } from "../types";

export type TUpdateExamMutationVariables = TUpdateQuizInput & { id?: string };

export function useUpdateExam(defaultId: string = "") {
  const queryClient = useQueryClient();

  return useMutation<TQuizDetail, Error, TUpdateExamMutationVariables>({
    mutationFn: async (input) => {
      const targetId = input.id || defaultId;
      if (!targetId) {
        throw new Error("Thiếu mã đề thi (ID) để cập nhật.");
      }

      const { id: _, ...payload } = input;
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/quizzes/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể cập nhật đề thi."));
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.all });
      const targetId = variables.id || defaultId;
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.exams.detail(targetId) });
      }
    },
  });
}
