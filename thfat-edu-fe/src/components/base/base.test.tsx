import { describe, expect, it } from "vitest";

import { getAvatarGradient, getInitials, type TSegmentedOption, type TSelectOption } from "./index";

describe("Base UI Components Types & Helpers", () => {
  it("computes initials correctly for various names", () => {
    expect(getInitials("Summer")).toBe("SU");
    expect(getInitials("Nguyễn Văn A")).toBe("NA");
    expect(getInitials("Võ Nam")).toBe("VN");
    expect(getInitials("")).toBe("TF");
    expect(getInitials(undefined)).toBe("TF");
  });

  it("returns deterministic gradient for avatar names", () => {
    const grad1 = getAvatarGradient("Summer");
    const grad2 = getAvatarGradient("Summer");
    expect(grad1).toBe(grad2);
    expect(grad1).toContain("from-");
  });

  it("validates select options structure", () => {
    const options: TSelectOption[] = [
      { label: "Lớp 10", value: "10" },
      { label: "Lớp 11", value: "11" },
      { label: "Lớp 12", value: "12" },
    ];

    expect(options).toHaveLength(3);
    expect(options[0]?.value).toBe("10");
  });

  it("validates segmented options structure", () => {
    const segments: TSegmentedOption[] = [
      { label: "Học sinh", value: "student" },
      { label: "Giáo viên", value: "teacher" },
    ];

    expect(segments).toHaveLength(2);
    expect(segments[1]?.value).toBe("teacher");
  });
});
