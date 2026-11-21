import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  BaseAvatar,
  DEFAULT_BOY_AVATARS,
  DEFAULT_GIRL_AVATARS,
  getAvatarGradient,
  getDefaultAvatar,
  getInitials,
} from "./base-avatar";

describe("base-avatar utilities", () => {
  it("returns male avatar when gender is male", () => {
    const avatar = getDefaultAvatar("Nguyễn Văn A", "male");
    expect(avatar).not.toBeNull();
    expect(DEFAULT_BOY_AVATARS).toContain(avatar);
  });

  it("returns female avatar when gender is female", () => {
    const avatar = getDefaultAvatar("Trần Thị B", "female");
    expect(avatar).not.toBeNull();
    expect(DEFAULT_GIRL_AVATARS).toContain(avatar);
  });

  it("returns null when gender is null or undefined or other", () => {
    expect(getDefaultAvatar("Nguyễn Văn A", null)).toBeNull();
    expect(getDefaultAvatar("Trần Thị B", undefined)).toBeNull();
    expect(getDefaultAvatar("Lê C", "other")).toBeNull();
  });

  it("computes initials accurately", () => {
    expect(getInitials("Nguyễn Văn A")).toBe("NA");
    expect(getInitials("Trần")).toBe("TR");
    expect(getInitials("")).toBe("TF");
  });

  it("computes gradient consistently", () => {
    const g1 = getAvatarGradient("Nguyễn Văn A");
    const g2 = getAvatarGradient("Nguyễn Văn A");
    expect(g1).toBe(g2);
  });

  it("renders text initials fallback when no custom avatar and no gender", () => {
    const html = renderToStaticMarkup(<BaseAvatar name="Nguyễn Văn A" />);
    expect(html).toContain("NA");
  });

  it("selects correct default avatar by gender", () => {
    const maleAvatar = getDefaultAvatar("Nguyễn Văn A", "male");
    expect(maleAvatar).toMatch(/\/images\/avatars\/avatar-boy-\d\.jpg/);

    const femaleAvatar = getDefaultAvatar("Trần Thị B", "female");
    expect(femaleAvatar).toMatch(/\/images\/avatars\/avatar-girl-\d\.jpg/);
  });
});
