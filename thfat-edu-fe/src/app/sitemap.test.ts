import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import sitemap from "./sitemap";

describe("sitemap route handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns static pages when API request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              slug: "bai-tap-kim-loai-kiem",
              updatedAt: "2026-11-18T00:00:00.000Z",
              createdAt: "2026-11-17T00:00:00.000Z",
            },
          ],
        }),
      }),
    );

    const result = await sitemap();

    expect(result.some((entry) => entry.url.endsWith("/"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/articles"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/exams"))).toBe(true);
    expect(result.some((entry) => entry.url.endsWith("/leaderboard"))).toBe(true);
    expect(result.some((entry) => entry.url.includes("/articles/bai-tap-kim-loai-kiem"))).toBe(
      true,
    );
  });

  it("gracefully falls back to static routes if API request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network connection error")));

    const result = await sitemap();

    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result.some((entry) => entry.url.endsWith("/articles"))).toBe(true);
  });
});
