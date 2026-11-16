import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TLeaderboardParams, type TLeaderboardResponse } from "../types/leaderboard.types";

export function useLeaderboard(params: TLeaderboardParams = {}) {
  const tab = params.tab ?? "global";
  const timeframe = params.timeframe ?? "all_time";
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const quizId = params.quizId;

  return useQuery<TLeaderboardResponse>({
    queryKey:
      tab === "quiz" && quizId
        ? queryKeys.leaderboard.quiz(quizId, { timeframe, page, limit })
        : queryKeys.leaderboard.global({ timeframe, page, limit }),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("timeframe", timeframe);
      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));

      const baseUrl = getApiBaseUrl();
      const endpoint =
        tab === "quiz" && quizId
          ? `${baseUrl}/leaderboard/quizzes/${quizId}?${searchParams.toString()}`
          : `${baseUrl}/leaderboard?${searchParams.toString()}`;

      const res = await fetch(endpoint, { credentials: "include" });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(err, "Không thể tải bảng xếp hạng."));
      }

      return res.json();
    },
    enabled: tab !== "quiz" || Boolean(quizId),
    staleTime: 60 * 1000,
  });
}
