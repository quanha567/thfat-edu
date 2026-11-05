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
} as const;
