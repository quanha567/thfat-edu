import { Elysia } from "elysia";

import { corsPlugin } from "./config/cors";
import { scalarDocsPlugin } from "./config/docs";
import { env } from "./config/env";
import { errorHandlerPlugin } from "./middlewares/error-handler";
import { authRoutes } from "./modules/auth";
import { healthRoutes } from "./modules/health/health.routes";

export const app = new Elysia()
  .use(corsPlugin)
  .use(errorHandlerPlugin)
  .use(scalarDocsPlugin())
  .get("/", () => "Hello Elysia")
  .use(healthRoutes)
  .use(authRoutes)
  .group("/api", (group) => group.use(healthRoutes).use(authRoutes));

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
