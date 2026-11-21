export type TAnalyticsTimeRange = "today" | "7d" | "30d" | "all";

export type TMetricCard = {
  value: number;
  previousValue: number;
  changePercentage: number;
  subText: string;
  sparkline?: number[];
};

export type TTrendPoint = {
  date: string;
  label: string;
  startedCount: number;
  submittedCount: number;
};

export type TScoreTier = {
  tier: string;
  label: string;
  rangeLabel: string;
  count: number;
  percentage: number;
};

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

export type TTopExam = {
  quizId: string;
  title: string;
  durationMinutes: number;
  totalAttempts: number;
  submittedAttempts: number;
  completionRate: number;
  averageScore: number;
};

export type TDashboardAnalytics = {
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
