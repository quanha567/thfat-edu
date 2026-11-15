import { describe, expect, it } from "bun:test";

import { attemptStatusEnum, examAnswers, examAttempts } from "./attempts";

describe("attempts schema", () => {
  it("defines attempt status enum values correctly", () => {
    expect(attemptStatusEnum.enumValues).toEqual(["in_progress", "submitted", "abandoned"]);
  });

  it("defines examAttempts table with appropriate fields", () => {
    expect(examAttempts.id).toBeDefined();
    expect(examAttempts.quizId).toBeDefined();
    expect(examAttempts.userId).toBeDefined();
    expect(examAttempts.startedAt).toBeDefined();
    expect(examAttempts.submittedAt).toBeDefined();
    expect(examAttempts.status).toBeDefined();
    expect(examAttempts.score).toBeDefined();
    expect(examAttempts.totalAnswered).toBeDefined();
  });

  it("defines examAnswers table with appropriate fields", () => {
    expect(examAnswers.id).toBeDefined();
    expect(examAnswers.attemptId).toBeDefined();
    expect(examAnswers.subItemId).toBeDefined();
    expect(examAnswers.selectedAnswer).toBeDefined();
    expect(examAnswers.isCorrect).toBeDefined();
    expect(examAnswers.pointsEarned).toBeDefined();
    expect(examAnswers.isFlagged).toBeDefined();
  });
});
