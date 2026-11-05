import { describe, expect, it } from "bun:test";

import {
  normalizeExamData,
  parseExamTextLocally,
  type TParsedExamData,
} from "./exam-parser.service";

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

  it("extracts exam structure locally from raw text without timing out", () => {
    const sampleText = `
SỞ GIÁO DỤC VÀ ĐÀO TẠO - ĐỀ ÔN TẬP HÓA HỌC 2026
PHẦN I. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu 9.
Câu 1: Cho các phát biểu sau về hợp chất của sắt:
a) Dung dịch FeCl3 có màu vàng nâu.
b) Sắt tác dụng với Cl2 tạo thành FeCl2.
c) Fe(OH)3 là kết tủa màu nâu đỏ.
d) Fe2O3 là oxit bazơ.

PHẦN II. Câu hỏi trắc nghiệm theo nhóm.
Câu 10: Cho sơ đồ thí nghiệm điều chế khí X trong phòng thí nghiệm.
1. Khí X có thể là khí nào sau đây?
A. SO2
B. CO2
C. NH3
D. H2

PHẦN III. Câu ghép hợp.
Câu 16: Ghép chất với ứng dụng:
1) NaHCO3 ⟷ Thuốc đau dạ dày
2) NaCl ⟷ Nước muối sinh lý

PHẦN IV. Câu trả lời ngắn.
Câu 21: Hòa tan hoàn toàn 5,6 gam Fe vào dung dịch HCl dư. Thể tích khí H2 (đktc) thu được là bao nhiêu lít?
Đáp án: 2.24
    `;

    const parsed = parseExamTextLocally(sampleText);
    expect(parsed.sections.length).toBe(4);

    const tfSection = parsed.sections.find((s) => s.sectionType === "true_false");
    expect(tfSection?.questions.length).toBeGreaterThan(0);
    expect(tfSection?.questions[0]?.subItems.length).toBe(4);

    const shortAnswerSection = parsed.sections.find((s) => s.sectionType === "short_answer");
    expect(shortAnswerSection?.questions.length).toBeGreaterThan(0);
  });
});
