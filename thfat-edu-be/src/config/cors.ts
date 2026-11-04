import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "./env";

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;

  // Local development ports (e.g. 3000, 3001)
  if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
    return true;
  }

  // Vercel preview & production deployments
  if (origin.endsWith(".vercel.app")) {
    return true;
  }

  // Configured custom frontend URL
  if (env.FRONTEND_URL && origin === env.FRONTEND_URL) {
    return true;
  }

  return false;
}

export const corsPlugin = new Elysia({ name: "app:cors" }).use(
  cors({
    origin: (request) => isOriginAllowed(request.headers.get("origin")),
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
