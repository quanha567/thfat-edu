import { Elysia } from "elysia";

import { corsPlugin } from "./config/cors";
import { scalarDocsPlugin } from "./config/docs";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { cacheControlPlugin } from "./middlewares/cache-control";
import { errorHandlerPlugin } from "./middlewares/error-handler";
import { rateLimitPlugin } from "./middlewares/rate-limit";
import { requestLoggerPlugin } from "./middlewares/request-logger";
import { analyticsRoutes } from "./modules/analytics";
import { articlesRoutes } from "./modules/articles";
import { attemptsRoutes } from "./modules/attempts";
import { authRoutes } from "./modules/auth";
import { healthRoutes } from "./modules/health/health.routes";
import { inviteCodesRoutes, registerRoutes } from "./modules/invite-codes";
import { leaderboardRoutes } from "./modules/leaderboard";
import { quizzesRoutes } from "./modules/quizzes";
import { settingsRoutes, siteInfoRoutes } from "./modules/settings";
import { uploadRoutes } from "./modules/upload";
import { usersRoutes } from "./modules/users";

export const app = new Elysia()
  .use(requestLoggerPlugin)
  .use(corsPlugin)
  .use(rateLimitPlugin())
  .use(cacheControlPlugin())
  .use(errorHandlerPlugin)
  .use(scalarDocsPlugin())
  .get("/", () => "Hello Elysia")
  .use(healthRoutes)
  .use(authRoutes)
  .use(quizzesRoutes)
  .use(attemptsRoutes)
  .use(usersRoutes)
  .use(inviteCodesRoutes)
  .use(registerRoutes)
  .use(settingsRoutes)
  .use(siteInfoRoutes)
  .use(articlesRoutes)
  .use(leaderboardRoutes)
  .use(analyticsRoutes)
  .use(uploadRoutes)
  .group("/api", (group) =>
    group
      .use(healthRoutes)
      .use(authRoutes)
      .use(quizzesRoutes)
      .use(attemptsRoutes)
      .use(usersRoutes)
      .use(inviteCodesRoutes)
      .use(registerRoutes)
      .use(settingsRoutes)
      .use(siteInfoRoutes)
      .use(articlesRoutes)
      .use(leaderboardRoutes)
      .use(analyticsRoutes)
      .use(uploadRoutes),
  );

export type App = typeof app;

const port = Number(env.PORT) || 3001;

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(port);
  logger.info(
    {
      host: app.server?.hostname,
      port: app.server?.port,
      logLevel: logger.level,
    },
    "server started",
  );
}

export default app;
