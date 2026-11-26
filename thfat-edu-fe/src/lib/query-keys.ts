/**
 * Global Query Key Factory Adheres to TkDodo's Effective React Query Keys convention with `as
 * const` tuples.
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    sessions: () => [...queryKeys.auth.all, "sessions"] as const,
  },
  exams: {
    all: ["exams"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.exams.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.exams.all, "detail", id] as const,
  },
  studentExams: {
    all: ["student-exams"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.studentExams.all, "list", params] as const,
    room: (quizId: string) => [...queryKeys.studentExams.all, "room", quizId] as const,
    result: (quizId: string) => [...queryKeys.studentExams.all, "result", quizId] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.users.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
  inviteCodes: {
    all: ["invite-codes"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.inviteCodes.all, "list", params] as const,
    check: (code: string) => [...queryKeys.inviteCodes.all, "check", code] as const,
  },
  settings: {
    all: ["settings"] as const,
    exam: () => [...queryKeys.settings.all, "exam"] as const,
    site: () => [...queryKeys.settings.all, "site"] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
  },
  articles: {
    all: ["articles"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.articles.all, "list", params] as const,
    detail: (idOrSlug: string) => [...queryKeys.articles.all, "detail", idOrSlug] as const,
  },
  leaderboard: {
    all: ["leaderboard"] as const,
    global: (params?: Record<string, unknown>) =>
      [...queryKeys.leaderboard.all, "global", params] as const,
    quiz: (quizId: string, params?: Record<string, unknown>) =>
      [...queryKeys.leaderboard.all, "quiz", quizId, params] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    dashboard: (timeRange?: string) =>
      [...queryKeys.analytics.all, "dashboard", timeRange] as const,
  },
} as const;
