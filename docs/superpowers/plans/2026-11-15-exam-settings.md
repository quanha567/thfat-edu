# General Settings & Exam Rules (Cấu hình chung & Quy chế khảo thí) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai trang Cấu hình chung (`/admin/settings`) cho phép Quản trị viên thiết lập quy chế khảo thí mặc định toàn hệ thống (số lần thi tối đa, chính sách lấy điểm khi thi nhiều lần, thời gian nghỉ giữa các lần thi, quy định xem điểm và đáp án chi tiết), hỗ trợ cơ chế kế thừa linh hoạt cho từng đề thi, và kiểm soát chặt chẽ lượt thi của học sinh ở cả trang danh sách đề thi lẫn khi vào phòng thi.

**Architecture:**
- **Backend (`thfat-edu-be` - ElysiaJS + Drizzle ORM + PostgreSQL)**:
  - Bảng mới `system_settings`: lưu trữ cấu hình key-value dạng JSONB (`key = "exam_config"`).
  - Bảng `quizzes`: bổ sung các cột nullable (`max_attempts`, `score_policy`, `cooldown_minutes`, `show_score_immediately`, `show_explanation_policy`) để hỗ trợ đề thi override riêng; nếu `null` sẽ tự động kế thừa cấu hình chung.
  - Module mới `settings`: 4 files chuẩn (`settings.model.ts`, `settings.service.ts`, `settings.routes.ts`, `index.ts`) cung cấp API `GET /api/admin/settings/exam` và `PUT /api/admin/settings/exam` (yêu cầu role `admin`).
  - Cập nhật module `attempts`:
    - `listStudentExams`: tính toán và trả về `maxAttempts`, `attemptCount`, `canTakeExam`, `cooldownRemainingSeconds`, `displayScore`.
    - `startOrResumeAttempt`: kiểm tra số lần thi đã hoàn thành và thời gian cooldown trước khi cấp phép bắt đầu lượt thi mới.
    - `getAttemptResult`: tuân thủ chính sách `showExplanationPolicy` (ẩn đáp án/lời giải nếu cấu hình là `'never'`).
- **Frontend (`thfat-edu-fe` - Next.js 16 App Router + React 19 + shadcn/ui)**:
  - Feature mới `src/features/settings`: React Query hooks (`use-exam-settings.ts`, `use-update-exam-settings.ts`), Zod schema, component `ExamSettingsForm` với 2 card trực quan (Lượt thi & Kết quả thi), dirty check và thông báo Toast.
  - Trang quản trị `/admin/settings` (`src/app/(admin)/admin/settings/page.tsx`): sử dụng `AdminPageHeader` và nhúng form cài đặt.
  - Cập nhật danh sách đề thi học sinh (`src/features/exams`): hiển thị badge số lần thi (VD: "Đã thi 1/2 lần", "Hết lượt thi", đếm ngược cooldown) và kiểm soát nút vào thi.

**Tech Stack:** Bun, ElysiaJS, Drizzle ORM, PostgreSQL, Next.js 16, React 19, Tailwind CSS v4, TanStack Query, React Hook Form, Zod, Lucide React.

---

## Global Constraints

- Adhere strictly to [CODING_STANDARDS.md](file:///d:/projects/thfat-edu/CODING_STANDARDS.md).
- `type` over `interface`.
- No `any` or `!`.
- Max 3 parameters per function (use typed options object for >3).
- Guard clauses with early returns (max nesting depth $\le 3$).
- Function exports: `export function functionName()`.
- Generic types prefixed with `T` (e.g. `TExamSettings`).
- Backend responses: flat data objects, errors formatted as RFC 7807 Problem Details.
- Frontend: Max 200 lines per component/page, custom hooks in `src/features/<feature>/hooks/`.

---

### Task 1: Database Schema & Migration (`thfat-edu-be`)

**Files:**
- Create: `thfat-edu-be/src/db/schema/settings.ts`
- Modify: `thfat-edu-be/src/db/schema/quizzes.ts`
- Modify: `thfat-edu-be/src/db/schema/index.ts`

**Interfaces:**
- Produces:
  - Table: `systemSettings` (`key` varchar(64) PK, `value` jsonb notNull, `category` varchar(64) notNull, `description` text, `updatedBy` uuid references users, `updatedAt` timestamp).
  - Columns in `quizzes`: `maxAttempts` (integer nullable), `scorePolicy` (varchar(32) nullable), `cooldownMinutes` (integer nullable), `showScoreImmediately` (boolean nullable), `showExplanationPolicy` (varchar(32) nullable).
  - Types: `TSystemSetting`, `TNewSystemSetting`.

- [x] **Step 1: Create `thfat-edu-be/src/db/schema/settings.ts` with Drizzle schema and types**
- [x] **Step 2: Add nullable override columns to `quizzes` in `thfat-edu-be/src/db/schema/quizzes.ts`**
- [x] **Step 3: Export settings schema and relations in `thfat-edu-be/src/db/schema/index.ts`**
- [x] **Step 4: Generate migration using `bun run db:generate` or verify schema builds with `bun run typecheck`**

---

### Task 2: Backend Settings Module (`thfat-edu-be`)

**Files:**
- Create: `thfat-edu-be/src/modules/settings/settings.model.ts`
- Create: `thfat-edu-be/src/modules/settings/settings.service.ts`
- Create: `thfat-edu-be/src/modules/settings/settings.routes.ts`
- Create: `thfat-edu-be/src/modules/settings/index.ts`
- Modify: `thfat-edu-be/src/index.ts`
- Create: `thfat-edu-be/src/modules/settings/settings.test.ts`

**Interfaces:**
- TypeBox schemas:
  - `ExamSettingsSchema`:
    - `maxAttempts`: `t.Number({ minimum: 0, default: 1 })` (0 = không giới hạn)
    - `scorePolicy`: `t.Union([t.Literal("highest"), t.Literal("latest")])`
    - `cooldownMinutes`: `t.Number({ minimum: 0, default: 0 })`
    - `showScoreImmediately`: `t.Boolean({ default: true })`
    - `showExplanationPolicy`: `t.Union([t.Literal("immediately"), t.Literal("exam_closed"), t.Literal("never")])`
  - `UpdateExamSettingsSchema`: cùng schema nhưng dùng để cập nhật.
- Endpoints:
  - `GET /api/admin/settings/exam`: lấy cấu hình thi hiện tại (hoặc trả default nếu chưa có).
  - `PUT /api/admin/settings/exam`: cập nhật cấu hình thi (yêu cầu role `admin`).

- [x] **Step 1: Write failing integration test in `settings.test.ts`**
- [x] **Step 2: Implement `settings.model.ts` with TypeBox schemas and default constants**
- [x] **Step 3: Implement `settings.service.ts` with `getExamSettings` and `updateExamSettings`**
- [x] **Step 4: Implement `settings.routes.ts` with auth and admin role check**
- [x] **Step 5: Register settings module in `thfat-edu-be/src/index.ts`**
- [x] **Step 6: Run `bun test src/modules/settings/settings.test.ts` and verify it passes**

---

### Task 3: Backend Attempts Service Updates for Exam Rules (`thfat-edu-be`)

**Files:**
- Modify: `thfat-edu-be/src/modules/attempts/attempts.model.ts`
- Modify: `thfat-edu-be/src/modules/attempts/attempts.service.ts`
- Modify: `thfat-edu-be/src/modules/attempts/attempts.routes.test.ts`

**Interfaces:**
- Update `TStudentExamListItem`:
  - `maxAttempts`: number | null
  - `attemptCount`: number
  - `canTakeExam`: boolean
  - `cooldownRemainingSeconds`: number
  - `displayScore`: string | null
- In `AttemptsService`:
  - Inject or load `SettingsService` to resolve `effectiveMaxAttempts`, `effectiveScorePolicy`, `effectiveCooldownMinutes`, `effectiveShowExplanationPolicy`.
  - In `listStudentExams`: compute `attemptCount`, `canTakeExam`, `cooldownRemainingSeconds`, and calculate `displayScore` (highest vs latest).
  - In `startOrResumeAttempt`: check if user has active in-progress attempt (resume it); otherwise check if `attemptCount >= effectiveMaxAttempts` (block if exceeded); check cooldown elapsed since last submitted attempt.
  - In `getAttemptResult`: if `effectiveShowExplanationPolicy === "never"`, omit/mask correct answers and explanations.

- [x] **Step 1: Add new fields to `attempts.model.ts` schemas**
- [x] **Step 2: Update `listStudentExams` logic in `attempts.service.ts`**
- [x] **Step 3: Update `startOrResumeAttempt` logic in `attempts.service.ts` to allow multiple attempts up to `maxAttempts` and enforce cooldown**
- [x] **Step 4: Update `getAttemptResult` in `attempts.service.ts` to respect `showExplanationPolicy`**
- [x] **Step 5: Run tests `bun test src/modules/attempts` and verify everything passes**

---

### Task 4: Frontend Settings Feature & Admin Page (`thfat-edu-fe`)

**Files:**
- Create: `thfat-edu-fe/src/features/settings/types/settings.types.ts`
- Create: `thfat-edu-fe/src/features/settings/schemas/exam-settings.schema.ts`
- Create: `thfat-edu-fe/src/features/settings/hooks/use-exam-settings.ts`
- Create: `thfat-edu-fe/src/features/settings/hooks/use-update-exam-settings.ts`
- Create: `thfat-edu-fe/src/features/settings/components/exam-settings-form.tsx`
- Create: `thfat-edu-fe/src/features/settings/index.ts`
- Create: `thfat-edu-fe/src/app/(admin)/admin/settings/page.tsx`

**Components:**
- `ExamSettingsForm`:
  - Card 1: "Quy định lượt thi" (Input `maxAttempts` kèm toggle "Không giới hạn", Select `scorePolicy`, Input `cooldownMinutes`).
  - Card 2: "Quy định công bố kết quả" (Switch `showScoreImmediately`, Select `showExplanationPolicy`).
  - Actions bar: Nút "Hủy thay đổi" (reset), Nút "Lưu thay đổi" (với icon Loader khi pending, toast thông báo khi thành công).
- Page `/admin/settings`:
  - Render `AdminPageHeader` với title "Cấu hình chung", description "Quản lý quy chế khảo thí và các tham số vận hành hệ thống".
  - Render `ExamSettingsForm`.

- [x] **Step 1: Create types and Zod schema in `features/settings`**
- [x] **Step 2: Implement React Query hooks `useExamSettings` and `useUpdateExamSettings`**
- [x] **Step 3: Implement `ExamSettingsForm` component with shadcn/ui cards, form controls, and validation**
- [x] **Step 4: Create thin page `src/app/(admin)/admin/settings/page.tsx`**
- [x] **Step 5: Verify build with `pnpm --filter thfat-edu-fe build` or `pnpm typecheck`**

---

### Task 5: Frontend Student Exam List Integration (`thfat-edu-fe`)

**Files:**
- Modify: `thfat-edu-fe/src/features/exams/types/exams.types.ts` (or relevant attempt types)
- Modify: `thfat-edu-fe/src/features/exams/components/exam-card.tsx` (or student exam listing cards)

**UX Details:**
- Display attempt count badge: e.g. "Đã thi: 1/2 lần" or "Không giới hạn lượt thi".
- Display score according to `displayScore`.
- If `canTakeExam === false`:
  - If cooldown active: Show badge/button "Chờ X phút để thi lại".
  - If max attempts reached: Show badge "Đã hết lượt thi", disable enter button.

- [x] **Step 1: Update frontend exam types to receive attempt counts and cooldown info**
- [x] **Step 2: Update exam card component to render attempt badge and handle disabled state**
- [x] **Step 3: Test exam card UI states (chưa thi, còn lượt, đang cooldown, hết lượt)**

---

### Task 6: End-to-End Verification

- [x] **Step 1: Run typecheck and linting on both frontend and backend (`bun run typecheck`, `pnpm typecheck`)**
- [x] **Step 2: Verify Admin can navigate to `/admin/settings`, modify settings, and persist them**
- [x] **Step 3: Verify Student exam list reflects the new attempt limits and enforces the rules**
