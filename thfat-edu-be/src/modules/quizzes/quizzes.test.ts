import { describe, expect, it } from "bun:test";

import { app } from "../../index";

describe("quizzes.routes", () => {
  it("GET /api/quizzes returns a paginated list structure", async () => {
    const response = await app.handle(
      new Request("http://localhost:3001/api/quizzes?page=1&limit=10"),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      items: unknown[];
      total: number;
      page: number;
      limit: number;
    };

    expect(body).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
    expect(typeof body.total).toBe("number");
    expect(body.page).toBe(1);
    expect(body.limit).toBe(10);
  });
});
