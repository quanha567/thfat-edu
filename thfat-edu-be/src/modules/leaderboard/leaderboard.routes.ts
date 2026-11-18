import { Elysia, t } from "elysia";

import { db } from "../../db";
import { extractSessionToken, SESSION_COOKIE_NAME } from "../auth/auth.cookie";
import { authService as defaultAuthService } from "../auth/auth.service";
import { leaderboardQuerySchema } from "./leaderboard.model";
import { LeaderboardService } from "./leaderboard.service";

async function resolveCurrentUserId(
  request: Request,
  cookie: Record<string, { value?: unknown }>,
): Promise<string | undefined> {
  const headerUserId = request.headers.get("x-user-id");
  if (headerUserId) {
    return headerUserId;
  }

  let token = extractSessionToken(cookie[SESSION_COOKIE_NAME]?.value);
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return undefined;
  }

  try {
    const user = await defaultAuthService.getCurrentUser(token);

    return user?.id;
  } catch {
    return undefined;
  }
}

export const leaderboardRoutes = new Elysia({ prefix: "/leaderboard" })
  .decorate("leaderboardService", new LeaderboardService(db))
  .get(
    "/",
    async ({ leaderboardService, query, request, cookie }) => {
      const currentUserId = await resolveCurrentUserId(request, cookie);

      return leaderboardService.getGlobalLeaderboard(query, currentUserId);
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
    async ({ leaderboardService, params, query, request, cookie }) => {
      const currentUserId = await resolveCurrentUserId(request, cookie);

      return leaderboardService.getQuizLeaderboard(params.quizId, query, currentUserId);
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
