import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, ForbiddenError } from "../../middlewares/error-handler";
import { authRoutes } from "./auth.routes";
import { type AuthService } from "./auth.service";

describe("Auth Module (Routes & HTTP Contract)", () => {
  const mockAuthService = {
    login: async ({ idToken }: { idToken: string }) => {
      if (idToken.includes("unauthorized_stranger")) {
        throw new ForbiddenError(
          "Tài khoản chưa được cấp phép trong hệ thống. Vui lòng liên hệ quản trị viên.",
        );
      }

      return {
        user: {
          id: "mock-user-123",
          email: "student@thfat.edu.vn",
          fullName: "Em Học Sinh",
          avatarUrl: null,
          role: "student" as const,
          isActive: true,
          studentProfile: null,
          teacherProfile: null,
        },
        sessionToken: "mock-session-token-xyz",
      };
    },
    getCurrentUser: async (token: string) => {
      if (!token || token === "invalid") {
        throw new ForbiddenError("Không tìm thấy phiên đăng nhập.");
      }

      return {
        id: "mock-user-123",
        email: "student@thfat.edu.vn",
        fullName: "Em Học Sinh",
        avatarUrl: null,
        role: "student" as const,
        isActive: true,
        studentProfile: null,
        teacherProfile: null,
      };
    },
    logout: async () => {},
  } as unknown as AuthService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", mockAuthService)
    .use(authRoutes);

  it("should return 401 for GET /auth/me when unauthenticated", async () => {
    const response = await testApp.handle(new Request("http://localhost/auth/me"));
    expect(response.status).toBe(403);

    const body = (await response.json()) as { status: number; detail: string };
    expect(body.status).toBe(403);
    expect(body.detail).toContain("Không tìm thấy phiên đăng nhập");
  });

  it("should return 403 Forbidden when email is not whitelisted", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: "mock-token:unauthorized_stranger@example.com" }),
      }),
    );

    expect(response.status).toBe(403);
    const body = (await response.json()) as { status: number; detail: string };
    expect(body.status).toBe(403);
    expect(body.detail).toContain("Tài khoản chưa được cấp phép trong hệ thống");
  });

  it("should return 200 and set-cookie when login is successful", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: "mock-token:student@thfat.edu.vn" }),
      }),
    );

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("session_token=mock-session-token-xyz");

    const body = (await response.json()) as { user: { email: string } };
    expect(body.user.email).toBe("student@thfat.edu.vn");
  });

  it("should return 200 on POST /auth/logout", async () => {
    const response = await testApp.handle(
      new Request("http://localhost/auth/logout", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { message: string };
    expect(body.message).toBe("Đăng xuất thành công");
  });
});
