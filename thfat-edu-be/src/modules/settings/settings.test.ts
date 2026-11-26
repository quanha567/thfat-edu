import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, UnauthorizedError } from "../../middlewares/error-handler";
import { type AuthService } from "../auth/auth.service";
import {
  DEFAULT_EXAM_SETTINGS,
  DEFAULT_SITE_INFO,
  type TExamSettings,
  type TSiteInfo,
  type TUpdateExamSettingsInput,
} from "./settings.model";
import { settingsRoutes, siteInfoRoutes } from "./settings.routes";
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
  let currentSiteInfo: TSiteInfo = { ...DEFAULT_SITE_INFO };

  const nullMeta = { updatedAt: null, updatedByName: null };

  const mockSettingsService = {
    getExamSettings: async () => currentSettings,
    getExamSettingsWithMeta: async () => ({ ...currentSettings, ...nullMeta }),
    updateExamSettings: async (input: TUpdateExamSettingsInput) => {
      currentSettings = { ...input };

      return { ...currentSettings, ...nullMeta };
    },
    getSiteInfo: async () => currentSiteInfo,
    getSiteInfoWithMeta: async () => ({ ...currentSiteInfo, ...nullMeta }),
    updateSiteInfo: async (input: TSiteInfo) => {
      currentSiteInfo = { ...input };

      return { ...currentSiteInfo, ...nullMeta };
    },
  } as unknown as SettingsService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("authService", mockAuthService)
    .decorate("settingsService", mockSettingsService)
    .use(settingsRoutes)
    .use(siteInfoRoutes);

  const validSiteInfo: TSiteInfo = {
    ...DEFAULT_SITE_INFO,
    siteName: "ThFat Edu",
    contactEmail: "contact@thfat.edu.vn",
    facebookUrl: "https://facebook.com/thfat",
    zaloUrl: "https://zalo.me/0123456789",
  };

  function putSite(body: unknown, token = "admin-token") {
    return testApp.handle(
      new Request("http://localhost/admin/settings/site", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  }

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

  it("trả thông tin site công khai cho khách không đăng nhập (200 OK)", async () => {
    const res = await testApp.handle(new Request("http://localhost/site-info"));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.siteName).toBe("ThFat Edu");
    expect(data.facebookUrl).toBe("");
    expect(data.updatedAt).toBeUndefined();
  });

  it("chặn học sinh sửa thông tin site (403 Forbidden)", async () => {
    const res = await putSite(validSiteInfo, "student-token");

    expect(res.status).toBe(403);
  });

  it("cho phép admin cập nhật thông tin site (200 OK)", async () => {
    const res = await putSite(validSiteInfo);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.contactEmail).toBe("contact@thfat.edu.vn");
    expect(data.zaloUrl).toBe("https://zalo.me/0123456789");
  });

  it("từ chối link không phải http(s) (422)", async () => {
    const res = await putSite({ ...validSiteInfo, facebookUrl: "javascript:alert(1)" });

    expect(res.status).toBe(422);
  });

  it("từ chối email sai định dạng và tên site rỗng (422)", async () => {
    const badEmail = await putSite({ ...validSiteInfo, contactEmail: "khong-phai-email" });
    const emptyName = await putSite({ ...validSiteInfo, siteName: "" });

    expect(badEmail.status).toBe(422);
    expect(emptyName.status).toBe(422);
  });
});
