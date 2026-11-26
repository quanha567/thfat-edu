import { describe, expect, it } from "vitest";

import { type TQuizQuestion } from "../types";
import { embedLegacyImage, getLegacyImageUrl } from "./question-images";

const base: TQuizQuestion = { orderIndex: 1, contextContent: "Cho hình:", subItems: [] };

describe("question-images", () => {
  it("moves a legacy imageUrl into the markdown content", () => {
    const result = embedLegacyImage({ ...base, imageUrl: "https://x/a.png" });

    expect(result.imageUrl).toBeNull();
    expect(result.contextContent).toBe("Cho hình:\n\n![hình minh họa](https://x/a.png)");
  });

  it("does not duplicate an image already embedded in the content", () => {
    const question = {
      ...base,
      contextContent: "![a](https://x/a.png)",
      imageUrl: "https://x/a.png",
    };

    expect(getLegacyImageUrl(question)).toBeNull();
    expect(embedLegacyImage(question).contextContent).toBe("![a](https://x/a.png)");
  });

  it("returns the same question when there is no image", () => {
    expect(embedLegacyImage(base)).toBe(base);
  });
});
