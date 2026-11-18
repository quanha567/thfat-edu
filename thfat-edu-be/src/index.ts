process.env.BUN_RUNTIME_TRANSPILER_CACHE_PATH = "0";
process.env.BUN_INSTALL_CACHE_DIR = "/tmp/bun-cache";
process.env.TMPDIR = "/tmp";

import { Elysia } from "elysia";

import { corsPlugin } from "./config/cors";
import { scalarDocsPlugin } from "./config/docs";
import { env } from "./config/env";
import { errorHandlerPlugin } from "./middlewares/error-handler";
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
  .group("/api", (group) =>
    group
      .use(healthRoutes)
      .use(authRoutes)
      .use(quizzesRoutes)
      .use(attemptsRoutes)
      .use(usersRoutes)
      .use(settingsRoutes)
      .use(articlesRoutes)
      .use(leaderboardRoutes),
  );

export type App = typeof app;

const port = Number(env.PORT) || 3001;

if (
  !process.env.VERCEL &&
  process.env.NODE_ENV !== "test" &&
  (import.meta as { main?: boolean }).main
) {
  app.listen(port);
  console.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export default app;
