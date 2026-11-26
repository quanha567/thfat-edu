import { Elysia } from "elysia";

export type TRateLimitBucket = "login" | "register" | "expensive" | "write" | "read";

export type TRateLimitRule = {
  limit: number;
  windowMs: number;
};

export const RATE_LIMIT_RULES: Record<TRateLimitBucket, TRateLimitRule> = {
  login: { limit: 10, windowMs: 60_000 },
  register: { limit: 5, windowMs: 15 * 60_000 },
  expensive: { limit: 10, windowMs: 60_000 },
  write: { limit: 60, windowMs: 60_000 },
  read: { limit: 120, windowMs: 60_000 },
};

export type TRateLimitOptions = {
  enabled?: boolean;
  rules?: Partial<Record<TRateLimitBucket, TRateLimitRule>>;
};

type TWindowEntry = {
  count: number;
  resetAt: number;
};

const MAX_TRACKED_KEYS = 10_000;
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SKIPPED_PATHS = new Set(["/", "/health"]);

export function isProtectionEnabledByDefault(): boolean {
  return process.env.NODE_ENV === "production";
}

export function normalizePath(pathname: string): string {
  const withoutApi = pathname.startsWith("/api/") ? pathname.slice(4) : pathname;

  return withoutApi.length > 1 ? withoutApi.replace(/\/+$/, "") : withoutApi;
}

export function resolveBucket({
  method,
  path,
}: {
  method: string;
  path: string;
}): TRateLimitBucket {
  if (method === "POST" && path === "/auth/login") {
    return "login";
  }

  if (path === "/register" || path.startsWith("/register/")) {
    return "register";
  }

  const isExpensive =
    method === "POST" && (path.includes("/ai/") || path.startsWith("/quizzes/import/"));

  if (isExpensive) {
    return "expensive";
  }

  return WRITE_METHODS.has(method) ? "write" : "read";
}

function resolveClientKey(request: Request): string {
  const sessionMatch = /(?:^|;\s*)session_token=([^;]+)/.exec(request.headers.get("cookie") ?? "");
  const bearer = request.headers.get("authorization");
  const sessionKey = sessionMatch?.[1] ?? bearer?.replace(/^Bearer\s+/i, "");

  if (sessionKey) {
    return `s:${sessionKey}`;
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  return `ip:${ip}`;
}

function buildTooManyRequestsResponse(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      type: "about:blank",
      title: "Too Many Requests",
      status: 429,
      detail: `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${retryAfterSeconds} giây.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/problem+json",
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    },
  );
}

/** Rate limit theo bộ nhớ (mỗi instance đếm riêng). Chỉ bật ở production theo mặc định. */
export function rateLimitPlugin(options: TRateLimitOptions = {}) {
  const enabled = options.enabled ?? isProtectionEnabledByDefault();
  const rules = { ...RATE_LIMIT_RULES, ...options.rules };
  const windows = new Map<string, TWindowEntry>();

  function prune(now: number): void {
    if (windows.size < MAX_TRACKED_KEYS) {
      return;
    }

    for (const [key, entry] of windows) {
      if (entry.resetAt <= now) {
        windows.delete(key);
      }
    }
  }

  return new Elysia({ name: "app:rate-limit", seed: { enabled } }).onRequest(({ request }) => {
    if (!enabled || request.method === "OPTIONS") {
      return;
    }

    const path = normalizePath(new URL(request.url).pathname);

    if (SKIPPED_PATHS.has(path)) {
      return;
    }

    const bucket = resolveBucket({ method: request.method, path });
    const rule = rules[bucket];
    const now = Date.now();
    const key = `${bucket}|${resolveClientKey(request)}`;

    prune(now);

    const entry = windows.get(key);

    if (!entry || entry.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + rule.windowMs });

      return;
    }

    entry.count += 1;

    if (entry.count <= rule.limit) {
      return;
    }

    return buildTooManyRequestsResponse(Math.max(1, Math.ceil((entry.resetAt - now) / 1000)));
  });
}
