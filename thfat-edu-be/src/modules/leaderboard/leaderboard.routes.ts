import { Elysia, t } from "elysia";

import { db } from "../../db";
import { optionalAuth } from "../auth/auth.guard";
import { leaderboardQuerySchema } from "./leaderboard.model";
import { LeaderboardService } from "./leaderboard.service";

export const leaderboardRoutes = new Elysia({ prefix: "/leaderboard" })
  .decorate("leaderboardService", new LeaderboardService(db))
  .use(optionalAuth())
  .get(
    "/",
    async ({ leaderboardService, query, currentUser }) => {
      return leaderboardService.getGlobalLeaderboard(query, currentUser?.id);
    },
    {
      query: leaderboardQuerySchema,
      detail: {
        tags: ["Leaderboard"],
        summary: "Get global leaderboard rankings",
      },
    },
  )
  .get(
    "/quizzes/:quizId",
    async ({ leaderboardService, params, query, currentUser }) => {
      return leaderboardService.getQuizLeaderboard(params.quizId, query, currentUser?.id);
    },
    {
      params: t.Object({
        quizId: t.String({ format: "uuid" }),
      }),
      query: leaderboardQuerySchema,
      detail: {
        tags: ["Leaderboard"],
        summary: "Get quiz-specific leaderboard rankings",
      },
    },
  );
