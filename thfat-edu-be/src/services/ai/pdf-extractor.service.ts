import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
// @ts-expect-error pdfjs-dist ships no type declarations for the worker entry
import { WorkerMessageHandler } from "pdfjs-dist/legacy/build/pdf.worker.mjs";
import sharp from "sharp";

import { createModuleLogger } from "../../config/logger";

// Serverless bundles don't ship pdf.worker.mjs, so pdfjs's dynamic import of it
// fails ("Setting up fake worker failed"). Importing it statically bundles it
// and pre-registers the handler so pdfjs skips the dynamic import.
Object.assign(globalThis, { pdfjsWorker: { WorkerMessageHandler } });

const pdfLogger = createModuleLogger("pdf-extractor");

export type TPdfExtractedPage = {
  pageNumber: number;
  text: string;
};

export type TPdfExtractionResult = {
  pages: TPdfExtractedPage[];
  images: Record<string, string>;
};

type TContentItem = {
  type: "text" | "image";
  y0: number;
  x0: number;
  text: string;
};

type TTextItemWithCoords = {
  str: string;
  x: number;
  y: number;
};

type TImageRawData = {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray;
};

const HEADER_OR_LIST_PATTERN =
  /^(PHẦN\s+[IVXLCDM]+|CÂU\s+\d+|Câu\s+\d+|[A-D]\.|\d+\.|-|\*|\[HÌNH_ẢNH:|BÀI\s+THI|ĐỀ\s+|KỲ\s+THI|MÔN\s*:|GV\s*:|Giáo\s+viên|Thời\s+gian|NĂM\s+HỌC|Cho\s+biết|MÃ\s+ĐỀ|Mã\s+đề|Họ\s+và\s+tên|Số\s+báo\s+danh)/i;

const ENDING_PUNCTUATION_PATTERN = /[:.?!]$|===$/;

export function cleanAndMergeLines(text: string): string {
  if (!text) return "";

  const rawLines = text.split("\n").map((line) => line.trim());
  const mergedLines: string[] = [];
  let buffer = "";

  for (const line of rawLines) {
    if (!line) {
      if (buffer) {
        mergedLines.push(buffer);
        buffer = "";
      }
      continue;
    }

    if (HEADER_OR_LIST_PATTERN.test(line)) {
      if (buffer) {
        mergedLines.push(buffer);
        buffer = "";
      }
      buffer = line;
    } else {
      if (!buffer) {
        buffer = line;
      } else if (ENDING_PUNCTUATION_PATTERN.test(buffer)) {
        mergedLines.push(buffer);
        buffer = line;
      } else {
        buffer += ` ${line}`;
      }
    }
  }

  if (buffer) {
    mergedLines.push(buffer);
  }

  return mergedLines.join("\n\n");
}

function multiplyTransform(m1: number[], m2: number[]): number[] {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
}

async function convertRawImageToBase64(imgData: TImageRawData): Promise<string | null> {
  try {
    const numPixels = imgData.width * imgData.height;
    let channels: 1 | 3 | 4 = 4;

    if (imgData.data.length === numPixels * 3) {
      channels = 3;
    } else if (imgData.data.length === numPixels) {
      channels = 1;
    } else if (imgData.data.length === numPixels * 4) {
      channels = 4;
    }

    const pngBuffer = await sharp(Buffer.from(imgData.data), {
      raw: {
        width: imgData.width,
        height: imgData.height,
        channels,
      },
    })
      .resize({ width: 1000, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();

    return `data:image/png;base64,${pngBuffer.toString("base64")}`;
  } catch (error) {
    pdfLogger.warn({ err: error, operation: "convertRawImage" }, "failed to convert PDF image");

    return null;
  }
}

async function fetchPageImageBase64(
  page: pdfjs.PDFPageProxy,
  imgName: string,
): Promise<string | null> {
  try {
    const rawImg = await new Promise<TImageRawData | null>((resolve) => {
      page.objs.get(imgName, (obj: unknown) => {
        if (obj && typeof obj === "object" && "data" in obj && "width" in obj && "height" in obj) {
          resolve(obj as TImageRawData);
        } else {
          resolve(null);
        }
      });
    });

    if (!rawImg?.data) {
      return null;
    }

    return await convertRawImageToBase64(rawImg);
  } catch (error) {
    pdfLogger.warn({ err: error, operation: "fetchPageImage" }, "failed to fetch PDF page image");

    return null;
  }
}

type TExtractPageImagesOptions = {
  page: pdfjs.PDFPageProxy;
  viewportHeight: number;
  pageNum: number;
  allImagesMap: Record<string, string>;
};

async function extractPageImages({
  page,
  viewportHeight,
  pageNum,
  allImagesMap,
}: TExtractPageImagesOptions): Promise<TContentItem[]> {
  const imageItems: TContentItem[] = [];
  const ops = await page.getOperatorList();
  let currentMatrix = [1, 0, 0, 1, 0, 0];
  const matrixStack: number[][] = [];
  let imgIndex = 1;

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];

    if (fn === pdfjs.OPS.save) {
      matrixStack.push([...currentMatrix]);
      continue;
    }

    if (fn === pdfjs.OPS.restore) {
      currentMatrix = matrixStack.pop() ?? [1, 0, 0, 1, 0, 0];
      continue;
    }

    if (fn === pdfjs.OPS.transform) {
      const transformArgs = ops.argsArray[i] as number[];
      currentMatrix = multiplyTransform(currentMatrix, transformArgs);
      continue;
    }

    if (fn !== pdfjs.OPS.paintImageXObject) {
      continue;
    }

    const imgName = ops.argsArray[i][0] as string;
    const width = Math.abs(currentMatrix[0]);
    const height = Math.abs(currentMatrix[3]);

    if (width < 30 || height < 30) {
      continue;
    }

    const x0 = currentMatrix[4];
    const y0 = Math.max(0, viewportHeight - (currentMatrix[5] + height));

    const b64Uri = await fetchPageImageBase64(page, imgName);
    if (!b64Uri) {
      continue;
    }

    const imgId = `IMAGE_PAGE_${pageNum}_${imgIndex}`;
    allImagesMap[imgId] = b64Uri;

    imageItems.push({
      type: "image",
      y0,
      x0,
      text: `\n\n[HÌNH_ẢNH: ${imgId}]\n\n`,
    });

    imgIndex += 1;
  }

  return imageItems;
}

function groupTextItemsIntoLines(textItemsWithCoords: TTextItemWithCoords[]): TContentItem[] {
  const contentItems: TContentItem[] = [];
  let currentLine: TTextItemWithCoords[] = [];

  for (const item of textItemsWithCoords) {
    if (currentLine.length === 0) {
      currentLine.push(item);
      continue;
    }

    const last = currentLine[currentLine.length - 1];
    if (Math.abs(item.y - last.y) <= 4) {
      currentLine.push(item);
      continue;
    }

    currentLine.sort((a, b) => a.x - b.x);
    const lineStr = currentLine.map((c) => c.str).join(" ");
    contentItems.push({
      type: "text",
      y0: currentLine[0].y,
      x0: currentLine[0].x,
      text: lineStr,
    });
    currentLine = [item];
  }

  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.x - b.x);
    const lineStr = currentLine.map((c) => c.str).join(" ");
    contentItems.push({
      type: "text",
      y0: currentLine[0].y,
      x0: currentLine[0].x,
      text: lineStr,
    });
  }

  return contentItems;
}

export async function extractPdfDocument(pdfBuffer: Buffer): Promise<TPdfExtractionResult> {
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
  });

  const doc = await loadingTask.promise;
  const pagesResult: TPdfExtractedPage[] = [];
  const allImagesMap: Record<string, string> = {};

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();

    const textItemsWithCoords: TTextItemWithCoords[] = [];

    for (const item of textContent.items) {
      if (!("str" in item)) continue;
      const str = item.str.trim();
      if (!str) continue;

      const transform = item.transform;
      const x = transform[4];
      const y = Math.max(0, viewport.height - transform[5]);

      textItemsWithCoords.push({ str, x, y });
    }

    // Group text items into lines (items within 4px vertically)
    textItemsWithCoords.sort((a, b) => (Math.abs(a.y - b.y) > 4 ? a.y - b.y : a.x - b.x));

    const contentItems = groupTextItemsIntoLines(textItemsWithCoords);

    // Extract images for this page
    const imageItems = await extractPageImages({
      page,
      viewportHeight: viewport.height,
      pageNum,
      allImagesMap,
    });
    contentItems.push(...imageItems);

    // Sort items vertically (top-to-bottom, left-to-right)
    contentItems.sort((a, b) => (Math.abs(a.y0 - b.y0) > 4 ? a.y0 - b.y0 : a.x0 - b.x0));

    let rawPageText = "";
    for (const item of contentItems) {
      if (item.type === "text") {
        rawPageText += `\n${item.text}`;
      } else {
        rawPageText += item.text;
      }
    }

    const cleanedText = cleanAndMergeLines(rawPageText);
    pagesResult.push({
      pageNumber: pageNum,
      text: cleanedText,
    });
  }

  const totalCharCount = pagesResult.reduce((sum, page) => sum + page.text.length, 0);
  if (totalCharCount < 100) {
    throw new Error(
      "Tài liệu PDF là dạng ảnh scan hoặc không có lớp văn bản số hóa có thể đọc được. Vui lòng tải lên tệp PDF có lớp văn bản kỹ thuật số.",
    );
  }

  return {
    pages: pagesResult,
    images: allImagesMap,
  };
}
