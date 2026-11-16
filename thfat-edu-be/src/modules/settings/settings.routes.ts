import { Elysia } from "elysia";

import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { extractSessionToken, SESSION_COOKIE_NAME } from "../auth/auth.cookie";
import { authService } from "../auth/auth.service";
import {
  ExamSettingsSchema,
  UpdateExamSettingsSchema,
} from "./settings.model";
import { SettingsService } from "./settings.service";

export const settingsRoutes = new Elysia({ prefix: "/admin/settings" })
  .decorate("settingsService", new SettingsService())
  .decorate("authService", authService)
  .derive(async ({ cookie, request, authService: activeAuthService }) => {
    let token = extractSessionToken(cookie[SESSION_COOKIE_NAME]?.value);
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim();
      }
    }

    if (!token) {
      throw new UnauthorizedError("Bạn cần đăng nhập để thực hiện thao tác này.");
    }

    const currentAuthService = activeAuthService ?? authService;
    const currentUser = await currentAuthService.getCurrentUser(token);
    if (!currentUser || currentUser.role !== "admin") {
      throw new ForbiddenError("Chỉ quản trị viên mới có quyền truy cập chức năng này.");
    }

    return { currentUser, sessionToken: token };
  })
  .get(
    "/exam",
    async ({ settingsService }) => {
      return settingsService.getExamSettings();
    },
    {
      response: ExamSettingsSchema,
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
      response: ExamSettingsSchema,
      detail: {
        tags: ["Admin - Settings"],
        summary: "Cập nhật cấu hình quy chế khảo thí mặc định",
      },
    },
  );
