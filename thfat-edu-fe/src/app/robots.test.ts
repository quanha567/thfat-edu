import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots route handler", () => {
  it("returns correct crawler rules and sitemap URL", () => {
    const config = robots();

    expect(config.sitemap).toContain("/sitemap.xml");
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toEqual(
      expect.arrayContaining([
        "/admin/",
        "/admin/*",
        "/login",
        "/exams/*/room",
        "/exams/*/result",
        "/api/",
      ]),
    );
  });
});
