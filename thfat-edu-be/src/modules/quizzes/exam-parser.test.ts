import { describe, expect, it } from "bun:test";

import { normalizeExamData, type TParsedExamData } from "./exam-parser.service";

describe("exam-parser.service", () => {
  it("normalizes incomplete exam json into valid 4-section structure with 150 points", () => {
    const rawData: Partial<TParsedExamData> = {
      title: "Đề thi thử THPT Quốc Gia Hóa học 2026",
      sections: [
        {
          sectionType: "true_false",
          title: "Phần I: Câu hỏi Đúng / Sai",
          orderIndex: 0,
          questions: [
            {
              orderIndex: 1,
              contextContent: "Cho thí nghiệm điều chế khí $\\ce{Cl2}$...",
              subItems: [
                {
                  orderIndex: 1,
                  label: "a",
                  content: "Khí $\\ce{Cl2}$ có màu vàng lục.",
                  correctAnswer: "true",
                  points: "1.50",
                },
              ],
            },
          ],
        },
      ],
    };

    const normalized = normalizeExamData(rawData);

    expect(normalized.title).toBe("Đề thi thử THPT Quốc Gia Hóa học 2026");
    expect(normalized.durationMinutes).toBe(50);
    expect(normalized.totalPoints).toBe("150.00");
    expect(normalized.sections.length).toBe(4);

    const sectionTypes = normalized.sections.map((s) => s.sectionType);
    expect(sectionTypes).toContain("true_false");
    expect(sectionTypes).toContain("group_mcq");
    expect(sectionTypes).toContain("matching");
    expect(sectionTypes).toContain("short_answer");
  });
});
