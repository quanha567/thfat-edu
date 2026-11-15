import { describe, expect, it } from "vitest";

import { type TSelectOption, type TSegmentedOption } from "./index";

describe("Base UI Components Types & Helpers", () => {
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
