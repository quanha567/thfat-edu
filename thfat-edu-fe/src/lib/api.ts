import { treaty } from "@elysiajs/eden";
import type { App } from "thfat-edu-be";

/**
 * Resolves the backend base URL dynamically:
 *
 * 1. Process.env.BACKEND_URL: Injected at runtime by Vercel Service Binding in Serverless Functions
 * 2. Process.env.NEXT_PUBLIC_API_URL: Public API URL override if configured
 * 3. Client-side browser fallback: In browser, uses same-origin relative /api or
 *    window.location.origin
 * 4. Local development fallback: http://localhost:3000
 */
export function getApiBaseUrl(): string {
  let url = "";

  if (process.env.BACKEND_URL) {
    url = process.env.BACKEND_URL;
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    url = process.env.NEXT_PUBLIC_API_URL;
  } else if (typeof window !== "undefined") {
    url = window.location.origin;
  } else {
    url = "http://localhost:3001";
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  // Guarantee that the base API URL always ends with "/api"
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
}

/**
 * Typesafe Elysia API client via Eden Treaty. Evaluates getApiBaseUrl() dynamically to ensure
 * runtime Vercel service bindings are respected.
 */
export const api: ReturnType<typeof treaty<App>> = new Proxy({} as ReturnType<typeof treaty<App>>, {
  get(_target, prop) {
    const client = treaty<App>(getApiBaseUrl(), {
      fetch: { credentials: "include" },
    });

    return (client as Record<string | symbol, unknown>)[prop];
  },
});
