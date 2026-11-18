import { describe, expect, it } from "vitest";

import { HOME_FOOTER_LINKS, HOME_NAV_LINKS } from "@/features/home/constants/home.data";
import { ResourcesDropdown } from "./resources-dropdown";

describe("Navigation Configuration & ResourcesDropdown", () => {
  it("removes 'Giới thiệu' from HOME_NAV_LINKS", () => {
    const hasAbout = HOME_NAV_LINKS.some((item) => item.label.toLowerCase().includes("giới thiệu"));
    expect(hasAbout).toBe(false);
  });

  it("configures 'Tài nguyên' with isResourceDropdown: true in HOME_NAV_LINKS", () => {
    const resourceItem = HOME_NAV_LINKS.find((item) => item.label === "Tài nguyên");
    expect(resourceItem).toBeDefined();
    expect(resourceItem?.isResourceDropdown).toBe(true);
    expect(resourceItem?.href).toBe("/articles");
  });

  it("removes 'Giới thiệu' from HOME_FOOTER_LINKS", () => {
    const hasAbout = HOME_FOOTER_LINKS.some((item) => item.label.toLowerCase().includes("giới thiệu"));
    expect(hasAbout).toBe(false);
  });

  it("exports ResourcesDropdown component", () => {
    expect(typeof ResourcesDropdown).toBe("function");
  });
});
