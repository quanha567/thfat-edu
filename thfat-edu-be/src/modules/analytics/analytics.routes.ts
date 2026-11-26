import { Elysia } from "elysia";

import { requireAuth } from "../auth/auth.guard";
import { authService } from "../auth/auth.service";
import { DashboardAnalyticsQuerySchema, DashboardAnalyticsResponseSchema } from "./analytics.model";
import { AnalyticsService } from "./analytics.service";

export const analyticsRoutes = new Elysia({ prefix: "/analytics" })
  .decorate("analyticsService", new AnalyticsService())
  .decorate("authService", authService)
  .use(
    requireAuth({
      roles: ["admin", "teacher"],
      unauthorizedMessage: "Bạn cần đăng nhập để truy cập dữ liệu thống kê.",
      forbiddenMessage: "Bạn không có quyền truy cập dữ liệu thống kê này.",
    }),
  )
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
