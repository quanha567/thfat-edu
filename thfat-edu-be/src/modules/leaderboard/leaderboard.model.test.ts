import { describe, expect, it } from "bun:test";

import { Value } from "@sinclair/typebox/value";

import { leaderboardQuerySchema } from "./leaderboard.model";

describe("leaderboard.model", () => {
  it("validates valid query parameters with defaults", () => {
    const query = {};
    const hasDefault = Value.Check(leaderboardQuerySchema, query);
    expect(hasDefault).toBe(true);

    const parsed = Value.Decode(leaderboardQuerySchema, query);
    expect(parsed.timeframe).toBe("all_time");
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
  });

  it("accepts valid timeframe filters", () => {
    expect(
      Value.Check(leaderboardQuerySchema, {
        timeframe: "this_week",
        page: 2,
        limit: 10,
      }),
    ).toBe(true);
    expect(
      Value.Check(leaderboardQuerySchema, {
        timeframe: "this_month",
        page: 1,
        limit: 50,
      }),
    ).toBe(true);
  });

  it("rejects invalid timeframe filter", () => {
    expect(Value.Check(leaderboardQuerySchema, { timeframe: "invalid_timeframe" })).toBe(false);
  });
});
