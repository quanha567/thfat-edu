# Leaderboard Feature Design Specification

- **Date**: 2026-11-16
- **Status**: Approved
- **Topic**: Leaderboard Feature (Global & Quiz-Specific)

---

## 1. Overview & Goals

The Leaderboard feature introduces a competitive and motivating experience for students on the `thfat-edu` platform. It provides rankings based on quiz performance across configurable time windows, with both platform-wide (Global) and exam-specific rankings.

### Primary Objectives
- Allow students to see rankings across three timeframes: **This Week**, **This Month**, and **All Time**.
- Support two distinct view modes:
  1. **Global Leaderboard**: Aggregates top scores across all quizzes taken by students.
  2. **Quiz-Specific Leaderboard**: Ranks students by their best score and fastest completion time on a specific quiz.
- Provide personalized feedback by pinning the logged-in user's rank (`My Rank`) at the bottom of the viewport when they are not in the currently displayed list.
- Keep implementation lightweight, robust, and performant using PostgreSQL indexed queries, CTE window functions, and short-term cache (YAGNI principle).

---

## 2. Backend Design (`thfat-edu-be`)

### 2.1 Database Optimization
Add composite indexes on `exam_attempts` to optimize leaderboard window aggregations:
```sql
CREATE INDEX IF NOT EXISTS idx_exam_attempts_leaderboard 
ON exam_attempts (status, submitted_at, quiz_id, user_id, score);
```

### 2.2 Ranking Calculation Rules
- **Global Leaderboard**:
  - For each user and each quiz, select their highest score (`MAX(score)`) and fastest completion time (`MIN(EXTRACT(EPOCH FROM (submitted_at - started_at)))`) within the selected timeframe.
  - Sum the highest scores across distinct quizzes: `totalScore = SUM(highest_score)`.
  - Tie-breaking hierarchy:
    1. Highest `totalScore` DESC
    2. Lowest `totalDurationSeconds` ASC
    3. Most recent `submittedAt` ASC
  - Rank assignment: `DENSE_RANK() OVER (ORDER BY total_score DESC, total_duration ASC)`
- **Quiz-Specific Leaderboard**:
  - Filter `quiz_id = :quizId`.
  - Take the best score per user for that quiz.
  - Rank by `score DESC`, then `duration ASC`.

### 2.3 Module Architecture (`src/modules/leaderboard/`)
Following repo standards:
- `leaderboard.model.ts`:
  - Request DTOs:
    - `TTimeframe = 'this_week' | 'this_month' | 'all_time'`
    - Query Schema: `timeframe` (optional, default `all_time`), `page` (default 1), `limit` (default 20, max 50).
  - Response DTOs:
    - `TLeaderboardItem`: `{ rank: number, userId: string, fullName: string, avatarUrl: string | null, schoolName: string | null, totalScore: number, totalExams: number, totalDurationSeconds: number }`
    - `TLeaderboardResponse`: `{ items: TLeaderboardItem[], total: number, page: number, limit: number, myRank: TLeaderboardItem | null }`
- `leaderboard.service.ts`:
  - `getGlobalLeaderboard(timeframe: TTimeframe, page: number, limit: number, currentUserId?: string): Promise<TLeaderboardResponse>`
  - `getQuizLeaderboard(quizId: string, timeframe: TTimeframe, page: number, limit: number, currentUserId?: string): Promise<TLeaderboardResponse>`
- `leaderboard.routes.ts`:
  - `GET /api/v1/leaderboard` -> Global Leaderboard
  - `GET /api/v1/leaderboard/quizzes/:quizId` -> Quiz Leaderboard
  - Optional auth context extraction (unauthenticated guests can still read top ranks, but `myRank` will be `null`).
- `index.ts`:
  - Exports Elysia plugin registering the routes.

---

## 3. Frontend Design (`thfat-edu-fe`)

### 3.1 Routing & URL State
- Route: `/leaderboard` (`src/app/leaderboard/page.tsx`)
- Server Component wrapper with client orchestrator (`leaderboard-client.tsx`).
- URL synchronization via `nuqs`:
  - `tab`: `global` | `quiz` (default `global`)
  - `quizId`: `string` (optional, when `tab=quiz`)
  - `timeframe`: `this_week` | `this_month` | `all_time` (default `all_time`)
  - `page`: number (default 1)

### 3.2 Feature Components (`src/features/leaderboard/`)
- `components/leaderboard-podium.tsx`:
  - Visual display for Top 1, 2, and 3.
  - Center: 1st place with gold badge, crown accent, and avatar.
  - Left: 2nd place (silver badge).
  - Right: 3rd place (bronze badge).
  - Displays name, school, score, and exam count.
- `components/leaderboard-table.tsx`:
  - Clean list for ranks 4 and below.
  - Columns: Rank, Student (avatar + full name + school), Exams Taken, Duration, Total Score.
  - Pagination controls (`limit = 20`).
- `components/leaderboard-pinned-bar.tsx`:
  - Fixed bottom bar (`fixed bottom-0 left-0 right-0 z-30`).
  - Displays logged-in student's avatar, current rank badge (e.g. `#42`), total score, and gap to next rank.
  - Automatically hidden if student's row is visible in the current viewport or if student hasn't taken any exams.
- `components/leaderboard-filters.tsx`:
  - Segmented control / Tabs for Global vs. Quiz filter.
  - Segmented control for `This Week` | `This Month` | `All Time`.
- `components/leaderboard-skeleton.tsx`:
  - Loading skeleton matching podium and table layouts.
- `hooks/use-leaderboard.ts`:
  - React Query wrapper with 60-second stale time for leaderboard data.
- `leaderboard.constants.ts`:
  - Labels, timeframe values, rank styling colors and badges.

### 3.3 Navigation Integration
- Add "Bảng xếp hạng" (Leaderboard) nav item in the student navigation header / sidebar with trophy icon (`Trophy` from `lucide-react`).

---

## 4. Edge Cases & Handling
- **No attempts completed yet**: Display an inspiring empty state ("Chưa có ai hoàn thành bài thi trong khoảng thời gian này. Hãy là người đầu tiên bứt phá!").
- **Guest users (not logged in)**: Leaderboard renders normally, `myRank` is omitted, and pinned bar shows a "Đăng nhập để xem vị trí của bạn" CTA or is hidden.
- **Tied scores**: Handled consistently by tie-breaking on total completion duration, followed by submission timestamp.
- **Students with multiple attempts on same quiz**: Only the attempt with the highest score is included in the global sum.

---

## 5. Testing & Verification Plan
- **Backend Tests**:
  - Unit tests for `leaderboard.service.test.ts` asserting correct DENSE_RANK assignment, score aggregation across distinct quizzes, and tie-breaking.
  - Integration test for `GET /api/v1/leaderboard` with and without auth headers.
- **Frontend Verification**:
  - Component rendering tests for Podium and Table.
  - Verification with various timeframe filters and empty state.
  - Typecheck and lint pass (`bun run lint`, `bun run typecheck`).
