import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { scalarDocsPlugin } from "./config/docs";
import { env } from "./config/env";
import {
  AppError,
  handleApplicationError,
  NotFoundError,
  UnauthorizedError,
} from "./middlewares/error-handler";
import { authRoutes } from "./modules/auth/auth.routes";
import { healthRoutes } from "./modules/health/health.routes";

const apiRoutes = new Elysia().use(healthRoutes).use(authRoutes);

export const app = new Elysia()
  .use(
    cors({
      origin: (request): boolean => {
        const origin = request.headers.get("origin");
        if (!origin) return true;

        // Allow local development ports (e.g. 3000, 3001)
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return true;
        }

        // Allow Vercel preview & production deployments
        if (origin.endsWith(".vercel.app")) {
          return true;
        }

        // Allow configured custom frontend URL
        if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
          return true;
        }

        return false;
      },
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  )
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_FOUND: NotFoundError,
    APP_ERROR: AppError,
  })
  .onError(handleApplicationError)
  .use(scalarDocsPlugin())
  .use(scalarDocsPlugin("/api"))
  .get("/", () => "Hello Elysia")
  .use(apiRoutes)
  .group("/api", (app) => app.use(apiRoutes));

export type App = typeof app;

// Listen on standalone port (3001) only when executed directly outside Vercel serverless
const port = Number(env.PORT) || 3001;

if (
  !process.env.VERCEL &&
  process.env.NODE_ENV !== "test" &&
  (import.meta as { main?: boolean }).main
) {
  app.listen(port);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export default app;
