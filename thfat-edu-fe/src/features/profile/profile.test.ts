import { assert, describe, expect, it } from "vitest";

import { profileSchema } from "./schemas/profile.schema";

describe("profileSchema", () => {
  it("validates valid basic profile input", () => {
    const result = profileSchema.safeParse({
      fullName: "Nguyễn Văn A",
      avatarUrl: "https://example.com/avatar.png",
      studentCode: "HS001",
      grade: "12A1",
    });

    assert(result.success);
    expect(result.data.fullName).toBe("Nguyễn Văn A");
    expect(result.data.avatarUrl).toBe("https://example.com/avatar.png");
  });

  it("converts empty avatar string to null", () => {
    const result = profileSchema.safeParse({
      fullName: "Nguyễn Văn B",
      avatarUrl: "",
    });

    assert(result.success);
    expect(result.data.avatarUrl).toBeNull();
  });

  it("rejects empty fullName", () => {
    const result = profileSchema.safeParse({
      fullName: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid gender values", () => {
    const maleResult = profileSchema.safeParse({
      fullName: "Nguyễn Văn Nam",
      avatarUrl: "",
      gender: "male",
    });
    assert(maleResult.success);
    expect(maleResult.data.gender).toBe("male");

    const femaleResult = profileSchema.safeParse({
      fullName: "Trần Thị Nữ",
      avatarUrl: "",
      gender: "female",
    });
    assert(femaleResult.success);
    expect(femaleResult.data.gender).toBe("female");

    const nullResult = profileSchema.safeParse({
      fullName: "Ẩn Danh",
      avatarUrl: "",
      gender: null,
    });
    assert(nullResult.success);
    expect(nullResult.data.gender).toBeNull();
  });

  it("rejects invalid avatarUrl format", () => {
    const result = profileSchema.safeParse({
      fullName: "Nguyễn Văn C",
      avatarUrl: "not-a-valid-url",
    });

    expect(result.success).toBe(false);
  });
});
