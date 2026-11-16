import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { useMutation } from "@tanstack/react-query";

import { type TSolveQuestionInput, type TSolveQuestionResponse } from "../types";

export function useSolveQuestion() {
  return useMutation<TSolveQuestionResponse, Error, TSolveQuestionInput>({
    mutationFn: async (input) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/quizzes/ai/solve-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể giải câu hỏi bằng AI."));
      }

      return res.json();
    },
  });
}
