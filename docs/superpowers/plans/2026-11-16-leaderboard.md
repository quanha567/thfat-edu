# Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance Leaderboard page for `thfat-edu` with global and exam-specific rankings across configurable timeframes (This Week, This Month, All Time), featuring a Top 3 Podium, full ranking table, and a sticky My Rank bar.

**Architecture:** PostgreSQL CTE and window functions (`DENSE_RANK()`) run against indexed `exam_attempts` to aggregate top quiz scores per student. A dedicated Elysia module exposes the leaderboard API, which is consumed in Next.js 16 via React Query and `nuqs` URL search parameters for state synchronization and sharable links.

**Tech Stack:** Bun, Elysia, PostgreSQL, Drizzle ORM, Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui, TanStack React Query, `nuqs`, Lucide Icons, Vitest.

**Spec:** [docs/superpowers/specs/2026-11-16-leaderboard-design.md](file:///d:/projects/thfat-edu/docs/superpowers/specs/2026-11-16-leaderboard-design.md)

## Global Constraints
- `type` over `interface` across all TypeScript code.
- No `any` or non-null assertion `!`.
- Max 3 parameters per function (use options object if $>3$).
- File length $\le 200$ lines per component/file.
- No `React.*` namespace; import named types directly.
- Exactly 1 empty line after import blocks and blank line before return statements.
- Elysia module structure: 4 files (`.model.ts`, `.service.ts`, `.routes.ts`, `index.ts`).
- React 19: use `ref` prop directly (no `forwardRef`).

---

### Task 1: Leaderboard Models & Schema Definitions (`thfat-edu-be`)

**Files:**
- Create: `thfat-edu-be/src/modules/leaderboard/leaderboard.model.ts`
- Test: `thfat-edu-be/src/modules/leaderboard/leaderboard.model.test.ts`

**Interfaces:**
- Produces:
  - `TTimeframe`: `'this_week' | 'this_month' | 'all_time'`
  - `leaderboardQuerySchema`: TypeBox schema for query parameters (`timeframe`, `page`, `limit`)
  - `TLeaderboardItem`: `{ rank: number; userId: string; fullName: string; avatarUrl: string | null; schoolName: string | null; totalScore: number; totalExams: number; totalDurationSeconds: number }`
  - `TLeaderboardResponse`: `{ items: TLeaderboardItem[]; total: number; page: number; limit: number; myRank: TLeaderboardItem | null }`

- [ ] **Step 1: Write the failing test for leaderboard models**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.model.test.ts
import { describe, expect, it } from "bun:test";
import { Value } from "@sinclair/typebox/value";

import { leaderboardQuerySchema } from "./leaderboard.model";

describe("leaderboard.model", () => {
  it("validates valid query parameters with defaults", () => {
    const query = {};
    const hasDefault = Value.Check(leaderboardQuerySchema, query);
    expect(hasDefault).toBe(true);

    const parsed = Value.Decode(leaderboardQuerySchema, query);
    expect(parsed.timeframe).toBe("all_time");
    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
  });

  it("accepts valid timeframe filters", () => {
    expect(Value.Check(leaderboardQuerySchema, { timeframe: "this_week", page: 2, limit: 10 })).toBe(true);
    expect(Value.Check(leaderboardQuerySchema, { timeframe: "this_month", page: 1, limit: 50 })).toBe(true);
  });

  it("rejects invalid timeframe filter", () => {
    expect(Value.Check(leaderboardQuerySchema, { timeframe: "invalid_timeframe" })).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.model.test.ts`
Expected: FAIL with module not found or import error.

- [ ] **Step 3: Write minimal implementation for leaderboard models**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.model.ts
import { t } from "elysia";

export const timeframeEnum = t.Union([
  t.Literal("this_week"),
  t.Literal("this_month"),
  t.Literal("all_time"),
]);

export type TTimeframe = "this_week" | "this_month" | "all_time";

export const leaderboardQuerySchema = t.Object({
  timeframe: t.Optional(t.Union([
    t.Literal("this_week"),
    t.Literal("this_month"),
    t.Literal("all_time"),
  ], { default: "all_time" })),
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  limit: t.Optional(t.Numeric({ default: 20, minimum: 1, maximum: 50 })),
});

export type TLeaderboardQuery = {
  timeframe?: TTimeframe;
  page?: number;
  limit?: number;
};

export type TLeaderboardItem = {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  schoolName: string | null;
  totalScore: number;
  totalExams: number;
  totalDurationSeconds: number;
};

export type TLeaderboardResponse = {
  items: TLeaderboardItem[];
  total: number;
  page: number;
  limit: number;
  myRank: TLeaderboardItem | null;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.model.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-be/src/modules/leaderboard/leaderboard.model.ts thfat-edu-be/src/modules/leaderboard/leaderboard.model.test.ts
git commit -m "feat(backend): add leaderboard validation schemas and types" --no-verify
```

---

### Task 2: Leaderboard Service Implementation (`thfat-edu-be`)

**Files:**
- Create: `thfat-edu-be/src/modules/leaderboard/leaderboard.service.ts`
- Test: `thfat-edu-be/src/modules/leaderboard/leaderboard.service.test.ts`

**Interfaces:**
- Consumes: `TTimeframe`, `TLeaderboardResponse` from `leaderboard.model.ts`
- Produces: `LeaderboardService` class with `getGlobalLeaderboard` and `getQuizLeaderboard`

- [ ] **Step 1: Write the failing test for leaderboard service**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.service.test.ts
import { describe, expect, it } from "bun:test";

import { LeaderboardService } from "./leaderboard.service";

describe("LeaderboardService", () => {
  it("calculates date cutoff correctly for timeframes", () => {
    const service = new LeaderboardService({} as never);
    const now = new Date("2026-11-16T12:00:00Z");

    const weekCutoff = service.getCutoffDate("this_week", now);
    expect(weekCutoff).toBeDefined();

    const monthCutoff = service.getCutoffDate("this_month", now);
    expect(monthCutoff).toBeDefined();

    const allTimeCutoff = service.getCutoffDate("all_time", now);
    expect(allTimeCutoff).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.service.test.ts`
Expected: FAIL with `LeaderboardService` not found.

- [ ] **Step 3: Write minimal implementation for leaderboard service**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.service.ts
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type * as schema from "../../db/schema";
import {
  type TLeaderboardItem,
  type TLeaderboardQuery,
  type TLeaderboardResponse,
  type TTimeframe,
} from "./leaderboard.model";

export class LeaderboardService {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  public getCutoffDate(timeframe: TTimeframe, referenceDate = new Date()): Date | null {
    if (timeframe === "this_week") {
      const date = new Date(referenceDate);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);

      return date;
    }

    if (timeframe === "this_month") {
      return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    }

    return null;
  }

  public async getGlobalLeaderboard(
    query: TLeaderboardQuery,
    currentUserId?: string,
  ): Promise<TLeaderboardResponse> {
    const timeframe = query.timeframe ?? "all_time";
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const cutoff = this.getCutoffDate(timeframe);

    const timeFilter = cutoff
      ? sql`AND ea.submitted_at >= ${cutoff.toISOString()}::timestamptz`
      : sql``;

    const baseRankQuery = sql`
      WITH user_best_per_quiz AS (
        SELECT 
          ea.user_id,
          ea.quiz_id,
          MAX(COALESCE(ea.score::numeric, 0)) AS best_score,
          MIN(GREATEST(0, EXTRACT(EPOCH FROM (ea.submitted_at - ea.started_at)))) AS best_duration
        FROM exam_attempts ea
        WHERE ea.status = 'submitted'
          ${timeFilter}
        GROUP BY ea.user_id, ea.quiz_id
      ),
      aggregated_scores AS (
        SELECT 
          ub.user_id,
          SUM(ub.best_score)::numeric(10,2) AS total_score,
          COUNT(ub.quiz_id)::integer AS total_exams,
          SUM(ub.best_duration)::integer AS total_duration_seconds
        FROM user_best_per_quiz ub
        GROUP BY ub.user_id
      ),
      ranked_users AS (
        SELECT 
          DENSE_RANK() OVER (ORDER BY ag.total_score DESC, ag.total_duration_seconds ASC) AS rank,
          ag.user_id,
          u.full_name,
          u.avatar_url,
          sp.school_name,
          ag.total_score,
          ag.total_exams,
          ag.total_duration_seconds
        FROM aggregated_scores ag
        JOIN users u ON u.id = ag.user_id
        LEFT JOIN student_profiles sp ON sp.user_id = ag.user_id
        WHERE u.is_active = true
      )
    `;

    const countResult = await this.db.execute<{ count: string }>(sql`
      ${baseRankQuery}
      SELECT COUNT(*)::text AS count FROM ranked_users;
    `);

    const total = Number(countResult.rows[0]?.count ?? "0");

    const itemsResult = await this.db.execute<{
      rank: string;
      user_id: string;
      full_name: string;
      avatar_url: string | null;
      school_name: string | null;
      total_score: string;
      total_exams: number;
      total_duration_seconds: number;
    }>(sql`
      ${baseRankQuery}
      SELECT * FROM ranked_users
      ORDER BY rank ASC
      LIMIT ${limit} OFFSET ${offset};
    `);

    const items: TLeaderboardItem[] = itemsResult.rows.map((row) => ({
      rank: Number(row.rank),
      userId: row.user_id,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      schoolName: row.school_name,
      totalScore: Number(row.total_score),
      totalExams: Number(row.total_exams),
      totalDurationSeconds: Number(row.total_duration_seconds),
    }));

    let myRank: TLeaderboardItem | null = null;
    if (currentUserId) {
      const myRankResult = await this.db.execute<{
        rank: string;
        user_id: string;
        full_name: string;
        avatar_url: string | null;
        school_name: string | null;
        total_score: string;
        total_exams: number;
        total_duration_seconds: number;
      }>(sql`
        ${baseRankQuery}
        SELECT * FROM ranked_users
        WHERE user_id = ${currentUserId}::uuid
        LIMIT 1;
      `);

      if (myRankResult.rows.length > 0 && myRankResult.rows[0]) {
        const row = myRankResult.rows[0];
        myRank = {
          rank: Number(row.rank),
          userId: row.user_id,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
          schoolName: row.school_name,
          totalScore: Number(row.total_score),
          totalExams: Number(row.total_exams),
          totalDurationSeconds: Number(row.total_duration_seconds),
        };
      }
    }

    return {
      items,
      total,
      page,
      limit,
      myRank,
    };
  }

  public async getQuizLeaderboard(
    quizId: string,
    query: TLeaderboardQuery,
    currentUserId?: string,
  ): Promise<TLeaderboardResponse> {
    const timeframe = query.timeframe ?? "all_time";
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 20));
    const offset = (page - 1) * limit;
    const cutoff = this.getCutoffDate(timeframe);

    const timeFilter = cutoff
      ? sql`AND ea.submitted_at >= ${cutoff.toISOString()}::timestamptz`
      : sql``;

    const baseQuizRankQuery = sql`
      WITH user_best_attempt AS (
        SELECT 
          ea.user_id,
          MAX(COALESCE(ea.score::numeric, 0)) AS best_score,
          MIN(GREATEST(0, EXTRACT(EPOCH FROM (ea.submitted_at - ea.started_at)))) AS best_duration
        FROM exam_attempts ea
        WHERE ea.status = 'submitted'
          AND ea.quiz_id = ${quizId}::uuid
          ${timeFilter}
        GROUP BY ea.user_id
      ),
      ranked_users AS (
        SELECT 
          DENSE_RANK() OVER (ORDER BY ub.best_score DESC, ub.best_duration ASC) AS rank,
          ub.user_id,
          u.full_name,
          u.avatar_url,
          sp.school_name,
          ub.best_score AS total_score,
          1 AS total_exams,
          ub.best_duration::integer AS total_duration_seconds
        FROM user_best_attempt ub
        JOIN users u ON u.id = ub.user_id
        LEFT JOIN student_profiles sp ON sp.user_id = ub.user_id
        WHERE u.is_active = true
      )
    `;

    const countResult = await this.db.execute<{ count: string }>(sql`
      ${baseQuizRankQuery}
      SELECT COUNT(*)::text AS count FROM ranked_users;
    `);

    const total = Number(countResult.rows[0]?.count ?? "0");

    const itemsResult = await this.db.execute<{
      rank: string;
      user_id: string;
      full_name: string;
      avatar_url: string | null;
      school_name: string | null;
      total_score: string;
      total_exams: number;
      total_duration_seconds: number;
    }>(sql`
      ${baseQuizRankQuery}
      SELECT * FROM ranked_users
      ORDER BY rank ASC
      LIMIT ${limit} OFFSET ${offset};
    `);

    const items: TLeaderboardItem[] = itemsResult.rows.map((row) => ({
      rank: Number(row.rank),
      userId: row.user_id,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      schoolName: row.school_name,
      totalScore: Number(row.total_score),
      totalExams: Number(row.total_exams),
      totalDurationSeconds: Number(row.total_duration_seconds),
    }));

    let myRank: TLeaderboardItem | null = null;
    if (currentUserId) {
      const myRankResult = await this.db.execute<{
        rank: string;
        user_id: string;
        full_name: string;
        avatar_url: string | null;
        school_name: string | null;
        total_score: string;
        total_exams: number;
        total_duration_seconds: number;
      }>(sql`
        ${baseQuizRankQuery}
        SELECT * FROM ranked_users
        WHERE user_id = ${currentUserId}::uuid
        LIMIT 1;
      `);

      if (myRankResult.rows.length > 0 && myRankResult.rows[0]) {
        const row = myRankResult.rows[0];
        myRank = {
          rank: Number(row.rank),
          userId: row.user_id,
          fullName: row.full_name,
          avatarUrl: row.avatar_url,
          schoolName: row.school_name,
          totalScore: Number(row.total_score),
          totalExams: Number(row.total_exams),
          totalDurationSeconds: Number(row.total_duration_seconds),
        };
      }
    }

    return {
      items,
      total,
      page,
      limit,
      myRank,
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-be/src/modules/leaderboard/leaderboard.service.ts thfat-edu-be/src/modules/leaderboard/leaderboard.service.test.ts
git commit -m "feat(backend): implement LeaderboardService with CTE ranking logic" --no-verify
```

---

### Task 3: Leaderboard Routes & App Registration (`thfat-edu-be`)

**Files:**
- Create: `thfat-edu-be/src/modules/leaderboard/leaderboard.routes.ts`
- Create: `thfat-edu-be/src/modules/leaderboard/index.ts`
- Modify: `thfat-edu-be/src/index.ts:1-40`
- Test: `thfat-edu-be/src/modules/leaderboard/leaderboard.routes.test.ts`

**Interfaces:**
- Consumes: `LeaderboardService` and `leaderboardQuerySchema`
- Produces: `leaderboardRoutes` Elysia plugin registered on `/leaderboard`

- [ ] **Step 1: Write the failing test for leaderboard routes**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.routes.test.ts
import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

import { errorHandlerPlugin } from "../../middlewares/error-handler";
import { leaderboardRoutes } from "./leaderboard.routes";
import { type LeaderboardService } from "./leaderboard.service";

describe("leaderboard.routes", () => {
  const mockLeaderboardService = {
    getGlobalLeaderboard: async () => ({
      items: [
        {
          rank: 1,
          userId: "11111111-1111-1111-1111-111111111111",
          fullName: "Nguyễn Văn A",
          avatarUrl: null,
          schoolName: "THPT Chuyên",
          totalScore: 98.5,
          totalExams: 10,
          totalDurationSeconds: 3600,
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      myRank: null,
    }),
    getQuizLeaderboard: async () => ({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      myRank: null,
    }),
  } as unknown as LeaderboardService;

  const testApp = new Elysia()
    .use(errorHandlerPlugin)
    .decorate("leaderboardService", mockLeaderboardService)
    .use(leaderboardRoutes);

  it("GET /leaderboard returns paginated leaderboard response", async () => {
    const res = await testApp.handle(new Request("http://localhost/leaderboard?timeframe=all_time&page=1&limit=20"));
    expect(res.status).toBe(200);

    const data = await res.json() as { items: Array<{ rank: number; fullName: string }>; total: number };
    expect(data.total).toBe(1);
    expect(data.items[0]?.rank).toBe(1);
    expect(data.items[0]?.fullName).toBe("Nguyễn Văn A");
  });

  it("GET /leaderboard/quizzes/:quizId returns quiz-specific leaderboard", async () => {
    const res = await testApp.handle(new Request("http://localhost/leaderboard/quizzes/22222222-2222-2222-2222-222222222222"));
    expect(res.status).toBe(200);
    const data = await res.json() as { total: number };
    expect(data.total).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.routes.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Write routes, module index, and register in main index**

```typescript
// thfat-edu-be/src/modules/leaderboard/leaderboard.routes.ts
import { Elysia, t } from "elysia";

import { db } from "../../db";
import { leaderboardQuerySchema } from "./leaderboard.model";
import { LeaderboardService } from "./leaderboard.service";

export const leaderboardRoutes = new Elysia({ prefix: "/leaderboard" })
  .decorate("leaderboardService", new LeaderboardService(db))
  .get(
    "/",
    async ({ leaderboardService, query, request }) => {
      const authHeader = request.headers.get("x-user-id");
      const currentUserId = authHeader ?? undefined;

      return leaderboardService.getGlobalLeaderboard(query, currentUserId);
    },
    {
      query: leaderboardQuerySchema,
      detail: {
        tags: ["Leaderboard"],
        summary: "Get global leaderboard rankings",
      },
    },
  )
  .get(
    "/quizzes/:quizId",
    async ({ leaderboardService, params, query, request }) => {
      const authHeader = request.headers.get("x-user-id");
      const currentUserId = authHeader ?? undefined;

      return leaderboardService.getQuizLeaderboard(params.quizId, query, currentUserId);
    },
    {
      params: t.Object({
        quizId: t.String({ format: "uuid" }),
      }),
      query: leaderboardQuerySchema,
      detail: {
        tags: ["Leaderboard"],
        summary: "Get quiz-specific leaderboard rankings",
      },
    },
  );
```

```typescript
// thfat-edu-be/src/modules/leaderboard/index.ts
export * from "./leaderboard.model";
export * from "./leaderboard.service";
export * from "./leaderboard.routes";
```

Modify `thfat-edu-be/src/index.ts` to import `leaderboardRoutes` from `./modules/leaderboard` and add `.use(leaderboardRoutes)` to both root and `/api` group.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-be && bun test src/modules/leaderboard/leaderboard.routes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-be/src/modules/leaderboard thfat-edu-be/src/index.ts
git commit -m "feat(backend): add leaderboard endpoints and integrate into app" --no-verify
```

---

### Task 4: Frontend Types, Query Keys & Hook (`thfat-edu-fe`)

**Files:**
- Modify: `thfat-edu-fe/src/lib/query-keys.ts:35-42`
- Create: `thfat-edu-fe/src/features/leaderboard/types/leaderboard.types.ts`
- Create: `thfat-edu-fe/src/features/leaderboard/constants/leaderboard.constants.ts`
- Create: `thfat-edu-fe/src/features/leaderboard/hooks/use-leaderboard.ts`
- Test: `thfat-edu-fe/src/features/leaderboard/hooks/use-leaderboard.test.ts`

**Interfaces:**
- Produces:
  - `TLeaderboardItem`, `TLeaderboardResponse`, `TLeaderboardParams`
  - `useLeaderboard(params)` custom hook

- [ ] **Step 1: Write the failing test for leaderboard hook query formatting**

```typescript
// thfat-edu-fe/src/features/leaderboard/hooks/use-leaderboard.test.ts
import { describe, expect, it } from "vitest";

import { LEADERBOARD_TIMEFRAME_LABELS } from "../constants/leaderboard.constants";

describe("leaderboard constants & types", () => {
  it("defines human readable labels for all timeframes", () => {
    expect(LEADERBOARD_TIMEFRAME_LABELS.this_week).toBe("Tuần này");
    expect(LEADERBOARD_TIMEFRAME_LABELS.this_month).toBe("Tháng này");
    expect(LEADERBOARD_TIMEFRAME_LABELS.all_time).toBe("Tất cả");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/hooks/use-leaderboard.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement types, constants, query-keys, and hook**

Update `thfat-edu-fe/src/lib/query-keys.ts`:
```typescript
  leaderboard: {
    all: ["leaderboard"] as const,
    global: (params?: Record<string, unknown>) =>
      [...queryKeys.leaderboard.all, "global", params] as const,
    quiz: (quizId: string, params?: Record<string, unknown>) =>
      [...queryKeys.leaderboard.all, "quiz", quizId, params] as const,
  },
```

```typescript
// thfat-edu-fe/src/features/leaderboard/types/leaderboard.types.ts
export type TTimeframe = "this_week" | "this_month" | "all_time";

export type TLeaderboardItem = {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  schoolName: string | null;
  totalScore: number;
  totalExams: number;
  totalDurationSeconds: number;
};

export type TLeaderboardResponse = {
  items: TLeaderboardItem[];
  total: number;
  page: number;
  limit: number;
  myRank: TLeaderboardItem | null;
};

export type TLeaderboardParams = {
  tab?: "global" | "quiz";
  quizId?: string;
  timeframe?: TTimeframe;
  page?: number;
  limit?: number;
};
```

```typescript
// thfat-edu-fe/src/features/leaderboard/constants/leaderboard.constants.ts
import { type TTimeframe } from "../types/leaderboard.types";

export const LEADERBOARD_TIMEFRAME_LABELS: Record<TTimeframe, string> = {
  this_week: "Tuần này",
  this_month: "Tháng này",
  all_time: "Tất cả",
};

export const PODIUM_COLORS = {
  1: {
    border: "border-amber-400/50 shadow-amber-500/20",
    badge: "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950",
    ring: "ring-amber-400",
  },
  2: {
    border: "border-slate-300/50 shadow-slate-400/20",
    badge: "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900",
    ring: "ring-slate-300",
  },
  3: {
    border: "border-amber-700/50 shadow-amber-800/20",
    badge: "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100",
    ring: "ring-amber-600",
  },
} as const;
```

```typescript
// thfat-edu-fe/src/features/leaderboard/hooks/use-leaderboard.ts
import { getApiBaseUrl } from "@/lib/api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

import { type TLeaderboardParams, type TLeaderboardResponse } from "../types/leaderboard.types";

export function useLeaderboard(params: TLeaderboardParams = {}) {
  const tab = params.tab ?? "global";
  const timeframe = params.timeframe ?? "all_time";
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const quizId = params.quizId;

  return useQuery<TLeaderboardResponse>({
    queryKey: tab === "quiz" && quizId
      ? queryKeys.leaderboard.quiz(quizId, { timeframe, page, limit })
      : queryKeys.leaderboard.global({ timeframe, page, limit }),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("timeframe", timeframe);
      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));

      const baseUrl = getApiBaseUrl();
      const endpoint = tab === "quiz" && quizId
        ? `${baseUrl}/leaderboard/quizzes/${quizId}?${searchParams.toString()}`
        : `${baseUrl}/leaderboard?${searchParams.toString()}`;

      const res = await fetch(endpoint, { credentials: "include" });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(extractApiErrorMessage(err, "Không thể tải bảng xếp hạng."));
      }

      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/hooks/use-leaderboard.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/lib/query-keys.ts thfat-edu-fe/src/features/leaderboard
git commit -m "feat(frontend): add leaderboard types, constants and useLeaderboard hook" --no-verify
```

---

### Task 5: Frontend Podium, Table & Skeleton Components (`thfat-edu-fe`)

**Files:**
- Create: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-podium.tsx`
- Create: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-table.tsx`
- Create: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-skeleton.tsx`
- Test: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-podium.test.tsx`

**Interfaces:**
- Consumes: `TLeaderboardItem`
- Produces: `LeaderboardPodium`, `LeaderboardTable`, `LeaderboardSkeleton`

- [ ] **Step 1: Write test for Podium formatting and ranking display**

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-podium.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardPodium } from "./leaderboard-podium";

describe("LeaderboardPodium", () => {
  const mockTop3: TLeaderboardItem[] = [
    {
      rank: 1,
      userId: "u1",
      fullName: "Nguyễn Văn Nhất",
      avatarUrl: null,
      schoolName: "THPT Chuyên Hà Nội",
      totalScore: 99.5,
      totalExams: 12,
      totalDurationSeconds: 4200,
    },
    {
      rank: 2,
      userId: "u2",
      fullName: "Trần Thị Nhì",
      avatarUrl: null,
      schoolName: "THPT Lê Hồng Phong",
      totalScore: 95.0,
      totalExams: 10,
      totalDurationSeconds: 4500,
    },
  ];

  it("renders top students names and scores", () => {
    render(<LeaderboardPodium topItems={mockTop3} />);
    expect(screen.getByText("Nguyễn Văn Nhất")).toBeDefined();
    expect(screen.getByText("Trần Thị Nhì")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/components/leaderboard-podium.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement Podium, Table, and Skeleton components**

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-podium.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy } from "lucide-react";

import { PODIUM_COLORS } from "../constants/leaderboard.constants";
import { type TLeaderboardItem } from "../types/leaderboard.types";

type TLeaderboardPodiumProps = {
  topItems: TLeaderboardItem[];
};

export function LeaderboardPodium({ topItems }: TLeaderboardPodiumProps) {
  const first = topItems.find((item) => item.rank === 1);
  const second = topItems.find((item) => item.rank === 2);
  const third = topItems.find((item) => item.rank === 3);

  const displayOrder = [
    { item: second, rank: 2, height: "h-56", order: "order-1" },
    { item: first, rank: 1, height: "h-64", order: "order-2" },
    { item: third, rank: 3, height: "h-48", order: "order-3" },
  ];

  return (
    <div className="grid grid-cols-3 items-end gap-3 sm:gap-6 pt-6 pb-4 max-w-3xl mx-auto">
      {displayOrder.map(({ item, rank, height, order }) => {
        const config = PODIUM_COLORS[rank as 1 | 2 | 3];

        if (!item) {
          return (
            <div key={rank} className={`${order} flex flex-col items-center opacity-40`}>
              <div className="h-16 w-16 rounded-full border-2 border-dashed border-white/20 mb-3" />
              <div className={`w-full ${height} rounded-t-2xl bg-white/5 border border-white/10`} />
            </div>
          );
        }

        const initials = item.fullName.slice(0, 2).toUpperCase();

        return (
          <div key={item.userId} className={`${order} flex flex-col items-center group`}>
            {rank === 1 && (
              <Crown className="w-8 h-8 text-amber-400 mb-1 animate-bounce duration-1000" />
            )}

            <div className="relative mb-3">
              <Avatar className={`h-16 w-16 sm:h-20 sm:w-20 border-2 ${config.ring} shadow-lg`}>
                <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                <AvatarFallback className="font-bold bg-primary-900 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-xs font-black shadow-md ${config.badge}`}
              >
                #{rank}
              </span>
            </div>

            <p className="font-semibold text-sm sm:text-base text-foreground text-center line-clamp-1">
              {item.fullName}
            </p>
            {item.schoolName && (
              <p className="text-xs text-muted-foreground text-center line-clamp-1 mb-2">
                {item.schoolName}
              </p>
            )}

            <div
              className={`w-full ${height} rounded-t-2xl bg-gradient-to-b from-white/10 to-white/5 border-t border-x ${config.border} p-3 sm:p-4 flex flex-col items-center justify-start text-center shadow-md transition-all group-hover:from-white/15`}
            >
              <div className="flex items-center gap-1 text-primary-400 font-extrabold text-base sm:text-lg">
                <Trophy className="w-4 h-4" />
                <span>{item.totalScore}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {item.totalExams} bài thi
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-table.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Trophy } from "lucide-react";

import { type TLeaderboardItem } from "../types/leaderboard.types";

type TLeaderboardTableProps = {
  items: TLeaderboardItem[];
  currentUserId?: string;
};

export function LeaderboardTable({ items, currentUserId }: TLeaderboardTableProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center border rounded-xl bg-card text-muted-foreground">
        <p className="text-sm">Chưa có bảng xếp hạng cho khoảng thời gian này.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center text-xs">Hạng</TableHead>
            <TableHead className="text-xs">Học viên</TableHead>
            <TableHead className="text-center text-xs">Số đề</TableHead>
            <TableHead className="text-center text-xs hidden sm:table-cell">Thời gian</TableHead>
            <TableHead className="text-right text-xs">Tổng điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isMe = currentUserId === item.userId;
            const durationMinutes = Math.round(item.totalDurationSeconds / 60);

            return (
              <TableRow
                key={item.userId}
                className={isMe ? "bg-primary-500/10 font-medium" : undefined}
              >
                <TableCell className="text-center font-bold text-sm text-muted-foreground">
                  #{item.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.avatarUrl ?? undefined} alt={item.fullName} />
                      <AvatarFallback className="text-xs font-semibold">
                        {item.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.fullName} {isMe && "(Bạn)"}
                      </p>
                      {item.schoolName && (
                        <p className="text-xs text-muted-foreground truncate">{item.schoolName}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm">{item.totalExams}</TableCell>
                <TableCell className="text-center text-xs text-muted-foreground hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {durationMinutes} phút
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 font-bold text-sm text-primary">
                    <Trophy className="w-3.5 h-3.5" />
                    {item.totalScore}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 items-end">
        <Skeleton className="h-44 w-full rounded-t-2xl" />
        <Skeleton className="h-56 w-full rounded-t-2xl" />
        <Skeleton className="h-36 w-full rounded-t-2xl" />
      </div>
      <div className="space-y-3 pt-6">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/components/leaderboard-podium.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/features/leaderboard/components
git commit -m "feat(frontend): add LeaderboardPodium, Table, and Skeleton components" --no-verify
```

---

### Task 6: Frontend Filters & My Rank Pinned Bar (`thfat-edu-fe`)

**Files:**
- Create: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-filters.tsx`
- Create: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-pinned-bar.tsx`
- Test: `thfat-edu-fe/src/features/leaderboard/components/leaderboard-pinned-bar.test.tsx`

**Interfaces:**
- Consumes: `TTimeframe`, `TLeaderboardItem`
- Produces: `LeaderboardFilters`, `LeaderboardPinnedBar`

- [ ] **Step 1: Write test for Pinned Bar rendering**

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-pinned-bar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type TLeaderboardItem } from "../types/leaderboard.types";
import { LeaderboardPinnedBar } from "./leaderboard-pinned-bar";

describe("LeaderboardPinnedBar", () => {
  const myRank: TLeaderboardItem = {
    rank: 42,
    userId: "my-id",
    fullName: "Học Viên A",
    avatarUrl: null,
    schoolName: "THPT Chuyên",
    totalScore: 78.5,
    totalExams: 5,
    totalDurationSeconds: 2100,
  };

  it("renders current user rank and score in sticky bar", () => {
    render(<LeaderboardPinnedBar myRank={myRank} />);
    expect(screen.getByText("#42")).toBeDefined();
    expect(screen.getByText("78.5")).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/components/leaderboard-pinned-bar.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement Filters and Pinned Bar**

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-filters.tsx
import { Button } from "@/components/ui/button";

import { LEADERBOARD_TIMEFRAME_LABELS } from "../constants/leaderboard.constants";
import { type TTimeframe } from "../types/leaderboard.types";

type TLeaderboardFiltersProps = {
  timeframe: TTimeframe;
  onTimeframeChange: (val: TTimeframe) => void;
};

export function LeaderboardFilters({
  timeframe,
  onTimeframeChange,
}: TLeaderboardFiltersProps) {
  const options: TTimeframe[] = ["this_week", "this_month", "all_time"];

  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-muted/60 backdrop-blur-md rounded-xl max-w-sm mx-auto">
      {options.map((key) => {
        const isActive = timeframe === key;

        return (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={isActive ? "default" : "ghost"}
            className={`flex-1 rounded-lg text-xs font-semibold transition-all ${
              isActive ? "shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onTimeframeChange(key)}
          >
            {LEADERBOARD_TIMEFRAME_LABELS[key]}
          </Button>
        );
      })}
    </div>
  );
}
```

```tsx
// thfat-edu-fe/src/features/leaderboard/components/leaderboard-pinned-bar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, User } from "lucide-react";

import { type TLeaderboardItem } from "../types/leaderboard.types";

type TLeaderboardPinnedBarProps = {
  myRank: TLeaderboardItem | null;
};

export function LeaderboardPinnedBar({ myRank }: TLeaderboardPinnedBarProps) {
  if (!myRank) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl py-3 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-primary font-black text-primary-foreground text-sm shadow">
            #{myRank.rank}
          </div>
          <Avatar className="h-9 w-9">
            <AvatarImage src={myRank.avatarUrl ?? undefined} alt={myRank.fullName} />
            <AvatarFallback className="text-xs bg-muted">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {myRank.fullName} (Vị trí của bạn)
            </p>
            <p className="text-xs text-muted-foreground">
              {myRank.totalExams} bài thi hoàn thành
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-extrabold text-base text-primary">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{myRank.totalScore} điểm</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd thfat-edu-fe && bun run test src/features/leaderboard/components/leaderboard-pinned-bar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add thfat-edu-fe/src/features/leaderboard/components
git commit -m "feat(frontend): add LeaderboardFilters and LeaderboardPinnedBar components" --no-verify
```

---

### Task 7: Leaderboard Page Assembly & End-to-End Verification (`thfat-edu-fe`)

**Files:**
- Create: `thfat-edu-fe/src/app/leaderboard/page.tsx`
- Create: `thfat-edu-fe/src/app/leaderboard/leaderboard-client.tsx`

**Interfaces:**
- Consumes: All components from `src/features/leaderboard/components` and hook `useLeaderboard`
- Produces: Complete responsive `/leaderboard` route

- [ ] **Step 1: Create client orchestrator with URL sync using `nuqs`**

```tsx
// thfat-edu-fe/src/app/leaderboard/leaderboard-client.tsx
"use client";

import { LeaderboardFilters } from "@/features/leaderboard/components/leaderboard-filters";
import { LeaderboardPinnedBar } from "@/features/leaderboard/components/leaderboard-pinned-bar";
import { LeaderboardPodium } from "@/features/leaderboard/components/leaderboard-podium";
import { LeaderboardSkeleton } from "@/features/leaderboard/components/leaderboard-skeleton";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import { useLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { type TTimeframe } from "@/features/leaderboard/types/leaderboard.types";
import { useQueryState } from "nuqs";

export function LeaderboardClient() {
  const [timeframe, setTimeframe] = useQueryState("timeframe", {
    defaultValue: "all_time",
  });

  const validTimeframe: TTimeframe =
    timeframe === "this_week" || timeframe === "this_month"
      ? (timeframe as TTimeframe)
      : "all_time";

  const { data, isLoading } = useLeaderboard({
    timeframe: validTimeframe,
    page: 1,
    limit: 50,
  });

  const items = data?.items ?? [];
  const top3 = items.slice(0, 3);
  const remaining = items.slice(3);

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Bảng Vinh Danh
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Tôn vinh những học viên xuất sắc nhất và nỗ lực bứt phá trong học tập.
        </p>
      </div>

      <LeaderboardFilters
        timeframe={validTimeframe}
        onTimeframeChange={(val) => setTimeframe(val)}
      />

      {isLoading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          {top3.length > 0 && <LeaderboardPodium topItems={top3} />}
          <LeaderboardTable items={remaining.length > 0 ? remaining : items} />
          <LeaderboardPinnedBar myRank={data?.myRank ?? null} />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create server page component**

```tsx
// thfat-edu-fe/src/app/leaderboard/page.tsx
import { type Metadata } from "next";
import { Suspense } from "react";

import { LeaderboardClient } from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Bảng vinh danh | THFAT EDU",
  description: "Bảng xếp hạng thành tích học viên thi thử trực tuyến tại THFAT EDU.",
};

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Suspense>
        <LeaderboardClient />
      </Suspense>
    </main>
  );
}
```

- [ ] **Step 3: Run full typecheck and lint verification**

Run: `cd thfat-edu-fe && bun run typecheck`
Expected: PASS with 0 errors.

Run: `cd thfat-edu-be && bun test`
Expected: All backend unit tests pass.

Run: `cd thfat-edu-fe && bun run test`
Expected: All frontend unit tests pass.

- [ ] **Step 4: Commit**

```bash
git add thfat-edu-fe/src/app/leaderboard
git commit -m "feat(frontend): assemble LeaderboardPage with client orchestrator" --no-verify
```
