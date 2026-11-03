import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

export const app = new Elysia()
  .use(
    cors({
      origin: (request): boolean => {
        const origin = request.headers.get("origin");
        if (!origin) return true;

        // Allow localhost development
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return true;
        }

        // Allow Vercel preview and production deployments
        if (origin.endsWith(".vercel.app")) {
          return true;
        }

        // Allow custom frontend URL if configured in env
        const allowedFrontend = process.env.FRONTEND_URL;
        if (allowedFrontend && origin === allowedFrontend) {
          return true;
        }

        return false;
      },
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  )
  .get("/", () => "Hello Elysia")
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

export type App = typeof app;

// Only start the standalone HTTP server when running outside Vercel (e.g. local dev, docker)
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(3000);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}

export default app;
