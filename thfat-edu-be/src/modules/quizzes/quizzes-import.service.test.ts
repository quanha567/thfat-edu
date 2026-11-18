import { describe, expect, it } from "bun:test";

import {
  cleanMathBackslashes,
  groupMcqFlatRawItems,
  normalizeQuestionMarkdown,
  safeParseQuestions,
  stripOptionPrefix,
} from "./quizzes-import.service";

describe("quizzes-import.service > normalizeQuestionMarkdown & cleanMathBackslashes", () => {
  it("normalizes triple and quadruple backslashes before chemical formulas", () => {
    const raw = "vinyl acetate (\\\\\\ce{CH3COOCH=CH2}) và $\\\\\\ce{AgNO3}$";
    const result = normalizeQuestionMarkdown(raw);

    expect(result).not.toContain("\\\\\\ce");
    expect(result).not.toContain("\\\\ce");
    expect(result).toBe("vinyl acetate ($\\ce{CH3COOCH=CH2}$) và $\\ce{AgNO3}$");
  });

  it("normalizes multiple backslashes in math symbols and commands", () => {
    const raw = "Phản ứng \\\\\\rightarrow tạo kết tủa \\\\Delta với tỉ lệ \\\\frac{1}{2}";
    const result = normalizeQuestionMarkdown(raw);

    expect(result).toBe("Phản ứng $\\rightarrow$ tạo kết tủa $\\Delta$ với tỉ lệ $\\frac{1}{2}$");
  });

  it("normalizes standard LaTeX parenthesis \\( ... \\) and brackets \\[ ... \\]", () => {
    const raw = "Công thức \\(\\ce{H2SO4}\\) và phương trình:\n\\[\\ce{Fe + 2HCl -> FeCl2 + H2}\\]";
    const result = normalizeQuestionMarkdown(raw);

    expect(result).toContain("$\\ce{H2SO4}$");
    expect(result).toContain("$$\\ce{Fe + 2HCl -> FeCl2 + H2}$$");
  });

  it("cleans the exact user question text without unwanted newlines", () => {
    const userText =
      "Chất hữu cơ A và B là đồng phân của nhau. Trong đó, chất A là một ester có tên là vinyl acetate (\\\\\\ce{CH3COOCH=CH2}). Trùng hợp chất A thu được polymer X.\n\n" +
      "Chất hữu cơ B bền trong dung dịch sulfuric acid loãng nóng, B có thể phản ứng với thuốc thử Tollens (dung dịch $\\\\\\ce{AgNO3}$ trong $\\\\\\ce{NH3}$ dư). Ngoài ra, khi cho B tác dụng với dung dịch iodine ($\\\\\\ce{I2}$) trong môi trường kiềm thấy xuất hiện kết tủa vàng.\n\n" +
      "Câu 11. Cho chất hữu cơ B tác dụng với lượng dư dung dịch bromine.";

    const result = normalizeQuestionMarkdown(userText);

    expect(result).not.toContain("\\\\\\ce");
    expect(result).not.toContain("\\\\ce");
    expect(result).toContain("($\\ce{CH3COOCH=CH2}$)");
    expect(result).toContain("(dung dịch $\\ce{AgNO3}$ trong $\\ce{NH3}$ dư)");
    expect(result).toContain("($\\ce{I2}$)");
  });

  it("cleanMathBackslashes utility collapses multiple backslashes correctly", () => {
    expect(cleanMathBackslashes("\\\\\\ce{CuSO4}")).toBe("\\ce{CuSO4}");
    expect(cleanMathBackslashes("\\\\sqrt{x}")).toBe("\\sqrt{x}");
  });

  it("stripOptionPrefix strips leading A. B. C. D. prefixes cleanly", () => {
    expect(stripOptionPrefix("A. 2")).toBe("2");
    expect(stripOptionPrefix("B. Có kết tủa trắng xuất hiện.")).toBe("Có kết tủa trắng xuất hiện.");
    expect(stripOptionPrefix("c. 4")).toBe("4");
    expect(stripOptionPrefix("D. Không có hiện tượng gì xảy ra.")).toBe(
      "Không có hiện tượng gì xảy ra.",
    );
  });

  it("groupMcqFlatRawItems groups flattened questions sharing the same passage", () => {
    const passage =
      "Chất hữu cơ A và B là đồng phân của nhau. Trong đó, chất A là một ester có tên là vinyl acetate. Trùng hợp chất A thu được polymer X.\nChất hữu cơ B bền trong dung dịch sulfuric acid loãng nóng, B có thể phản ứng với thuốc thử Tollens.";

    const rawFlatItems = [
      {
        orderIndex: 1,
        contextContent: `${passage}\n\nCâu 10. Mỗi mắt xích trong polymer X có bao nhiêu nguyên tử carbon?`,
        options: ["A. 2", "B. 3", "C. 4", "D. 5"],
        correctAnswer: "C",
      },
      {
        orderIndex: 2,
        contextContent: `${passage}\n\nCâu 11. Cho chất hữu cơ B tác dụng với lượng dư dung dịch bromine. Hiện tượng quan sát được là:`,
        options: [
          "A. Có kết tủa trắng xuất hiện.",
          "B. Dung dịch chuyển sang màu xanh.",
          "C. Màu nâu đỏ của brom bị nhạt dần.",
          "D. Không có hiện tượng gì xảy ra.",
        ],
        correctAnswer: "C",
      },
      {
        orderIndex: 3,
        contextContent: `${passage}\n\nCâu 12. Có bao nhiêu phát biểu đúng khi nói về chất B?`,
        options: ["A. 1", "B. 2", "C. 3", "D. 4"],
        correctAnswer: "B",
      },
    ];

    const grouped = groupMcqFlatRawItems(rawFlatItems);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.contextContent).toContain("Chất hữu cơ A và B là đồng phân của nhau");
    expect(grouped[0]?.contextContent).not.toContain("Câu 10.");
    expect(grouped[0]?.contextContent).not.toContain("Câu 11.");
    expect(grouped[0]?.subItems).toHaveLength(3);

    const sub1 = grouped[0]?.subItems[0];
    expect(sub1?.label).toBe("Câu 10");
    expect(sub1?.content).toBe("Mỗi mắt xích trong polymer X có bao nhiêu nguyên tử carbon?");
    expect(sub1?.options).toEqual(["2", "3", "4", "5"]);
    expect(sub1?.correctAnswer).toBe("C");

    const sub2 = grouped[0]?.subItems[1];
    expect(sub2?.label).toBe("Câu 11");
    expect(sub2?.content).toContain("Cho chất hữu cơ B tác dụng với lượng dư dung dịch bromine");
    expect(sub2?.options?.[0]).toBe("Có kết tủa trắng xuất hiện.");

    const sub3 = grouped[0]?.subItems[2];
    expect(sub3?.label).toBe("Câu 12");
    expect(sub3?.content).toContain("Có bao nhiêu phát biểu đúng khi nói về chất B?");
    expect(sub3?.options).toEqual(["1", "2", "3", "4"]);
  });

  it("safeParseQuestions parses group_mcq without repeating passage in subItems", () => {
    const rawAiJson = JSON.stringify({
      questions: [
        {
          orderIndex: 1,
          contextContent:
            "Đọc nội dung sau và trả lời các câu hỏi từ 10 đến 12.\nChất hữu cơ A và B là đồng phân của nhau.",
          subItems: [
            {
              orderIndex: 1,
              label: "Câu 10",
              content:
                "Đọc nội dung sau và trả lời các câu hỏi từ 10 đến 12.\nChất hữu cơ A và B là đồng phân của nhau.\n\nMỗi mắt xích trong polymer X có bao nhiêu nguyên tử carbon?",
              options: ["A. 2", "B. 3", "C. 4", "D. 5"],
              correctAnswer: "C",
            },
          ],
        },
      ],
    });

    const parsed = safeParseQuestions(rawAiJson, {}, "group_mcq");
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.contextContent).toBe(
      "Đọc nội dung sau và trả lời các câu hỏi từ 10 đến 12.\nChất hữu cơ A và B là đồng phân của nhau.",
    );
    expect(parsed[0]?.subItems[0]?.content).toBe(
      "Mỗi mắt xích trong polymer X có bao nhiêu nguyên tử carbon?",
    );
    expect(parsed[0]?.subItems[0]?.options).toEqual(["2", "3", "4", "5"]);
  });
});
