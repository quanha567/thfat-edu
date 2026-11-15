import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type TExamRoomData, type TSubmitAttemptResponse, type TSyncAnswerPayload } from "../types";

export type TSyncAnswersVariables = {
  attemptId: string;
  answers: TSyncAnswerPayload[];
};

export function useStartExam() {
  const queryClient = useQueryClient();

  return useMutation<TExamRoomData, Error, string>({
    mutationFn: async (quizId: string) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/student-exams/${quizId}/start`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể bắt đầu làm bài thi."));
      }

      return res.json();
    },
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studentExams.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.studentExams.room(quizId) });
    },
  });
}

export function useSyncAnswers() {
  return useMutation<{ syncedCount: number }, Error, TSyncAnswersVariables>({
    mutationFn: async ({ attemptId, answers }) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/student-exams/${attemptId}/sync`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể lưu tiến trình bài làm."));
      }

      return res.json();
    },
  });
}

export function useSubmitExam() {
  const queryClient = useQueryClient();

  return useMutation<TSubmitAttemptResponse, Error, string>({
    mutationFn: async (attemptId: string) => {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/student-exams/${attemptId}/submit`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(errorData, "Không thể nộp bài thi."));
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.studentExams.all });
    },
  });
}
