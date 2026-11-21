import { Elysia } from "elysia";

import { ForbiddenError, UnauthorizedError } from "../../middlewares/error-handler";
import { extractSessionToken, SESSION_COOKIE_NAME } from "../auth/auth.cookie";
import { authService } from "../auth/auth.service";
import { DashboardAnalyticsQuerySchema, DashboardAnalyticsResponseSchema } from "./analytics.model";
import { AnalyticsService } from "./analytics.service";

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
  .decorate("analyticsService", new AnalyticsService())
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
      throw new UnauthorizedError("Bạn cần đăng nhập để truy cập dữ liệu thống kê.");
    }

    const currentAuthService = activeAuthService ?? authService;
    const currentUser = await currentAuthService.getCurrentUser(token);

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "teacher")) {
      throw new ForbiddenError("Bạn không có quyền truy cập dữ liệu thống kê này.");
    }

    return { currentUser, sessionToken: token };
  })
  .get(
    "/dashboard",
    async ({ analyticsService: service, currentUser, query }) => {
      const teacherId = currentUser.role === "teacher" ? currentUser.id : null;

      return service.getDashboardAnalytics({
        timeRange: query.timeRange,
        teacherId,
      });
    },
    {
      query: DashboardAnalyticsQuerySchema,
      response: DashboardAnalyticsResponseSchema,
      detail: {
        tags: ["Analytics"],
        summary: "Thống kê tổng quan vận hành khảo thí cho Admin/Teacher Dashboard",
      },
    },
  );
