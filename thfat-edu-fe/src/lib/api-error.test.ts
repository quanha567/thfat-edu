import { describe, expect, it } from "vitest";

import { extractApiErrorMessage } from "./api-error";

describe("extractApiErrorMessage", () => {
  it("returns fallback when error is falsy", () => {
    expect(extractApiErrorMessage(null, "Default error")).toBe("Default error");
    expect(extractApiErrorMessage(undefined, "Default error")).toBe("Default error");
  });

  it("returns string directly when error is a string", () => {
    expect(extractApiErrorMessage("Lỗi kết nối mạng")).toBe("Lỗi kết nối mạng");
  });

  it("extracts message from Error instance", () => {
    expect(extractApiErrorMessage(new Error("Lỗi xác thực"))).toBe("Lỗi xác thực");
  });

  it("extracts detail from ProblemDetails object", () => {
    const problem = {
      type: "https://api.example.com/errors/not-found",
      title: "Not Found",
      status: 404,
      detail: "Không tìm thấy người dùng",
    };

    expect(extractApiErrorMessage(problem)).toBe("Không tìm thấy người dùng");
  });

  it("extracts detail from nested Eden Treaty error value", () => {
    const edenError = {
      status: 403,
      value: {
        detail: "Tài khoản chưa được kích hoạt",
      },
    };

    expect(extractApiErrorMessage(edenError)).toBe("Tài khoản chưa được kích hoạt");
  });

  it("extracts message from nested Eden Treaty error value", () => {
    const edenError = {
      status: 400,
      value: {
        message: "Dữ liệu không hợp lệ",
      },
    };

    expect(extractApiErrorMessage(edenError)).toBe("Dữ liệu không hợp lệ");
  });
});
