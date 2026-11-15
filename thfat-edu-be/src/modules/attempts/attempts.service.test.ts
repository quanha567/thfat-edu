import { describe, expect, it } from "bun:test";

import {
  calculateGraduatedTrueFalsePoints,
  isShortAnswerCorrect,
  normalizeBooleanAnswer,
  normalizeShortAnswer,
} from "./attempts.service";

describe("attempts.service - Grading Engine Helpers", () => {
  describe("normalizeBooleanAnswer", () => {
    it("normalizes true values accurately", () => {
      expect(normalizeBooleanAnswer("true")).toBe("true");
      expect(normalizeBooleanAnswer("True")).toBe("true");
      expect(normalizeBooleanAnswer("T")).toBe("true");
      expect(normalizeBooleanAnswer("Đ")).toBe("true");
      expect(normalizeBooleanAnswer("đ")).toBe("true");
      expect(normalizeBooleanAnswer("1")).toBe("true");
    });

    it("normalizes false values accurately", () => {
      expect(normalizeBooleanAnswer("false")).toBe("false");
      expect(normalizeBooleanAnswer("False")).toBe("false");
      expect(normalizeBooleanAnswer("F")).toBe("false");
      expect(normalizeBooleanAnswer("S")).toBe("false");
      expect(normalizeBooleanAnswer("s")).toBe("false");
      expect(normalizeBooleanAnswer("0")).toBe("false");
    });

    it("returns null for empty or invalid values", () => {
      expect(normalizeBooleanAnswer(null)).toBeNull();
      expect(normalizeBooleanAnswer("")).toBeNull();
      expect(normalizeBooleanAnswer("invalid")).toBeNull();
    });
  });

  describe("calculateGraduatedTrueFalsePoints", () => {
    it("applies MOET graduated scale accurately for 1.0 total point question", () => {
      expect(calculateGraduatedTrueFalsePoints(0, 1.0)).toBe(0);
      expect(calculateGraduatedTrueFalsePoints(1, 1.0)).toBe(0.1);
      expect(calculateGraduatedTrueFalsePoints(2, 1.0)).toBe(0.25);
      expect(calculateGraduatedTrueFalsePoints(3, 1.0)).toBe(0.5);
      expect(calculateGraduatedTrueFalsePoints(4, 1.0)).toBe(1.0);
    });

    it("scales proportionally if total point differs from 1.0", () => {
      expect(calculateGraduatedTrueFalsePoints(4, 2.0)).toBe(2.0);
      expect(calculateGraduatedTrueFalsePoints(2, 2.0)).toBe(0.5);
    });
  });

  describe("normalizeShortAnswer & isShortAnswerCorrect", () => {
    it("trims and normalizes decimals with comma or period", () => {
      expect(normalizeShortAnswer(" 12,5 ")).toBe("12.5");
      expect(normalizeShortAnswer("12.5")).toBe("12.5");
      expect(normalizeShortAnswer("  Fe2O3 ")).toBe("fe2o3");
    });

    it("correctly evaluates short answer with comma vs period", () => {
      expect(isShortAnswerCorrect("12,5", "12.5", [])).toBe(true);
      expect(isShortAnswerCorrect(" 12.50 ", "12.5", ["12.50"])).toBe(true);
      expect(isShortAnswerCorrect("13", "12.5", ["12.50"])).toBe(false);
    });

    it("correctly evaluates acceptable answers list", () => {
      expect(isShortAnswerCorrect("đồng", "Cu", ["Cu", "Dong", "dong"])).toBe(true);
      expect(isShortAnswerCorrect("nhôm", "Cu", ["Cu", "Dong"])).toBe(false);
    });
  });
});
