import { describe, expect, it } from "bun:test";

import { LeaderboardService } from "./leaderboard.service";

describe("LeaderboardService", () => {
  describe("getCutoffDate", () => {
    const service = new LeaderboardService({} as never);

    it("calculates date cutoff correctly for timeframes", () => {
      const now = new Date("2026-11-16T12:00:00Z");

      const weekCutoff = service.getCutoffDate("this_week", now);
      expect(weekCutoff).toBeDefined();

      const monthCutoff = service.getCutoffDate("this_month", now);
      expect(monthCutoff).toBeDefined();

      const allTimeCutoff = service.getCutoffDate("all_time", now);
      expect(allTimeCutoff).toBeNull();
    });

    it("calculates this_week cutoff as Monday 00:00:00", () => {
      // 2026-11-18 is Wednesday
      const wednesday = new Date("2026-11-18T15:30:00.000Z");
      const mondayCutoff = service.getCutoffDate("this_week", wednesday);

      expect(mondayCutoff).not.toBeNull();
      if (mondayCutoff) {
        expect(mondayCutoff.getDay()).toBe(1); // Monday
        expect(mondayCutoff.getHours()).toBe(0);
        expect(mondayCutoff.getMinutes()).toBe(0);
        expect(mondayCutoff.getSeconds()).toBe(0);
      }
    });

    it("calculates this_week cutoff on Sunday as previous Monday", () => {
      // 2026-11-22 is Sunday
      const sunday = new Date("2026-11-22T20:00:00.000Z");
      const mondayCutoff = service.getCutoffDate("this_week", sunday);

      expect(mondayCutoff).not.toBeNull();
      if (mondayCutoff) {
        expect(mondayCutoff.getDay()).toBe(1); // Monday
      }
    });

    it("calculates this_month cutoff as 1st of month 00:00:00", () => {
      const date = new Date("2026-11-16T12:00:00.000Z");
      const monthCutoff = service.getCutoffDate("this_month", date);

      expect(monthCutoff).not.toBeNull();
      if (monthCutoff) {
        expect(monthCutoff.getDate()).toBe(1);
        expect(monthCutoff.getMonth()).toBe(10); // November (0-indexed)
        expect(monthCutoff.getFullYear()).toBe(2026);
      }
    });
  });

  describe("getGlobalLeaderboard", () => {
    it("returns paginated leaderboard items and total count", async () => {
      const mockRows = [
        {
          rank: "1",
          user_id: "user-1",
          full_name: "Nguyen Van A",
          avatar_url: "https://avatar.test/1.png",
          school_name: "THPT Chuyen",
          total_score: "95.50",
          total_exams: 5,
          total_duration_seconds: 1200,
        },
      ];

      const mockDb = {
        execute: async (queryObj: unknown) => {
          const sqlText = JSON.stringify(queryObj);
          if (sqlText.includes("COUNT(*)")) {
            return [{ count: "1" }];
          }

          return mockRows;
        },
      };

      const service = new LeaderboardService(mockDb as never);
      const res = await service.getGlobalLeaderboard({ page: 1, limit: 10 });

      expect(res.total).toBe(1);
      expect(res.page).toBe(1);
      expect(res.limit).toBe(10);
      expect(res.items.length).toBe(1);
      expect(res.items[0]?.rank).toBe(1);
      expect(res.items[0]?.fullName).toBe("Nguyen Van A");
      expect(res.items[0]?.totalScore).toBe(95.5);
      expect(res.items[0]?.totalExams).toBe(5);
      expect(res.items[0]?.totalDurationSeconds).toBe(1200);
      expect(res.myRank).toBeNull();
    });

    it("fetches myRank when currentUserId is provided", async () => {
      const mockRows = [
        {
          rank: "2",
          user_id: "my-user-id",
          full_name: "Current User",
          avatar_url: null,
          school_name: null,
          total_score: "80.00",
          total_exams: 3,
          total_duration_seconds: 900,
        },
      ];

      const mockDb = {
        execute: async (queryObj: unknown) => {
          const sqlText = JSON.stringify(queryObj);
          if (sqlText.includes("COUNT(*)")) {
            return [{ count: "2" }];
          }

          return mockRows;
        },
      };

      const service = new LeaderboardService(mockDb as never);
      const res = await service.getGlobalLeaderboard({ timeframe: "this_week" }, "my-user-id");

      expect(res.myRank).not.toBeNull();
      expect(res.myRank?.userId).toBe("my-user-id");
      expect(res.myRank?.rank).toBe(2);
      expect(res.myRank?.totalScore).toBe(80);
    });
  });

  describe("getQuizLeaderboard", () => {
    it("returns quiz leaderboard items", async () => {
      const mockRows = [
        {
          rank: "1",
          user_id: "user-1",
          full_name: "Nguyen Van A",
          avatar_url: null,
          school_name: "THPT Chuyen",
          total_score: "10.00",
          total_exams: 1,
          total_duration_seconds: 600,
        },
      ];

      const mockDb = {
        execute: async (queryObj: unknown) => {
          const sqlText = JSON.stringify(queryObj);
          if (sqlText.includes("COUNT(*)")) {
            return [{ count: "1" }];
          }

          return mockRows;
        },
      };

      const service = new LeaderboardService(mockDb as never);
      const res = await service.getQuizLeaderboard(
        "quiz-uuid-1",
        { timeframe: "all_time", page: 1, limit: 20 },
        "user-1",
      );

      expect(res.total).toBe(1);
      expect(res.items[0]?.rank).toBe(1);
      expect(res.items[0]?.totalScore).toBe(10);
      expect(res.myRank?.userId).toBe("user-1");
    });
  });
});
