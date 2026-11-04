import { describe, expect, it } from "vitest";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

describe("Auth Feature Validation & Rules", () => {
  it("rejects invalid email formats", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects passwords shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "valid@thfat.edu.vn",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "student@thfat.edu.vn",
      password: "secure_password",
    });

    expect(result.success).toBe(true);
  });
});
