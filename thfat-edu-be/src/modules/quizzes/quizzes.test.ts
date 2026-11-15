import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin } from "../../middlewares/error-handler";
import { quizzesRoutes } from "./quizzes.routes";
import { type QuizzesService } from "./quizzes.service";

describe("quizzes.routes", () => {
  const mockQuizzesService = {
    listQuizzes: async () => ({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    }),
  } as unknown as QuizzesService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("quizzesService", mockQuizzesService)
    .use(quizzesRoutes);

  it("GET /quizzes returns a paginated list structure", async () => {
    const response = await testApp.handle(new Request("http://localhost/quizzes?page=1&limit=10"));

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
