import { queryKeys } from "@/lib/query-keys";
import { describe, expect, it } from "vitest";

import { DEFAULT_TIME_RANGE, SCORE_TIER_COLORS, TIME_RANGE_OPTIONS } from "./constants";
import type { TDashboardAnalytics } from "./types";

describe("Analytics Feature - Constants & Query Keys", () => {
  it("provides correct default time range and options", () => {
    expect(DEFAULT_TIME_RANGE).toBe("7d");
    expect(TIME_RANGE_OPTIONS.map((o) => o.value)).toEqual(["today", "7d", "30d", "all"]);
  });

  it("configures score tier colors for all 5 tiers", () => {
    expect(SCORE_TIER_COLORS.kem).toBeDefined();
    expect(SCORE_TIER_COLORS.yeu).toBeDefined();
    expect(SCORE_TIER_COLORS.trung_binh).toBeDefined();
    expect(SCORE_TIER_COLORS.kha).toBeDefined();
    expect(SCORE_TIER_COLORS.gioi).toBeDefined();
  });

  it("builds query keys correctly", () => {
    expect(queryKeys.analytics.all).toEqual(["analytics"]);
    expect(queryKeys.analytics.dashboard("7d")).toEqual(["analytics", "dashboard", "7d"]);
    expect(queryKeys.analytics.dashboard("30d")).toEqual(["analytics", "dashboard", "30d"]);
  });
});

describe("Analytics Types & Structure", () => {
  it("validates mock dashboard data structure", () => {
    const mockData: TDashboardAnalytics = {
      kpi: {
        totalAttempts: {
          value: 150,
          previousValue: 120,
          changePercentage: 25,
          subText: "135 bài đã nộp",
        },
        completionRate: {
          value: 90,
          previousValue: 85,
          changePercentage: 5.9,
          subText: "Tỷ lệ nộp bài",
        },
        averageScore: {
          value: 8.2,
          previousValue: 7.5,
          changePercentage: 9.3,
          subText: "Thang điểm 10",
        },
        activeCandidates: {
          value: 95,
          previousValue: 80,
          changePercentage: 18.8,
          subText: "Thí sinh duy nhất",
        },
      },
      trends: [
        {
          date: "2026-11-21",
          label: "21/11",
          startedCount: 20,
          submittedCount: 18,
        },
      ],
      scoreDistribution: [
        {
          tier: "gioi",
          label: "Giỏi & Xuất sắc",
          rangeLabel: "8.0 - 10đ",
          count: 45,
          percentage: 33.3,
        },
      ],
      recentAttempts: [
        {
          id: "att-1",
          quizId: "quiz-1",
          quizTitle: "Đề thi thử số 1",
          studentId: "u-1",
          studentName: "Trần Văn B",
          studentEmail: "b@gmail.com",
          studentAvatar: null,
          status: "submitted",
          score: 8.5,
          totalPoints: 10,
          normalizedScore: 8.5,
          startedAt: "2026-11-21T00:00:00.000Z",
          submittedAt: "2026-11-21T00:45:00.000Z",
        },
      ],
      topExams: [
        {
          quizId: "quiz-1",
          title: "Đề thi thử số 1",
          durationMinutes: 50,
          totalAttempts: 150,
          submittedAttempts: 135,
          completionRate: 90,
          averageScore: 8.2,
        },
      ],
      timeRange: "7d",
      updatedAt: "2026-11-21T12:00:00.000Z",
    };

    expect(mockData.kpi.totalAttempts.value).toBe(150);
    expect(mockData.topExams[0].averageScore).toBe(8.2);
    expect(mockData.scoreDistribution[0].tier).toBe("gioi");
  });
});
