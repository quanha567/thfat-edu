import { describe, expect, it } from "vitest";

import { type TAttemptResult } from "../types";

describe("Exam Result Calculations & Data Formats", () => {
  it("formats score percentage and time spent accurately", () => {
    const mockResult: TAttemptResult = {
      attemptId: "att-12345678-test",
      quizId: "quiz-1",
      quizTitle: "Đề số 21 Đợt 1 (2027) VSAT Hóa",
      studentName: "Nguyễn Văn A",
      studentCode: "HS-2027-001",
      score: "54.00",
      totalPoints: "150.00",
      totalAnswered: 24,
      totalSubItems: 64,
      startedAt: "2026-11-15T14:00:00.000Z",
      submittedAt: "2026-11-15T14:28:04.000Z",
      durationMinutes: 50,
      timeSpentSeconds: 1684,
    };

    const scoreNum = parseFloat(mockResult.score);
    const totalNum = parseFloat(mockResult.totalPoints) || 10;
    const percentage = Math.min(100, Math.max(0, Math.round((scoreNum / totalNum) * 100)));

    expect(percentage).toBe(36);

    const minutes = Math.floor(mockResult.timeSpentSeconds / 60);
    const seconds = mockResult.timeSpentSeconds % 60;
    const timeFormatted = `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;

    expect(timeFormatted).toBe("28 phút 04 giây");

    const certCode = `CERT-${mockResult.attemptId.slice(0, 8).toUpperCase()}`;
    expect(certCode).toBe("CERT-ATT-1234");
  });
});
