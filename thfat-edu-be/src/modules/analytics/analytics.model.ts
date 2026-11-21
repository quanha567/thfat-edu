import { t } from "elysia";

export const AnalyticsTimeRangeEnum = t.Union([
  t.Literal("today"),
  t.Literal("7d"),
  t.Literal("30d"),
  t.Literal("all"),
]);

export type TAnalyticsTimeRange = "today" | "7d" | "30d" | "all";

export const DashboardAnalyticsQuerySchema = t.Object({
  timeRange: t.Optional(AnalyticsTimeRangeEnum),
});

export type TDashboardAnalyticsQuery = {
  timeRange?: TAnalyticsTimeRange;
};

export const MetricCardSchema = t.Object({
  value: t.Number(),
  previousValue: t.Number(),
  changePercentage: t.Number(),
  subText: t.String(),
  sparkline: t.Optional(t.Array(t.Number())),
});

export type TMetricCard = {
  value: number;
  previousValue: number;
  changePercentage: number;
  subText: string;
  sparkline?: number[];
};

export const TrendPointSchema = t.Object({
  date: t.String(),
  label: t.String(),
  startedCount: t.Number(),
  submittedCount: t.Number(),
});

export type TTrendPoint = {
  date: string;
  label: string;
  startedCount: number;
  submittedCount: number;
};

export const ScoreTierSchema = t.Object({
  tier: t.String(),
  label: t.String(),
  rangeLabel: t.String(),
  count: t.Number(),
  percentage: t.Number(),
});

export type TScoreTier = {
  tier: string;
  label: string;
  rangeLabel: string;
  count: number;
  percentage: number;
};

export const RecentAttemptSchema = t.Object({
  id: t.String(),
  quizId: t.String(),
  quizTitle: t.String(),
  studentId: t.String(),
  studentName: t.String(),
  studentEmail: t.String(),
  studentAvatar: t.Nullable(t.String()),
  status: t.String(),
  score: t.Nullable(t.Number()),
  totalPoints: t.Nullable(t.Number()),
  normalizedScore: t.Nullable(t.Number()),
  startedAt: t.String(),
  submittedAt: t.Nullable(t.String()),
});

export type TRecentAttempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  status: string;
  score: number | null;
  totalPoints: number | null;
  normalizedScore: number | null;
  startedAt: string;
  submittedAt: string | null;
};

export const TopExamSchema = t.Object({
  quizId: t.String(),
  title: t.String(),
  durationMinutes: t.Number(),
  totalAttempts: t.Number(),
  submittedAttempts: t.Number(),
  completionRate: t.Number(),
  averageScore: t.Number(),
});

export type TTopExam = {
  quizId: string;
  title: string;
  durationMinutes: number;
  totalAttempts: number;
  submittedAttempts: number;
  completionRate: number;
  averageScore: number;
};

export const DashboardAnalyticsResponseSchema = t.Object({
  kpi: t.Object({
    totalAttempts: MetricCardSchema,
    completionRate: MetricCardSchema,
    averageScore: MetricCardSchema,
    activeCandidates: MetricCardSchema,
  }),
  trends: t.Array(TrendPointSchema),
  scoreDistribution: t.Array(ScoreTierSchema),
  recentAttempts: t.Array(RecentAttemptSchema),
  topExams: t.Array(TopExamSchema),
  timeRange: AnalyticsTimeRangeEnum,
  updatedAt: t.String(),
});

export type TDashboardAnalyticsResponse = {
  kpi: {
    totalAttempts: TMetricCard;
    completionRate: TMetricCard;
    averageScore: TMetricCard;
    activeCandidates: TMetricCard;
  };
  trends: TTrendPoint[];
  scoreDistribution: TScoreTier[];
  recentAttempts: TRecentAttempt[];
  topExams: TTopExam[];
  timeRange: TAnalyticsTimeRange;
  updatedAt: string;
};
