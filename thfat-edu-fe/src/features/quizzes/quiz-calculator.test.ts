import { describe, it, expect } from "vitest";

import { calculateQuizResult, calculateMolarMass } from "./quiz-calculator";
import type { QuizQuestion } from "./types";

describe("Chemistry Quiz Calculator", () => {
  const sampleQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question:
        "Kim loại nào sau đây tác dụng với dung dịch $\\ce{HCl}$ giải phóng khí $\\ce{H2}$?",
      options: [
        { id: "opt_a", text: "$\\ce{Cu}$" },
        { id: "opt_b", text: "$\\ce{Fe}$" },
        { id: "opt_c", text: "$\\ce{Ag}$" },
        { id: "opt_d", text: "$\\ce{Au}$" },
      ],
      correctOptionId: "opt_b",
      explanation:
        "$\\ce{Fe + 2HCl -> FeCl2 + H2 ^}$, còn Cu, Ag, Au đứng sau H trong dãy điện hóa.",
      points: 10,
    },
    {
      id: "q2",
      question: "Công thức hóa học của axit sunfuric đặc là gì?",
      options: [
        { id: "opt_a", text: "$\\ce{H2SO3}$" },
        { id: "opt_b", text: "$\\ce{HNO3}$" },
        { id: "opt_c", text: "$\\ce{H2SO4}$" },
        { id: "opt_d", text: "$\\ce{HCl}$" },
      ],
      correctOptionId: "opt_c",
      explanation: "Axit sunfuric có công thức là $\\ce{H2SO4}$.",
      points: 10,
    },
  ];

  it("calculates 100% score when all answers are correct", () => {
    const result = calculateQuizResult(sampleQuestions, {
      q1: "opt_b",
      q2: "opt_c",
    });

    expect(result.totalQuestions).toBe(2);
    expect(result.correctAnswers).toBe(2);
    expect(result.earnedPoints).toBe(20);
    expect(result.scorePercentage).toBe(100);
  });

  it("calculates partial score when one answer is incorrect", () => {
    const result = calculateQuizResult(sampleQuestions, {
      q1: "opt_a",
      q2: "opt_c",
    });

    expect(result.correctAnswers).toBe(1);
    expect(result.earnedPoints).toBe(10);
    expect(result.scorePercentage).toBe(50);
  });

  it("calculates molar mass for H2O correctly", () => {
    // H2O: 2 * 1.008 + 1 * 15.999 = 18.015
    const mass = calculateMolarMass({ H: 2, O: 1 });
    expect(mass).toBe(18.015);
  });

  it("calculates molar mass for H2SO4 correctly", () => {
    // H2SO4: 2 * 1.008 + 1 * 32.06 + 4 * 15.999 = 98.072
    const mass = calculateMolarMass({ H: 2, S: 1, O: 4 });
    expect(mass).toBe(98.072);
  });
});
