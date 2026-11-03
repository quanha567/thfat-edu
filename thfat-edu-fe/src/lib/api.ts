import { treaty } from "@elysiajs/eden";
import type { App } from "thfat-edu-be";

/**
 * Resolves the backend base URL dynamically:
 * 1. process.env.BACKEND_URL: Injected at runtime by Vercel Service Binding in Serverless Functions
 * 2. process.env.NEXT_PUBLIC_API_URL: Public API URL override if configured
 * 3. Client-side browser fallback: In browser, uses same-origin relative /api or window.location.origin
 * 4. Local development fallback: http://localhost:3000
 */
export const getApiBaseUrl = (): string => {
  // Runtime binding for serverless functions (resolves at runtime in functions, not at build time)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  // Public env override (e.g. for external API or preview)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Browser client-side fallback on the same domain
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }
  // Local standalone development default
  return "http://localhost:3000";
};

/**
 * Typesafe Elysia API client via Eden Treaty.
 * Evaluates getApiBaseUrl() dynamically to ensure runtime Vercel service bindings are respected.
 */
export const api: ReturnType<typeof treaty<App>> = new Proxy({} as ReturnType<typeof treaty<App>>, {
  get(_target, prop) {
    const client = treaty<App>(getApiBaseUrl());
    return (client as Record<string | symbol, unknown>)[prop];
  },
});
