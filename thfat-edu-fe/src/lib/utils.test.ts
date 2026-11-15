import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("px-2 py-1", "bg-red-500");

    expect(result).toBe("px-2 py-1 bg-red-500");
  });

  it("handles conditional classes", () => {
    const isLarge = Boolean(false);
    const result = cn("text-base", isLarge && "text-lg", "font-bold");

    expect(result).toBe("text-base font-bold");
  });
});
