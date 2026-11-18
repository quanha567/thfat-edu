import { t } from "elysia";

export const timeframeEnum = t.Union([
  t.Literal("this_week"),
  t.Literal("this_month"),
  t.Literal("all_time"),
]);

export type TTimeframe = "this_week" | "this_month" | "all_time";

const baseLeaderboardQuerySchema = t.Object({
  timeframe: t.Optional(
    t.Union([t.Literal("this_week"), t.Literal("this_month"), t.Literal("all_time")], {
      default: "all_time",
    }),
  ),
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 20, minimum: 1, maximum: 50 })),
});

export const leaderboardQuerySchema = t
  .Transform(baseLeaderboardQuerySchema)
  .Decode((value) => ({
    timeframe: (value.timeframe ?? "all_time") as TTimeframe,
    page: value.page !== undefined ? Number(value.page) : 1,
    limit: value.limit !== undefined ? Number(value.limit) : 20,
  }))
  .Encode((value) => value);

export type TLeaderboardQuery = {
  timeframe?: TTimeframe;
  page?: number;
  limit?: number;
};

export type TLeaderboardItem = {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  schoolName: string | null;
  totalScore: number;
  totalExams: number;
  totalDurationSeconds: number;
};

export type TLeaderboardResponse = {
  items: TLeaderboardItem[];
  total: number;
  page: number;
  limit: number;
  myRank: TLeaderboardItem | null;
};
