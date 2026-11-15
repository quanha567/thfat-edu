import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin } from "../../middlewares/error-handler";
import { attemptsRoutes } from "./attempts.routes";
import { type AttemptsService } from "./attempts.service";

describe("attempts.routes (Student Exams)", () => {
  const mockAttemptsService = {
    listStudentExams: async () => ({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    }),
  } as unknown as AttemptsService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("attemptsService", mockAttemptsService)
    .use(attemptsRoutes);

  it("GET /student-exams returns 200 and list structure for public view", async () => {
    const response = await testApp.handle(new Request("http://localhost/student-exams"));

    expect(response.status).toBe(200);
    const body = (await response.json()) as { items: unknown[]; total: number };
    expect(body).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("POST /student-exams/:id/start returns 401 when unauthenticated", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/student-exams/test-id/start", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(401);
  });

  it("PUT /student-exams/:id/sync returns 401 when unauthenticated", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/student-exams/test-id/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: [] }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("POST /student-exams/:id/submit returns 401 when unauthenticated", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/student-exams/test-id/submit", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(401);
  });

  it("GET /student-exams/:id/result returns 401 when unauthenticated", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/student-exams/test-id/result"),
    );

    expect(response.status).toBe(401);
  });
});
