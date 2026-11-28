import { describe, expect, it } from "vitest";

import { type TAttemptResult } from "../types";
import { buildCertificateModel } from "./exam-certificate.utils";

const baseResult: TAttemptResult = {
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

describe("buildCertificateModel", () => {
  it("formats time spent and cert code", () => {
    const cert = buildCertificateModel(baseResult);
    expect(cert.timeFormatted).toBe("28 phút 04 giây");
    expect(cert.certCode).toBe("CERT-ATT-1234");
    expect(cert.studentCode).toBe("HS-2027-001");
  });

  it("falls back to cert code and default name when student info is missing", () => {
    const cert = buildCertificateModel({
      ...baseResult,
      studentCode: undefined,
      studentName: undefined,
    });

    expect(cert.studentCode).toBe("CERT-ATT-1234");
    expect(cert.studentName).toBe("Thí sinh");
  });
});
