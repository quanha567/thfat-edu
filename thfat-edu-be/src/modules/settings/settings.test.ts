import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, UnauthorizedError } from "../../middlewares/error-handler";
import { type AuthService } from "../auth/auth.service";
import {
  DEFAULT_EXAM_SETTINGS,
  type TExamSettings,
  type TUpdateExamSettingsInput,
} from "./settings.model";
import { settingsRoutes } from "./settings.routes";
import { type SettingsService } from "./settings.service";

describe("Settings Module (Routes & Access Control)", () => {
  const mockAdminUser = {
    id: "admin-uuid-1",
    email: "admin@thfat.edu.vn",
    fullName: "Admin Quản Trị",
    avatarUrl: null,
    role: "admin" as const,
    isActive: true,
  };

  const mockStudentUser = {
    id: "student-uuid-2",
    email: "student@thfat.edu.vn",
    fullName: "Học Sinh A",
    avatarUrl: null,
    role: "student" as const,
    isActive: true,
  };

  const mockAuthService = {
    getCurrentUser: async (token: string) => {
      if (!token) throw new UnauthorizedError("Unauthorized");
      if (token === "admin-token") return mockAdminUser;
      if (token === "student-token") return mockStudentUser;
      throw new UnauthorizedError("Invalid token");
    },
  } as unknown as AuthService;

  let currentSettings: TExamSettings = { ...DEFAULT_EXAM_SETTINGS };

  const mockSettingsService = {
    getExamSettings: async () => currentSettings,
    updateExamSettings: async (input: TUpdateExamSettingsInput) => {
      currentSettings = { ...input };

      return currentSettings;
    },
  } as unknown as SettingsService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", mockAuthService)
    .decorate("settingsService", mockSettingsService)
    .use(settingsRoutes);

  it("chặn truy cập nếu không có token (401 Unauthorized)", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/admin/settings/exam", {
        method: "GET",
      }),
    );

    expect(res.status).toBe(401);
  });

  it("chặn học sinh truy cập cấu hình thi (403 Forbidden)", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/admin/settings/exam", {
        method: "GET",
        headers: {
          Authorization: "Bearer student-token",
        },
      }),
    );

    expect(res.status).toBe(403);
  });

  it("cho phép admin lấy cấu hình thi mặc định (200 OK)", async () => {
    const res = await testApp.handle(
      new Request("http://localhost/admin/settings/exam", {
        method: "GET",
        headers: {
          Authorization: "Bearer admin-token",
        },
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.maxAttempts).toBe(1);
    expect(data.scorePolicy).toBe("highest");
    expect(data.cooldownMinutes).toBe(0);
    expect(data.showScoreImmediately).toBe(true);
    expect(data.showExplanationPolicy).toBe("immediately");
  });

  it("cho phép admin cập nhật cấu hình thi mới (200 OK)", async () => {
    const newConfig: TUpdateExamSettingsInput = {
      maxAttempts: 3,
      scorePolicy: "latest",
      cooldownMinutes: 15,
      showScoreImmediately: true,
      showExplanationPolicy: "never",
    };

    const res = await testApp.handle(
      new Request("http://localhost/admin/settings/exam", {
        method: "PUT",
        headers: {
          Authorization: "Bearer admin-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConfig),
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.maxAttempts).toBe(3);
    expect(data.scorePolicy).toBe("latest");
    expect(data.cooldownMinutes).toBe(15);
    expect(data.showExplanationPolicy).toBe("never");
  });
});
