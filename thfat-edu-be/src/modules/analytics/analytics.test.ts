import { describe, expect, it } from "bun:test";

import { Elysia } from "elysia";

import { errorHandlerPlugin, UnauthorizedError } from "../../middlewares/error-handler";
import { type AuthService } from "../auth/auth.service";
import { type TDashboardAnalyticsResponse } from "./analytics.model";
import { analyticsRoutes } from "./analytics.routes";
import { AnalyticsService } from "./analytics.service";

describe("Analytics Module - Unit & Routes", () => {
  const service = new AnalyticsService();

  describe("calculateTimeWindows helper", () => {
    it("calculates 'today' window starting at 00:00:00", () => {
      const windows = service.calculateTimeWindows("today");
      expect(windows.currentStart).not.toBeNull();
      expect(windows.previousStart).not.toBeNull();
      expect(windows.previousEnd).not.toBeNull();

      if (windows.currentStart) {
        expect(windows.currentStart.getHours()).toBe(0);
        expect(windows.currentStart.getMinutes()).toBe(0);
      }
    });

    it("calculates '7d' and '30d' windows accurately", () => {
      const win7d = service.calculateTimeWindows("7d");
      expect(win7d.currentStart).not.toBeNull();
      expect(win7d.previousStart).not.toBeNull();

      if (win7d.currentStart) {
        const diff7d = win7d.currentEnd.getTime() - win7d.currentStart.getTime();
        expect(Math.round(diff7d / (24 * 60 * 60 * 1000))).toBe(7);
      }

      const win30d = service.calculateTimeWindows("30d");
      if (win30d.currentStart) {
        const diff30d = win30d.currentEnd.getTime() - win30d.currentStart.getTime();
        expect(Math.round(diff30d / (24 * 60 * 60 * 1000))).toBe(30);
      }
    });

    it("calculates 'all' window with null start bounds", () => {
      const winAll = service.calculateTimeWindows("all");
      expect(winAll.currentStart).toBeNull();
      expect(winAll.previousStart).toBeNull();
    });
  });

  describe("Routes & Access Control", () => {
    const mockAdminUser = {
      id: "admin-uuid",
      email: "admin@thfat.edu.vn",
      fullName: "Admin Tổng",
      avatarUrl: null,
      role: "admin" as const,
      isActive: true,
      studentProfile: null,
      teacherProfile: null,
    };

    const mockTeacherUser = {
      id: "teacher-uuid",
      email: "teacher@thfat.edu.vn",
      fullName: "Giáo viên Hóa",
      avatarUrl: null,
      role: "teacher" as const,
      isActive: true,
      studentProfile: null,
      teacherProfile: null,
    };

    const mockStudentUser = {
      id: "student-uuid",
      email: "student@thfat.edu.vn",
      fullName: "Học sinh",
      avatarUrl: null,
      role: "student" as const,
      isActive: true,
      studentProfile: null,
      teacherProfile: null,
    };

    const mockAuthService = {
      getCurrentUser: async (token: string) => {
        if (!token) throw new UnauthorizedError("Unauthorized");
        if (token === "admin-token") return mockAdminUser;
        if (token === "teacher-token") return mockTeacherUser;
        if (token === "student-token") return mockStudentUser;
        throw new UnauthorizedError("Invalid token");
      },
    } as unknown as AuthService;

    const mockAnalyticsResponse: TDashboardAnalyticsResponse = {
      kpi: {
        totalAttempts: {
          value: 120,
          previousValue: 100,
          changePercentage: 20,
          subText: "110 lượt nộp thành công",
        },
        completionRate: {
          value: 91.7,
          previousValue: 88.0,
          changePercentage: 4.2,
          subText: "Tỷ lệ nộp bài so với bắt đầu",
        },
        averageScore: {
          value: 7.8,
          previousValue: 7.2,
          changePercentage: 8.3,
          subText: "Thang điểm 10 quy chuẩn",
        },
        activeCandidates: {
          value: 85,
          previousValue: 70,
          changePercentage: 21.4,
          subText: "Học viên duy nhất tham gia",
        },
      },
      trends: [
        {
          date: "2026-11-20",
          label: "20/11",
          startedCount: 15,
          submittedCount: 14,
        },
      ],
      scoreDistribution: [
        {
          tier: "gioi",
          label: "Giỏi & Xuất sắc",
          rangeLabel: "8.0 - 10đ",
          count: 35,
          percentage: 31.8,
        },
      ],
      recentAttempts: [
        {
          id: "att-1",
          quizId: "quiz-1",
          quizTitle: "Đề thi thử Hóa THPT 2026",
          studentId: "student-1",
          studentName: "Nguyễn Văn A",
          studentEmail: "a@thfat.edu.vn",
          studentAvatar: null,
          status: "submitted",
          score: 8.5,
          totalPoints: 10,
          normalizedScore: 8.5,
          startedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
        },
      ],
      topExams: [
        {
          quizId: "quiz-1",
          title: "Đề thi thử Hóa THPT 2026",
          durationMinutes: 50,
          totalAttempts: 120,
          submittedAttempts: 110,
          completionRate: 91.7,
          averageScore: 7.8,
        },
      ],
      timeRange: "7d",
      updatedAt: new Date().toISOString(),
    };

    const mockAnalyticsService = {
      getDashboardAnalytics: async () => mockAnalyticsResponse,
    } as unknown as AnalyticsService;

    const testApp = new Elysia()
      .use(errorHandlerPlugin)
      .decorate("authService", mockAuthService)
      .decorate("analyticsService", mockAnalyticsService)
      .use(analyticsRoutes);

    it("rejects unauthenticated request with 401 Unauthorized", async () => {
      const res = await testApp.handle(new Request("http://localhost/analytics/dashboard"));
      expect(res.status).toBe(401);
    });

    it("rejects student role with 403 Forbidden", async () => {
      const res = await testApp.handle(
        new Request("http://localhost/analytics/dashboard", {
          headers: { Authorization: "Bearer student-token" },
        }),
      );
      expect(res.status).toBe(403);
    });

    it("allows admin to retrieve dashboard analytics", async () => {
      const res = await testApp.handle(
        new Request("http://localhost/analytics/dashboard?timeRange=7d", {
          headers: { Authorization: "Bearer admin-token" },
        }),
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.kpi.totalAttempts.value).toBe(120);
      expect(data.trends.length).toBe(1);
      expect(data.topExams[0].title).toBe("Đề thi thử Hóa THPT 2026");
    });

    it("allows teacher to retrieve dashboard analytics", async () => {
      const res = await testApp.handle(
        new Request("http://localhost/analytics/dashboard?timeRange=30d", {
          headers: { Authorization: "Bearer teacher-token" },
        }),
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.timeRange).toBe("7d");
    });
  });
});
