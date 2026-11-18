import { describe, expect, it } from "vitest";

import {
  extractMatchingHeaders,
  formatMatchingOption,
  getMatchingOptions,
  parseMatchingOption,
} from "./matching.types";

describe("matching.types helpers", () => {
  describe("parseMatchingOption", () => {
    it("parses options formatted with letter prefix", () => {
      const res = parseMatchingOption("A. Tơ visco", 0);
      expect(res.letter).toBe("A");
      expect(res.content).toBe("Tơ visco");
      expect(res.raw).toBe("A. Tơ visco");
    });

    it("parses bare option text and assigns default letter from index", () => {
      const res = parseMatchingOption("Tơ tằm", 1);
      expect(res.letter).toBe("B");
      expect(res.content).toBe("Tơ tằm");
    });

    it("handles single letter options", () => {
      const res = parseMatchingOption("C", 2);
      expect(res.letter).toBe("C");
      expect(res.content).toBe("");
    });
  });

  describe("formatMatchingOption", () => {
    it("formats option with letter and content", () => {
      expect(formatMatchingOption("A", "Tơ visco")).toBe("A. Tơ visco");
    });

    it("strips duplicate letter prefix if present in content", () => {
      expect(formatMatchingOption("A", "A. Tơ visco")).toBe("A. Tơ visco");
      expect(formatMatchingOption("B", "b: Tơ tằm")).toBe("B. Tơ tằm");
    });

    it("returns just the letter if content is empty", () => {
      expect(formatMatchingOption("A", "")).toBe("A");
      expect(formatMatchingOption("C", "   ")).toBe("C");
    });
  });

  describe("getMatchingOptions", () => {
    it("returns default options A-D if subItems have no options", () => {
      const res = getMatchingOptions([{ options: null }, { options: [] }]);
      expect(res).toHaveLength(4);
      expect(res.map((r) => r.letter)).toEqual(["A", "B", "C", "D"]);
    });

    it("extracts and parses options from the first subItem with options", () => {
      const res = getMatchingOptions([
        {
          options: [
            "A. Tơ visco",
            "B. Tơ tằm",
            "C. Cao su buna",
            "D. Tơ cellulose acetate",
            "E. Tơ nylon-6,6",
            "F. Keo dán epoxy",
          ],
        },
      ]);
      expect(res).toHaveLength(6);
      expect(res[0]?.letter).toBe("A");
      expect(res[0]?.content).toBe("Tơ visco");
      expect(res[5]?.letter).toBe("F");
      expect(res[5]?.content).toBe("Keo dán epoxy");
    });
  });

  describe("extractMatchingHeaders", () => {
    it("returns fallback headers when context is empty", () => {
      const res = extractMatchingHeaders();
      expect(res.col1Title).toBe("Nội dung vế ghép (Cột 1)");
      expect(res.col2Title).toBe("Phương án đối chiếu (Cột 2)");
    });

    it("extracts column headers from context pattern", () => {
      const context = "Cột 1 (Yêu cầu) - Cột 2 (Giá trị)";
      const res = extractMatchingHeaders(context);
      expect(res.col1Title).toContain("Yêu cầu");
      expect(res.col2Title).toContain("Giá trị");
    });
  });
});
