import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "./env";

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;

  const isProduction = env.NODE_ENV === "production";

  // Local development ports (e.g. 3000, 3001) — không mở ở production
  if (
    !isProduction &&
    (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))
  ) {
    return true;
  }

  // Configured frontend URL (so khớp chính xác, bỏ dấu "/" cuối)
  const allowed = env.FRONTEND_URL.replace(/\/+$/, "");

  return origin === allowed;
}

export const corsPlugin = new Elysia({ name: "app:cors" }).use(
  cors({
    origin: (request) => isOriginAllowed(request.headers.get("origin")),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Cache-Control"],
    exposeHeaders: ["Content-Type"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
