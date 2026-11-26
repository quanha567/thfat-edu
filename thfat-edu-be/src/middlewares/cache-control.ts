import { Elysia } from "elysia";

import { isProtectionEnabledByDefault, normalizePath } from "./rate-limit";

export const CACHE_PUBLIC_CONTENT = "public, s-maxage=60, stale-while-revalidate=300";
export const CACHE_PUBLIC_LEADERBOARD = "public, s-maxage=30, stale-while-revalidate=60";
export const CACHE_PRIVATE = "private, no-store";

export type TCacheControlOptions = {
  enabled?: boolean;
};

function hasSession(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";

  return /(?:^|;\s*)session_token=/.test(cookie) || request.headers.has("authorization");
}

function isPublicContentPath(path: string): boolean {
  return path === "/articles" || path.startsWith("/articles/") || path === "/categories";
}

export function resolveCacheControl({ request }: { request: Request }): string {
  if (request.method !== "GET") {
    return CACHE_PRIVATE;
  }

  const path = normalizePath(new URL(request.url).pathname);

  if (isPublicContentPath(path)) {
    return CACHE_PUBLIC_CONTENT;
  }

  if (path === "/leaderboard" || path.startsWith("/leaderboard/")) {
    return hasSession(request) ? CACHE_PRIVATE : CACHE_PUBLIC_LEADERBOARD;
  }

  return CACHE_PRIVATE;
}

/**
 * Gắn Cache-Control cho phản hồi thành công. Chỉ bật ở production theo mặc định; không ghi đè
 * header đã được route tự đặt (ví dụ SSE).
 */
export function cacheControlPlugin(options: TCacheControlOptions = {}) {
  const enabled = options.enabled ?? isProtectionEnabledByDefault();

  return new Elysia({ name: "app:cache-control", seed: { enabled } }).onAfterHandle(
    { as: "global" },
    ({ request, set }) => {
      if (!enabled || set.headers["cache-control"] || set.headers["Cache-Control"]) {
        return;
      }

      set.headers["cache-control"] = resolveCacheControl({ request });
    },
  );
}
