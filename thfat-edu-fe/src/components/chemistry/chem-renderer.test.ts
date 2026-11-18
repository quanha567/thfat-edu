import { describe, expect, it } from "vitest";

import { cleanMathBackslashes, preprocessChemContent } from "./chem-renderer";

describe("preprocessChemContent & cleanMathBackslashes", () => {
  it("normalizes triple backslashes before chemical formulas ($...$)", () => {
    const raw = "vinyl acetate ($\\ce{CH3COOCH=CH2}$)";
    const tripleRaw = "vinyl acetate (\\\\\\ce{CH3COOCH=CH2})";
    const processed = preprocessChemContent(tripleRaw);

    expect(processed).toBe(raw);
  });

  it("normalizes double and quadruple backslashes before chemical formulas", () => {
    const double = "dung dịch $\\\\ce{AgNO3}$ trong $\\\\ce{NH3}$";
    const quad = "dung dịch $\\\\\\\\ce{AgNO3}$ trong $\\\\\\\\ce{NH3}$";

    expect(preprocessChemContent(double)).toBe("dung dịch $\\ce{AgNO3}$ trong $\\ce{NH3}$");
    expect(preprocessChemContent(quad)).toBe("dung dịch $\\ce{AgNO3}$ trong $\\ce{NH3}$");
  });

  it("handles the exact user screenshot text with multiple \\\ce tags without breaking line structure", () => {
    const userText =
      "Chất hữu cơ A và B là đồng phân của nhau. Trong đó, chất A là một ester có tên là vinyl acetate (\\\\\\ce{CH3COOCH=CH2}). Trùng hợp chất A thu được polymer X.\n\n" +
      "Chất hữu cơ B bền trong dung dịch sulfuric acid loãng nóng, B có thể phản ứng với thuốc thử Tollens (dung dịch $\\\\\\ce{AgNO3}$ trong $\\\\\\ce{NH3}$ dư). Ngoài ra, khi cho B tác dụng với dung dịch iodine ($\\\\\\ce{I2}$) trong môi trường kiềm thấy xuất hiện kết tủa vàng.\n\n" +
      "Câu 11. Cho chất hữu cơ B tác dụng với lượng dư dung dịch bromine.";

    const result = preprocessChemContent(userText);

    expect(result).not.toContain("\\\\\\ce");
    expect(result).not.toContain("\\\\ce");
    expect(result).toContain("($\\ce{CH3COOCH=CH2}$)");
    expect(result).toContain("(dung dịch $\\ce{AgNO3}$ trong $\\ce{NH3}$ dư)");
    expect(result).toContain("($\\ce{I2}$)");
  });

  it("normalizes bare \\ce{...} with multiple backslashes outside of $", () => {
    const raw = "Phản ứng giữa \\\\\\ce{Fe} và \\\\ce{CuSO4}";
    const processed = preprocessChemContent(raw);

    expect(processed).toBe("Phản ứng giữa $\\ce{Fe}$ và $\\ce{CuSO4}$");
  });

  it("normalizes bare math symbols and arrows with multiple backslashes", () => {
    const raw = "A \\\\\\rightarrow B \\\\rightleftharpoons C + \\\\Delta";
    const processed = preprocessChemContent(raw);

    expect(processed).toBe("A $\\rightarrow$ B $\\rightleftharpoons$ C + $\\Delta$");
  });

  it("normalizes standard LaTeX parenthesis \\( ... \\) into inline $ ... $", () => {
    const raw = "Nồng độ \\(\\ce{H2SO4}\\) là 0.1M";
    const processed = preprocessChemContent(raw);

    expect(processed).toBe("Nồng độ $\\ce{H2SO4}$ là 0.1M");
  });

  it("normalizes standard LaTeX brackets \\[ ... \\] into block $$ ... $$", () => {
    const raw = "Phương trình: \\[\\ce{2H2 + O2 -> 2H2O}\\]";
    const processed = preprocessChemContent(raw);

    expect(processed).toBe("Phương trình: $$\\ce{2H2 + O2 -> 2H2O}$$");
  });

  it("cleanMathBackslashes utility collapses multiple backslashes before commands", () => {
    expect(cleanMathBackslashes("\\\\\\ce{H2O}")).toBe("\\ce{H2O}");
    expect(cleanMathBackslashes("\\\\frac{1}{2}")).toBe("\\frac{1}{2}");
    expect(cleanMathBackslashes("\\\\\\\\rightarrow")).toBe("\\rightarrow");
  });
});
