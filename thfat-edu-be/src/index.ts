import { Elysia } from "elysia";

import { corsPlugin } from "./config/cors";
import { scalarDocsPlugin } from "./config/docs";
import { env } from "./config/env";
import { errorHandlerPlugin } from "./middlewares/error-handler";
import { analyticsRoutes } from "./modules/analytics";
import { articlesRoutes } from "./modules/articles";
import { attemptsRoutes } from "./modules/attempts";
import { authRoutes } from "./modules/auth";
import { healthRoutes } from "./modules/health/health.routes";
import { leaderboardRoutes } from "./modules/leaderboard";
import { quizzesRoutes } from "./modules/quizzes";
import { settingsRoutes } from "./modules/settings";
import { usersRoutes } from "./modules/users";

export const app = new Elysia()
  .use(corsPlugin)
  .use(errorHandlerPlugin)
  .use(scalarDocsPlugin())
  .get("/", () => "Hello Elysia")
  .use(healthRoutes)
  .use(authRoutes)
  .use(quizzesRoutes)
  .use(attemptsRoutes)
  .use(usersRoutes)
  .use(settingsRoutes)
  .use(articlesRoutes)
  .use(leaderboardRoutes)
  .use(analyticsRoutes)
  .group("/api", (group) =>
    group
      .use(healthRoutes)
      .use(authRoutes)
      .use(quizzesRoutes)
      .use(attemptsRoutes)
      .use(usersRoutes)
      .use(settingsRoutes)
      .use(articlesRoutes)
      .use(leaderboardRoutes)
      .use(analyticsRoutes),
  );

export type App = typeof app;

const port = Number(env.PORT) || 3001;

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(port);
  console.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export default app;
