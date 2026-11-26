import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin } from "../../middlewares/error-handler";
import { bearer, createMockAuthService } from "../auth/auth.test-utils";
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
    solveQuestion: async () => ({
      subItems: [
        {
          orderIndex: 0,
          label: "a",
          correctAnswer: "Đúng",
          acceptableAnswers: null,
          explanation: "Phát biểu chính xác.",
        },
      ],
    }),
  } as unknown as QuizzesService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", createMockAuthService())
    .decorate("quizzesService", mockQuizzesService)
    .use(quizzesRoutes);

  it("GET /quizzes returns a paginated list structure", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/quizzes?page=1&limit=10", { headers: bearer("teacher") }),
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

  it("POST /quizzes/ai/solve-question returns solved subItems", async () => {
    const payload = {
      sectionType: "true_false",
      question: {
        orderIndex: 0,
        contextContent: "Cho các phát biểu sau về hợp chất X:",
        imageUrl: null,
        subItems: [
          {
            orderIndex: 0,
            label: "a",
            content: "Hợp chất X có tính oxi hóa mạnh.",
            points: "1.50",
          },
        ],
      },
    };

    const response = await testApp.handle(
      new Request("http://localhost/quizzes/ai/solve-question", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...bearer("teacher") },
        body: JSON.stringify(payload),
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      subItems: Array<{
        orderIndex: number;
        label: string;
        correctAnswer: string;
      }>;
    };

    expect(body).toBeDefined();
    expect(Array.isArray(body.subItems)).toBe(true);
    expect(body.subItems[0]?.correctAnswer).toBe("Đúng");
  });
});
