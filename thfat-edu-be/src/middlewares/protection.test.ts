import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import {
  cacheControlPlugin,
  CACHE_PRIVATE,
  CACHE_PUBLIC_CONTENT,
  CACHE_PUBLIC_LEADERBOARD,
} from "./cache-control";
import { rateLimitPlugin } from "./rate-limit";

function buildApp(options: { enabled: boolean; limit?: number }) {
  return new Elysia()
    .use(
      rateLimitPlugin({
        enabled: options.enabled,
        rules: { read: { limit: options.limit ?? 3, windowMs: 60_000 } },
      }),
    )
    .use(cacheControlPlugin({ enabled: options.enabled }))
    .get("/articles", () => ({ ok: true }))
    .get("/articles/:slug", () => ({ ok: true }))
    .get("/categories", () => ({ ok: true }))
    .get("/leaderboard", () => ({ ok: true }))
    .get("/student-exams", () => ({ ok: true }))
    .post("/quizzes", () => ({ ok: true }));
}

function get(app: ReturnType<typeof buildApp>, path: string, headers: HeadersInit = {}) {
  return app.handle(new Request(`http://localhost${path}`, { headers }));
}

describe("rate limit", () => {
  it("returns 429 RFC 7807 after exceeding the limit", async () => {
    const app = buildApp({ enabled: true, limit: 3 });
    const headers = { "x-forwarded-for": "1.2.3.4" };

    for (let index = 0; index < 3; index += 1) {
      expect((await get(app, "/articles", headers)).status).toBe(200);
    }

    const blocked = await get(app, "/articles", headers);
    const body = (await blocked.json()) as { type: string; title: string; status: number };

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect(body).toMatchObject({ type: "about:blank", title: "Too Many Requests", status: 429 });
  });

  it("counts each client separately", async () => {
    const app = buildApp({ enabled: true, limit: 1 });

    expect((await get(app, "/articles", { "x-forwarded-for": "1.1.1.1" })).status).toBe(200);
    expect((await get(app, "/articles", { "x-forwarded-for": "2.2.2.2" })).status).toBe(200);
  });

  it("is disabled when not enabled (dev)", async () => {
    const app = buildApp({ enabled: false, limit: 1 });

    for (let index = 0; index < 5; index += 1) {
      expect((await get(app, "/articles")).status).toBe(200);
    }
  });
});

describe("cache control", () => {
  const app = buildApp({ enabled: true, limit: 1000 });

  it("caches public content", async () => {
    for (const path of ["/articles", "/articles/some-slug", "/categories"]) {
      expect((await get(app, path)).headers.get("cache-control")).toBe(CACHE_PUBLIC_CONTENT);
    }
  });

  it("caches the leaderboard for Guests only", async () => {
    expect((await get(app, "/leaderboard")).headers.get("cache-control")).toBe(
      CACHE_PUBLIC_LEADERBOARD,
    );
    expect(
      (await get(app, "/leaderboard", { authorization: "Bearer abc" })).headers.get(
        "cache-control",
      ),
    ).toBe(CACHE_PRIVATE);
    expect(
      (await get(app, "/leaderboard", { cookie: "session_token=abc" })).headers.get(
        "cache-control",
      ),
    ).toBe(CACHE_PRIVATE);
  });

  it("never caches authenticated or write endpoints", async () => {
    expect((await get(app, "/student-exams")).headers.get("cache-control")).toBe(CACHE_PRIVATE);

    const post = await app.handle(new Request("http://localhost/quizzes", { method: "POST" }));

    expect(post.headers.get("cache-control")).toBe(CACHE_PRIVATE);
  });

  it("sets no cache header in dev", async () => {
    const devApp = buildApp({ enabled: false });

    expect((await get(devApp, "/articles")).headers.get("cache-control")).toBeNull();
  });
});
