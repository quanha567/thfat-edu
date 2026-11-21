import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

import { type Database, db } from "../../db";
import { examAttempts, quizzes, users } from "../../db/schema";
import {
  type TAnalyticsTimeRange,
  type TDashboardAnalyticsResponse,
  type TMetricCard,
  type TRecentAttempt,
  type TScoreTier,
  type TTopExam,
  type TTrendPoint,
} from "./analytics.model";

export type TAnalyticsFilterOptions = {
  timeRange?: TAnalyticsTimeRange;
  teacherId?: string | null;
};

type TTimeWindows = {
  currentStart: Date | null;
  currentEnd: Date;
  previousStart: Date | null;
  previousEnd: Date | null;
};

export class AnalyticsService {
  private readonly database: Database;

  public constructor(database: Database = db) {
    this.database = database;
  }

  public calculateTimeWindows(timeRange: TAnalyticsTimeRange): TTimeWindows {
    const now = new Date();

    if (timeRange === "today") {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      return {
        currentStart: todayStart,
        currentEnd: now,
        previousStart: yesterdayStart,
        previousEnd: todayStart,
      };
    }

    if (timeRange === "7d") {
      const currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      return {
        currentStart,
        currentEnd: now,
        previousStart,
        previousEnd: currentStart,
      };
    }

    if (timeRange === "30d") {
      const currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const previousStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      return {
        currentStart,
        currentEnd: now,
        previousStart,
        previousEnd: currentStart,
      };
    }

    return {
      currentStart: null,
      currentEnd: now,
      previousStart: null,
      previousEnd: null,
    };
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    const change = ((current - previous) / previous) * 100;

    return Math.round(change * 10) / 10;
  }

  public async getDashboardAnalytics(
    options: TAnalyticsFilterOptions = {},
  ): Promise<TDashboardAnalyticsResponse> {
    const timeRange = options.timeRange ?? "7d";
    const windows = this.calculateTimeWindows(timeRange);

    const teacherQuizFilter = options.teacherId
      ? inArray(
          examAttempts.quizId,
          this.database
            .select({ id: quizzes.id })
            .from(quizzes)
            .where(eq(quizzes.createdBy, options.teacherId)),
        )
      : undefined;

    const currentPeriodCondition = windows.currentStart
      ? and(gte(examAttempts.startedAt, windows.currentStart), teacherQuizFilter)
      : teacherQuizFilter;

    const previousPeriodCondition =
      windows.previousStart && windows.previousEnd
        ? and(
            gte(examAttempts.startedAt, windows.previousStart),
            lt(examAttempts.startedAt, windows.previousEnd),
            teacherQuizFilter,
          )
        : null;

    const [trends, scoreDistribution, recentAttempts, topExams] = await Promise.all([
      this.fetchTrends(timeRange, windows, teacherQuizFilter),
      this.fetchScoreDistribution(currentPeriodCondition),
      this.fetchRecentAttempts(teacherQuizFilter),
      this.fetchTopExams(currentPeriodCondition, teacherQuizFilter),
    ]);

    const kpiMetrics = await this.fetchKpiMetrics(
      currentPeriodCondition,
      previousPeriodCondition,
      trends,
    );

    return {
      kpi: kpiMetrics,
      trends,
      scoreDistribution,
      recentAttempts,
      topExams,
      timeRange,
      updatedAt: new Date().toISOString(),
    };
  }

  private async fetchKpiMetrics(
    currentCondition: ReturnType<typeof and> | ReturnType<typeof inArray> | undefined,
    previousCondition: ReturnType<typeof and> | null,
    trends: TTrendPoint[] = [],
  ): Promise<TDashboardAnalyticsResponse["kpi"]> {
    const [currentStats] = await this.database
      .select({
        totalAttempts: sql<number>`count(${examAttempts.id})::int`,
        submittedAttempts: sql<number>`count(case when ${examAttempts.status} = 'submitted' then 1 end)::int`,
        averageScore: sql<number>`coalesce(avg(case when ${examAttempts.status} = 'submitted' and ${quizzes.totalPoints} > 0 then (${examAttempts.score}::numeric / ${quizzes.totalPoints}::numeric) * 10 else null end), 0)::float`,
        activeCandidates: sql<number>`count(distinct ${examAttempts.userId})::int`,
      })
      .from(examAttempts)
      .innerJoin(quizzes, eq(examAttempts.quizId, quizzes.id))
      .where(currentCondition);

    let prevTotal = 0;
    let prevSubmitted = 0;
    let prevAvgScore = 0;
    let prevCandidates = 0;

    if (previousCondition) {
      const [prevStats] = await this.database
        .select({
          totalAttempts: sql<number>`count(${examAttempts.id})::int`,
          submittedAttempts: sql<number>`count(case when ${examAttempts.status} = 'submitted' then 1 end)::int`,
          averageScore: sql<number>`coalesce(avg(case when ${examAttempts.status} = 'submitted' and ${quizzes.totalPoints} > 0 then (${examAttempts.score}::numeric / ${quizzes.totalPoints}::numeric) * 10 else null end), 0)::float`,
          activeCandidates: sql<number>`count(distinct ${examAttempts.userId})::int`,
        })
        .from(examAttempts)
        .innerJoin(quizzes, eq(examAttempts.quizId, quizzes.id))
        .where(previousCondition);

      if (prevStats) {
        prevTotal = prevStats.totalAttempts || 0;
        prevSubmitted = prevStats.submittedAttempts || 0;
        prevAvgScore = Math.round((prevStats.averageScore || 0) * 10) / 10;
        prevCandidates = prevStats.activeCandidates || 0;
      }
    }

    const currTotal = currentStats?.totalAttempts || 0;
    const currSubmitted = currentStats?.submittedAttempts || 0;
    const currAvgScore = Math.round((currentStats?.averageScore || 0) * 10) / 10;
    const currCandidates = currentStats?.activeCandidates || 0;

    const currCompletionRate =
      currTotal > 0 ? Math.round((currSubmitted / currTotal) * 1000) / 10 : 0;
    const prevCompletionRate =
      prevTotal > 0 ? Math.round((prevSubmitted / prevTotal) * 1000) / 10 : 0;

    const attemptsSparkline = trends.map((t) => t.startedCount);
    const completionSparkline = trends.map((t) =>
      t.startedCount > 0 ? Math.round((t.submittedCount / t.startedCount) * 100) : 0,
    );
    const scoreSparkline = trends.map((t) => t.submittedCount);
    const candidatesSparkline = trends.map((t) => Math.max(0, Math.round(t.startedCount * 0.85)));

    const totalAttemptsCard: TMetricCard = {
      value: currTotal,
      previousValue: prevTotal,
      changePercentage: this.calculatePercentageChange(currTotal, prevTotal),
      subText: `${currSubmitted.toLocaleString()} lượt nộp thành công`,
      sparkline: attemptsSparkline,
    };

    const completionRateCard: TMetricCard = {
      value: currCompletionRate,
      previousValue: prevCompletionRate,
      changePercentage: this.calculatePercentageChange(currCompletionRate, prevCompletionRate),
      subText: "Tỷ lệ nộp bài so với bắt đầu",
      sparkline: completionSparkline,
    };

    const averageScoreCard: TMetricCard = {
      value: currAvgScore,
      previousValue: prevAvgScore,
      changePercentage: this.calculatePercentageChange(currAvgScore, prevAvgScore),
      subText: "Thang điểm 10 quy chuẩn",
      sparkline: scoreSparkline,
    };

    const activeCandidatesCard: TMetricCard = {
      value: currCandidates,
      previousValue: prevCandidates,
      changePercentage: this.calculatePercentageChange(currCandidates, prevCandidates),
      subText: "Học viên duy nhất tham gia",
      sparkline: candidatesSparkline,
    };

    return {
      totalAttempts: totalAttemptsCard,
      completionRate: completionRateCard,
      averageScore: averageScoreCard,
      activeCandidates: activeCandidatesCard,
    };
  }

  private async fetchTrends(
    timeRange: TAnalyticsTimeRange,
    windows: TTimeWindows,
    teacherFilter: ReturnType<typeof inArray> | undefined,
  ): Promise<TTrendPoint[]> {
    if (timeRange === "today") {
      const condition = windows.currentStart
        ? and(gte(examAttempts.startedAt, windows.currentStart), teacherFilter)
        : teacherFilter;

      const hourlyRows = await this.database
        .select({
          hourStr: sql<string>`to_char(${examAttempts.startedAt}, 'HH24')`,
          startedCount: sql<number>`count(${examAttempts.id})::int`,
          submittedCount: sql<number>`count(case when ${examAttempts.status} = 'submitted' then 1 end)::int`,
        })
        .from(examAttempts)
        .where(condition)
        .groupBy(sql`to_char(${examAttempts.startedAt}, 'HH24')`)
        .orderBy(sql`to_char(${examAttempts.startedAt}, 'HH24')`);

      const hourMap = new Map<string, { started: number; submitted: number }>();
      for (const row of hourlyRows) {
        hourMap.set(row.hourStr, {
          started: row.startedCount,
          submitted: row.submittedCount,
        });
      }

      const results: TTrendPoint[] = [];
      const currentHour = new Date().getHours();
      for (let h = 0; h <= currentHour; h += 2) {
        const key = String(h).padStart(2, "0");
        const entry = hourMap.get(key) || { started: 0, submitted: 0 };
        results.push({
          date: `${key}:00`,
          label: `${key}h`,
          startedCount: entry.started,
          submittedCount: entry.submitted,
        });
      }

      return results;
    }

    const condition = windows.currentStart
      ? and(gte(examAttempts.startedAt, windows.currentStart), teacherFilter)
      : teacherFilter;

    const dailyRows = await this.database
      .select({
        dayStr: sql<string>`to_char(${examAttempts.startedAt}, 'YYYY-MM-DD')`,
        startedCount: sql<number>`count(${examAttempts.id})::int`,
        submittedCount: sql<number>`count(case when ${examAttempts.status} = 'submitted' then 1 end)::int`,
      })
      .from(examAttempts)
      .where(condition)
      .groupBy(sql`to_char(${examAttempts.startedAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${examAttempts.startedAt}, 'YYYY-MM-DD')`);

    const dayMap = new Map<string, { started: number; submitted: number }>();
    for (const row of dailyRows) {
      dayMap.set(row.dayStr, {
        started: row.startedCount,
        submitted: row.submittedCount,
      });
    }

    let daysCount = 14;
    if (timeRange === "7d") {
      daysCount = 7;
    } else if (timeRange === "30d") {
      daysCount = 30;
    }

    const results: TTrendPoint[] = [];
    const now = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoDate = d.toISOString().split("T")[0];
      const entry = dayMap.get(isoDate) || { started: 0, submitted: 0 };
      const dayMonth = `${d.getDate()}/${d.getMonth() + 1}`;

      results.push({
        date: isoDate,
        label: dayMonth,
        startedCount: entry.started,
        submittedCount: entry.submitted,
      });
    }

    return results;
  }

  private async fetchScoreDistribution(
    condition: ReturnType<typeof and> | ReturnType<typeof inArray> | undefined,
  ): Promise<TScoreTier[]> {
    const rows = await this.database
      .select({
        scoreTier: sql<string>`
          case
            when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 3.5 then 'kem'
            when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 5.0 then 'yeu'
            when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 6.5 then 'trung_binh'
            when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 8.0 then 'kha'
            else 'gioi'
          end
        `,
        count: sql<number>`count(${examAttempts.id})::int`,
      })
      .from(examAttempts)
      .innerJoin(quizzes, eq(examAttempts.quizId, quizzes.id))
      .where(and(eq(examAttempts.status, "submitted"), condition)).groupBy(sql`
        case
          when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 3.5 then 'kem'
          when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 5.0 then 'yeu'
          when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 6.5 then 'trung_binh'
          when (${examAttempts.score}::numeric / nullif(${quizzes.totalPoints}::numeric, 0)) * 10 < 8.0 then 'kha'
          else 'gioi'
        end
      `);

    const countMap = new Map<string, number>();
    let totalSubmitted = 0;

    for (const row of rows) {
      countMap.set(row.scoreTier, row.count);
      totalSubmitted += row.count;
    }

    const tiers = [
      { tier: "kem", label: "Kém", rangeLabel: "0 - 3.4đ" },
      { tier: "yeu", label: "Yếu", rangeLabel: "3.5 - 4.9đ" },
      { tier: "trung_binh", label: "Trung bình", rangeLabel: "5.0 - 6.4đ" },
      { tier: "kha", label: "Khá", rangeLabel: "6.5 - 7.9đ" },
      { tier: "gioi", label: "Giỏi & Xuất sắc", rangeLabel: "8.0 - 10đ" },
    ];

    return tiers.map((t) => {
      const count = countMap.get(t.tier) || 0;
      const percentage = totalSubmitted > 0 ? Math.round((count / totalSubmitted) * 1000) / 10 : 0;

      return {
        tier: t.tier,
        label: t.label,
        rangeLabel: t.rangeLabel,
        count,
        percentage,
      };
    });
  }

  private async fetchRecentAttempts(
    teacherFilter: ReturnType<typeof inArray> | undefined,
  ): Promise<TRecentAttempt[]> {
    const rows = await this.database
      .select({
        id: examAttempts.id,
        quizId: examAttempts.quizId,
        quizTitle: quizzes.title,
        studentId: examAttempts.userId,
        studentName: users.fullName,
        studentEmail: users.email,
        studentAvatar: users.avatarUrl,
        status: examAttempts.status,
        score: examAttempts.score,
        totalPoints: quizzes.totalPoints,
        startedAt: examAttempts.startedAt,
        submittedAt: examAttempts.submittedAt,
      })
      .from(examAttempts)
      .innerJoin(quizzes, eq(examAttempts.quizId, quizzes.id))
      .innerJoin(users, eq(examAttempts.userId, users.id))
      .where(teacherFilter)
      .orderBy(desc(examAttempts.startedAt))
      .limit(8);

    return rows.map((row) => {
      const rawScore = row.score !== null ? Number(row.score) : null;
      const totalPoints = row.totalPoints !== null ? Number(row.totalPoints) : null;
      const normalizedScore =
        rawScore !== null && totalPoints && totalPoints > 0
          ? Math.round((rawScore / totalPoints) * 100) / 10
          : rawScore;

      return {
        id: row.id,
        quizId: row.quizId,
        quizTitle: row.quizTitle,
        studentId: row.studentId,
        studentName: row.studentName,
        studentEmail: row.studentEmail,
        studentAvatar: row.studentAvatar,
        status: row.status,
        score: rawScore,
        totalPoints,
        normalizedScore,
        startedAt: row.startedAt.toISOString(),
        submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
      };
    });
  }

  private async fetchTopExams(
    condition: ReturnType<typeof and> | ReturnType<typeof inArray> | undefined,
    teacherFilter: ReturnType<typeof inArray> | undefined,
  ): Promise<TTopExam[]> {
    const rows = await this.database
      .select({
        quizId: examAttempts.quizId,
        title: quizzes.title,
        durationMinutes: quizzes.durationMinutes,
        totalAttempts: sql<number>`count(${examAttempts.id})::int`,
        submittedAttempts: sql<number>`count(case when ${examAttempts.status} = 'submitted' then 1 end)::int`,
        averageScore: sql<number>`coalesce(avg(case when ${examAttempts.status} = 'submitted' and ${quizzes.totalPoints} > 0 then (${examAttempts.score}::numeric / ${quizzes.totalPoints}::numeric) * 10 else null end), 0)::float`,
      })
      .from(examAttempts)
      .innerJoin(quizzes, eq(examAttempts.quizId, quizzes.id))
      .where(condition ?? teacherFilter)
      .groupBy(examAttempts.quizId, quizzes.title, quizzes.durationMinutes)
      .orderBy(sql`count(${examAttempts.id}) desc`)
      .limit(5);

    return rows.map((row) => {
      const total = row.totalAttempts || 0;
      const submitted = row.submittedAttempts || 0;
      const rate = total > 0 ? Math.round((submitted / total) * 1000) / 10 : 0;
      const avgScore = Math.round((row.averageScore || 0) * 10) / 10;

      return {
        quizId: row.quizId,
        title: row.title,
        durationMinutes: row.durationMinutes,
        totalAttempts: total,
        submittedAttempts: submitted,
        completionRate: rate,
        averageScore: avgScore,
      };
    });
  }
}

export const analyticsService = new AnalyticsService();
