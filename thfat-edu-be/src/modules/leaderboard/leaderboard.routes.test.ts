import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin } from "../../middlewares/error-handler";
import { leaderboardRoutes } from "./leaderboard.routes";
import { type LeaderboardService } from "./leaderboard.service";

describe("leaderboard.routes", () => {
  let capturedGlobalUserId: string | undefined = undefined;
  let capturedQuizId: string | null = null;
  let capturedQuizUserId: string | undefined = undefined;

  const mockLeaderboardService = {
    getGlobalLeaderboard: async (_query: unknown, currentUserId?: string) => {
      capturedGlobalUserId = currentUserId;

      return {
        items: [
          {
            rank: 1,
            userId: "11111111-1111-1111-1111-111111111111",
            fullName: "Nguyễn Văn A",
            avatarUrl: null,
            schoolName: "THPT Chuyên",
            totalScore: 98.5,
            totalExams: 10,
            totalDurationSeconds: 3600,
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        myRank: null,
      };
    },
    getQuizLeaderboard: async (quizId: string, _query: unknown, currentUserId?: string) => {
      capturedQuizId = quizId;
      capturedQuizUserId = currentUserId;

      return {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        myRank: null,
      };
    },
  } as unknown as LeaderboardService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("leaderboardService", mockLeaderboardService)
    .use(leaderboardRoutes);

  it("GET /leaderboard returns paginated leaderboard response", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/leaderboard?timeframe=all_time&page=1&limit=20"),
    );
    expect(res.status).toBe(200);

    const data = (await res.json()) as {
      items: Array<{ rank: number; fullName: string }>;
      total: number;
    };
    expect(data.total).toBe(1);
    expect(data.items[0]?.rank).toBe(1);
    expect(data.items[0]?.fullName).toBe("Nguyễn Văn A");
  });

  it("GET /leaderboard extracts x-user-id header when provided", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/leaderboard", {
        headers: { "x-user-id": "user-uuid-123" },
      }),
    );
    expect(res.status).toBe(200);
    expect(capturedGlobalUserId).toBe("user-uuid-123");
  });

  it("GET /leaderboard/quizzes/:quizId returns quiz-specific leaderboard", async () => {
    const quizId = "22222222-2222-4222-a222-222222222222";
    const res = await testApp.handle(new Request(`http://localhost/leaderboard/quizzes/${quizId}`));
    expect(res.status).toBe(200);

    const data = (await res.json()) as { total: number };
    expect(data.total).toBe(0);
    expect(capturedQuizId).toBe(quizId);
  });

  it("GET /leaderboard/quizzes/:quizId extracts x-user-id header when provided", async () => {
    const quizId = "22222222-2222-4222-a222-222222222222";
    const res = await testApp.handle(
      new Request(`http://localhost/leaderboard/quizzes/${quizId}`, {
        headers: { "x-user-id": "user-uuid-456" },
      }),
    );
    expect(res.status).toBe(200);
    expect(capturedQuizUserId).toBe("user-uuid-456");
  });
});
