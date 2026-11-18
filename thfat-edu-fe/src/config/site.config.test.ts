import { describe, expect, it } from "vitest";

import { siteConfig } from "./site.config";

describe("siteConfig", () => {
  it("exports valid metadata configuration object", () => {
    expect(siteConfig.name).toBe("TH FAT EDU");
    expect(siteConfig.titleTemplate).toBe("%s | TH FAT EDU");
    expect(siteConfig.defaultTitle).toContain("TH FAT EDU");
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
    expect(siteConfig.keywords.length).toBeGreaterThan(0);
    expect(siteConfig.author.name).toBe("ThFat Edu Team");
  });

  it("resolves default fallback URL when environment variable is unset", () => {
    expect(siteConfig.url).toBe("https://thfat-edu.vercel.app");
  });
});
