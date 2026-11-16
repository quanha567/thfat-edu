import { describe, expect, it } from "bun:test";

import { cleanAndMergeLines, extractPdfDocument } from "./pdf-extractor.service";

describe("pdf-extractor.service - cleanAndMergeLines", () => {
  it("returns empty string when input is empty or nullish", () => {
    expect(cleanAndMergeLines("")).toBe("");
  });

  it("merges fragmented lines when lines do not end with punctuation", () => {
    const raw = `Hỗn hợp X gồm axit axetic
và ancol etylic có tỉ lệ mol 1:1.
Đun nóng X với H2SO4 đặc làm xúc tác.`;

    const cleaned = cleanAndMergeLines(raw);
    expect(cleaned).toContain("Hỗn hợp X gồm axit axetic và ancol etylic có tỉ lệ mol 1:1.");
    expect(cleaned).toContain("Đun nóng X với H2SO4 đặc làm xúc tác.");
  });

  it("splits paragraphs on header patterns like PHẦN, CÂU, and options [A-D]", () => {
    const raw = `PHẦN I: CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI
Câu 1: Cho các phát biểu sau:
A. Glucozơ có phản ứng tráng bạc.
B. Saccarozơ bị thủy phân trong môi trường kiềm.`;

    const cleaned = cleanAndMergeLines(raw);
    const lines = cleaned.split("\n\n");

    expect(lines[0]).toBe("PHẦN I: CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI");
    expect(lines[1]).toBe("Câu 1: Cho các phát biểu sau:");
    expect(lines[2]).toBe("A. Glucozơ có phản ứng tráng bạc.");
    expect(lines[3]).toBe("B. Saccarozơ bị thủy phân trong môi trường kiềm.");
  });

  it("preserves image placeholders as isolated blocks", () => {
    const raw = `Cho sơ đồ thí nghiệm điều chế khí X như hình vẽ sau:
[HÌNH_ẢNH: IMAGE_PAGE_1_1]
Khí X thu được trong bình thu là chất nào?`;

    const cleaned = cleanAndMergeLines(raw);
    expect(cleaned).toContain("[HÌNH_ẢNH: IMAGE_PAGE_1_1]");
  });
});

describe("pdf-extractor.service - extractPdfDocument", () => {
  it("throws a descriptive error when PDF has fewer than 100 text characters (scanned PDF)", async () => {
    // Minimal valid PDF with tiny text (< 100 chars)
    const tinyPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 30 >> stream
BT
/F1 12 Tf
100 700 Td
(Scan) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000238 00000 n 
0000000319 00000 n 
trailer << /Root 1 0 R /Size 6 >>
startxref
398
%%EOF`;

    const pdfBuffer = Buffer.from(tinyPdf);

    expect(extractPdfDocument(pdfBuffer)).rejects.toThrow(
      "Tài liệu PDF là dạng ảnh scan hoặc không có lớp văn bản số hóa có thể đọc được",
    );
  });

  it("extracts text correctly from a valid PDF buffer with sufficient text content", async () => {
    const validExamPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 200 >> stream
BT
/F1 12 Tf
50 720 Td
(KHOA HOC TU NHIEN - MON HOA HOC) Tj
0 -30 Td
(PHAN I: CAU HOI TRAC NGHIEM NHIEU PHUONG AN LUA CHON) Tj
0 -30 Td
(Cau 1: Cho cac chat sau day tham gia phan ung hoa hoc trong dung dich nuoc o nhiet do phong) Tj
0 -30 Td
(A. Axit axetic la mot axit yeu co trong giam an thuong ngay.) Tj
0 -30 Td
(B. Ancol etylic co the gay nghien va anh huong toi he than kinh.) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000238 00000 n 
0000000489 00000 n 
trailer << /Root 1 0 R /Size 6 >>
startxref
568
%%EOF`;

    const pdfBuffer = Buffer.from(validExamPdf);
    const result = await extractPdfDocument(pdfBuffer);

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].pageNumber).toBe(1);
    expect(result.pages[0].text).toContain("KHOA HOC TU NHIEN - MON HOA HOC");
    expect(result.pages[0].text).toContain("PHAN I: CAU HOI TRAC NGHIEM NHIEU PHUONG AN LUA CHON");
    expect(result.images).toBeDefined();
  });
});
