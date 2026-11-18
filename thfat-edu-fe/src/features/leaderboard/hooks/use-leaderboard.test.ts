import { queryKeys } from "@/lib/query-keys";
import { describe, expect, it } from "vitest";

import { LEADERBOARD_TIMEFRAME_LABELS, PODIUM_COLORS } from "../constants/leaderboard.constants";
import { useLeaderboard } from "./use-leaderboard";

describe("leaderboard constants, query keys & hook", () => {
  it("defines human readable labels for all timeframes", () => {
    expect(LEADERBOARD_TIMEFRAME_LABELS.this_week).toBe("Tuần này");
    expect(LEADERBOARD_TIMEFRAME_LABELS.this_month).toBe("Tháng này");
    expect(LEADERBOARD_TIMEFRAME_LABELS.all_time).toBe("Tất cả");
  });

  it("defines styling configs for top 3 podium places", () => {
    expect(PODIUM_COLORS[1].border).toBeDefined();
    expect(PODIUM_COLORS[2].border).toBeDefined();
    expect(PODIUM_COLORS[3].border).toBeDefined();
  });

  it("constructs correct query keys for global and quiz leaderboards", () => {
    expect(queryKeys.leaderboard.all).toEqual(["leaderboard"]);
    expect(queryKeys.leaderboard.global({ timeframe: "this_week", page: 1, limit: 20 })).toEqual([
      "leaderboard",
      "global",
      { timeframe: "this_week", page: 1, limit: 20 },
    ]);
    expect(
      queryKeys.leaderboard.quiz("quiz-1", { timeframe: "all_time", page: 1, limit: 20 }),
    ).toEqual(["leaderboard", "quiz", "quiz-1", { timeframe: "all_time", page: 1, limit: 20 }]);
  });

  it("exports useLeaderboard function", () => {
    expect(typeof useLeaderboard).toBe("function");
  });
});
