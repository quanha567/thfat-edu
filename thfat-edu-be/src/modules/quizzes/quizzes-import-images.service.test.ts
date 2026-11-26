import { describe, expect, it } from "bun:test";

import { extractFirstMarkdownImageUrl } from "../../services/ai/nvidia-nim.service";
import { dataUriToFile, embedImageInContext } from "./quizzes-import-images.service";

describe("embedImageInContext", () => {
  it("appends the image to the markdown context and clears imageUrl", () => {
    const result = embedImageInContext({
      contextContent: "Cho hình sau:",
      imageUrl: "https://ik.imagekit.io/x/a.png",
    });

    expect(result.imageUrl).toBeNull();
    expect(result.contextContent).toBe(
      "Cho hình sau:\n\n![hình minh họa](https://ik.imagekit.io/x/a.png)",
    );
  });

  it("does not add a leading gap when the context is empty", () => {
    const result = embedImageInContext({ contextContent: "", imageUrl: "https://x/a.png" });

    expect(result.contextContent).toBe("![hình minh họa](https://x/a.png)");
  });

  it("leaves content untouched and nulls imageUrl when there is no image", () => {
    const result = embedImageInContext({ contextContent: "Câu 1", imageUrl: null });

    expect(result).toEqual({ contextContent: "Câu 1", imageUrl: null });
  });
});

describe("dataUriToFile", () => {
  it("decodes a base64 png data URI", () => {
    const file = dataUriToFile("data:image/png;base64,aGVsbG8=", "q-1");

    expect(file?.type).toBe("image/png");
    expect(file?.size).toBe(5);
  });

  it("returns null for non-data URIs", () => {
    expect(dataUriToFile("https://x/a.png", "q-1")).toBeNull();
  });
});

describe("extractFirstMarkdownImageUrl", () => {
  it("returns the first embedded image url", () => {
    expect(extractFirstMarkdownImageUrl("a ![x](https://h/1.png) b ![y](https://h/2.png)")).toBe(
      "https://h/1.png",
    );
  });

  it("returns null when there is no image", () => {
    expect(extractFirstMarkdownImageUrl("plain text")).toBeNull();
  });
});
