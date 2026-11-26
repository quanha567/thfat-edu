import { Elysia } from "elysia";

import { requireAuth } from "../auth/auth.guard";
import { authService } from "../auth/auth.service";
import {
  ExamSettingsResponseSchema,
  SiteInfoResponseSchema,
  SiteInfoSchema,
  UpdateExamSettingsSchema,
  UpdateSiteInfoSchema,
} from "./settings.model";
import { SettingsService } from "./settings.service";

const sharedSettingsService = new SettingsService();

export const siteInfoRoutes = new Elysia({ prefix: "/site-info" })
  .decorate("settingsService", sharedSettingsService)
  .get(
    "/",
    async ({ settingsService }) => {
      return settingsService.getSiteInfo();
    },
    {
      response: SiteInfoSchema,
      detail: {
        tags: ["Site Info"],
        summary: "Lấy thông tin site hiển thị công khai (chân trang)",
      },
    },
  );

export const settingsRoutes = new Elysia({ prefix: "/admin/settings" })
  .decorate("settingsService", sharedSettingsService)
  .decorate("authService", authService)
  .use(
    requireAuth({
      roles: ["admin"],
      forbiddenMessage: "Chỉ quản trị viên mới có quyền truy cập chức năng này.",
    }),
  )
  .get(
    "/exam",
    async ({ settingsService }) => {
      return settingsService.getExamSettingsWithMeta();
    },
    {
      response: ExamSettingsResponseSchema,
      detail: {
        tags: ["Admin - Settings"],
        summary: "Lấy cấu hình quy chế khảo thí mặc định",
      },
    },
  )
  .put(
    "/exam",
    async ({ settingsService, body, currentUser }) => {
      return settingsService.updateExamSettings(body, currentUser.id);
    },
    {
      body: UpdateExamSettingsSchema,
      response: ExamSettingsResponseSchema,
      detail: {
        tags: ["Admin - Settings"],
        summary: "Cập nhật cấu hình quy chế khảo thí mặc định",
      },
    },
  )
  .get(
    "/site",
    async ({ settingsService }) => {
      return settingsService.getSiteInfoWithMeta();
    },
    {
      response: SiteInfoResponseSchema,
      detail: {
        tags: ["Admin - Settings"],
        summary: "Lấy thông tin site",
      },
    },
  )
  .put(
    "/site",
    async ({ settingsService, body, currentUser }) => {
      return settingsService.updateSiteInfo(body, currentUser.id);
    },
    {
      body: UpdateSiteInfoSchema,
      response: SiteInfoResponseSchema,
      detail: {
        tags: ["Admin - Settings"],
        summary: "Cập nhật thông tin site",
      },
    },
  );
