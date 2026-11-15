import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TStudentExamListResponse } from "../types";

export type TStudentExamFilterParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export function useStudentExams(params: TStudentExamFilterParams = {}) {
  return useQuery<TStudentExamListResponse>({
    queryKey: queryKeys.studentExams.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set("page", String(params.page));
      if (params.limit) searchParams.set("limit", String(params.limit));
      if (params.search) searchParams.set("search", params.search);

      const baseUrl = getApiBaseUrl();
      // NOTE: getApiBaseUrl() already includes "/api" for browser builds, so we
      // must NOT add another "/api/" prefix here — that would produce /api/api/student-exams.
      const res = await fetch(`${baseUrl}/student-exams?${searchParams.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          extractApiErrorMessage(errorData, "Không thể tải danh sách đề thi của bạn."),
        );
      }

      return res.json();
    },
    staleTime: 30 * 1000,
  });
}
