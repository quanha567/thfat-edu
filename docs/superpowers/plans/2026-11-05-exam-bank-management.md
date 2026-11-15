# Exam Bank Management (Ngân Hàng Đề) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai toàn diện tính năng Ngân hàng đề thi (`/admin/exams`) cho Giáo viên/Admin ThFat Edu, hỗ trợ cấu trúc đề thi chuẩn 150 điểm thô (4 dạng: Đúng/Sai, MCQs nhóm, Ghép hợp, Trả lời ngắn), cơ chế bóc tách tự động từ file PDF qua NVIDIA NIM Vision API, và giao diện biên tập đối chiếu song song (Side-by-side Review & Edit).

**Architecture:**

- Backend: ElysiaJS + Drizzle ORM (PostgreSQL) theo chuẩn module 4-file (`quizzes.model.ts`, `quizzes.service.ts`, `quizzes.routes.ts`, `index.ts`).
- AI Engine: `ExamParserProvider` tích hợp NVIDIA NIM API (`meta/llama-3.2-90b-vision-instruct` / `11b`) qua chuẩn OpenAI-compatible để trích xuất đề từ PDF.
- Frontend: Next.js 16 App Router với Thin Page Architecture tại `src/app/(admin)/admin/exams/`, module `src/features/exams/` với React Query hooks, KaTeX render công thức Hóa học, và PDF viewer song song.

**Tech Stack:** ElysiaJS, Drizzle ORM, PostgreSQL, NVIDIA NIM API, Next.js 16, React 19, Tailwind CSS, KaTeX/mhchem, React Query.

**Spec:** PRD (`docs/PRODUCT.md`), Design Decisions from `/grill-me` session.

## Global Constraints

- Backend module format: Exactly 4 files per feature (`<feature>.model.ts`, `<feature>.service.ts`, `<feature>.routes.ts`, `index.ts`).
- Response format: Flat data object on success; RFC 7807 Problem Details on failure.
- Coding style: `type` over `interface`, no `any` or `!`, max 3 parameters (or single options object), max 200 LOC per page/component.
- Frontend architecture: Thin Page Architecture in `src/app/(admin)/admin/exams/`, custom hooks in `src/features/exams/hooks/`, UI primitives in `src/components/ui/`.

---

## File Structure Map

```text
thfat-edu-be/
├── src/
│   ├── config/
│   │   └── env.ts                                 # Add NVIDIA_API_KEY, NVIDIA_MODEL, NVIDIA_BASE_URL
│   ├── db/
│   │   ├── schema/
│   │   │   ├── quizzes.ts                         # quizzes, quiz_sections, quiz_questions, quiz_sub_items
│   │   │   └── index.ts                           # Re-export quizzes schema
│   │   └── migrations/                            # Generated drizzle migration
│   └── modules/
│       └── quizzes/
│           ├── quizzes.model.ts                   # TypeBox DTO schemas for Quiz CRUD & Import
│           ├── exam-parser.service.ts             # NVIDIA NIM Vision PDF extraction service
│           ├── quizzes.service.ts                 # Database query & business logic
│           ├── quizzes.routes.ts                  # Elysia REST routes
│           ├── quizzes.test.ts                    # Unit & Integration tests for quizzes
│           └── index.ts                           # Module export
thfat-edu-fe/
├── src/
│   ├── features/
│   │   └── exams/
│   │       ├── types.ts                           # TypeScript types matching BE DTOs
│   │       ├── constants/
│   │       │   └── exam.constants.ts              # Section names, question types, scoring rules
│   │       ├── hooks/
│   │       │   ├── use-exams.ts                   # Query exams list
│   │       │   ├── use-exam-detail.ts             # Query single exam detail
│   │       │   ├── use-create-exam.ts             # Create / Import exam mutation
│   │       │   └── use-update-exam.ts             # Update exam & questions mutation
│   │       └── components/
│   │           ├── exam-list-table.tsx            # DataTable for /admin/exams
│   │           ├── exam-pdf-uploader.tsx          # Drag & drop upload dialog
│   │           ├── exam-editor-header.tsx         # Title, status toggle, save buttons
│   │           ├── exam-side-by-side.tsx          # Left: PDF viewer, Right: 4-Tab questions
│   │           ├── exam-section-tabs.tsx          # Tabs for 4 sections
│   │           ├── question-card-true-false.tsx   # Card for Part 1 (9 questions, 36 sub-items)
│   │           ├── question-card-group-mcq.tsx    # Card for Part 2 (6 groups, 24 sub-items)
│   │           ├── question-card-matching.tsx     # Card for Part 3 (5 matching questions)
│   │           └── question-card-short-answer.tsx # Card for Part 4 (5 short answer questions)
│   └── app/
│       └── (admin)/admin/exams/
│           ├── page.tsx                           # Main Exam Bank dashboard (<100 LOC)
│           ├── create/
│           │   └── page.tsx                       # Upload PDF & initiate import (<100 LOC)
│           └── [id]/
│               └── edit/
│                   └── page.tsx                   # Side-by-side Review & Edit workspace (<150 LOC)
```

---

## Tasks

### Task 1: Database Schema & Migration for Quizzes

**Files:**

- Create: `thfat-edu-be/src/db/schema/quizzes.ts`
- Modify: `thfat-edu-be/src/db/schema/index.ts`
- Test: Run migration generator `bun run db:generate`

**Interfaces:**

- Produces: `quizzes`, `quizSections`, `quizQuestions`, `quizSubItems` Drizzle table definitions and relations.

- [ ] **Step 1: Write Drizzle schema in `quizzes.ts`**
  - Define `quizzes` table (`id`, `title`, `description`, `duration_minutes` (default 50), `total_points` (default 150), `status` ('draft' | 'published' | 'archived'), `pdf_url`, `created_by`, `created_at`, `updated_at`).
  - Define `quiz_sections` table (`id`, `quiz_id`, `section_type` ('true_false' | 'group_mcq' | 'matching' | 'short_answer'), `title`, `order_index`).
  - Define `quiz_questions` table (`id`, `section_id`, `order_index`, `context_content`, `image_url`).
  - Define `quiz_sub_items` table (`id`, `question_id`, `order_index`, `label`, `content`, `correct_answer`, `acceptable_answers`, `points`).
  - Export relations using `relations()` from `drizzle-orm`.

- [ ] **Step 2: Export schema in `thfat-edu-be/src/db/schema/index.ts`**
  - Re-export all tables and relations.

- [ ] **Step 3: Generate migration and test**
  - Run: `cd thfat-edu-be && bun run db:generate`
  - Expected: New migration SQL generated in `src/db/migrations/`.

- [ ] **Step 4: Commit schema changes**
  - Commit message: `feat(db): add quizzes, sections, questions and sub-items schema`

---

### Task 2: Environment Config & NVIDIA NIM Vision Parser Service

**Files:**

- Modify: `thfat-edu-be/src/config/env.ts`
- Create: `thfat-edu-be/src/modules/quizzes/exam-parser.service.ts`
- Test: `thfat-edu-be/src/modules/quizzes/exam-parser.test.ts`

**Interfaces:**

- Consumes: `NVIDIA_API_KEY`, `NVIDIA_MODEL` from `env.ts`.
- Produces: `parseExamFromPdf(pdfBuffer: Buffer): Promise<TParsedExamData>`.

- [ ] **Step 1: Update `env.ts`**
  - Add `NVIDIA_API_KEY: t.Optional(t.String())`, `NVIDIA_MODEL: t.String({ default: "meta/llama-3.2-90b-vision-instruct" })`, `NVIDIA_BASE_URL: t.String({ default: "https://integrate.api.nvidia.com/v1" })`.

- [ ] **Step 2: Write failing test in `exam-parser.test.ts`**
  - Test that `parseExamFromPdf` validates schema and normalizes response into 4 sections, 25 questions, and 85 sub-items.

- [ ] **Step 3: Implement `exam-parser.service.ts`**
  - Use `unpdf` or lightweight PDF-to-image/text utility to convert PDF pages into vision input.
  - Call NVIDIA NIM OpenAI-compatible endpoint with strict prompt and structured JSON schema for 150-point format.
  - Return normalized exam structure.

- [ ] **Step 4: Run tests and verify passing**
  - Run: `cd thfat-edu-be && bun test src/modules/quizzes/exam-parser.test.ts`

- [ ] **Step 5: Commit changes**
  - Commit message: `feat(be): implement nvidia nim pdf exam parser service`

---

### Task 3: Backend Elysia Module for Quizzes (CRUD & Import)

**Files:**

- Create: `thfat-edu-be/src/modules/quizzes/quizzes.model.ts`
- Create: `thfat-edu-be/src/modules/quizzes/quizzes.service.ts`
- Create: `thfat-edu-be/src/modules/quizzes/quizzes.routes.ts`
- Create: `thfat-edu-be/src/modules/quizzes/quizzes.test.ts`
- Create: `thfat-edu-be/src/modules/quizzes/index.ts`
- Modify: `thfat-edu-be/src/index.ts`

**Interfaces:**

- Produces routes:
  - `GET /api/quizzes`: Paginated list of quizzes with status & counts.
  - `POST /api/quizzes`: Create draft quiz.
  - `POST /api/quizzes/import-pdf`: Upload PDF file and parse with NVIDIA Vision into draft quiz.
  - `GET /api/quizzes/:id`: Full quiz tree (sections, questions, sub-items).
  - `PUT /api/quizzes/:id`: Update quiz details and question tree.
  - `DELETE /api/quizzes/:id`: Delete quiz.

- [ ] **Step 1: Write `quizzes.model.ts`**
  - Define TypeBox schemas: `QuizListQuerySchema`, `CreateQuizSchema`, `UpdateQuizSchema`, `QuizDetailResponseSchema`.

- [ ] **Step 2: Write failing integration tests in `quizzes.test.ts`**
  - Test `GET /api/quizzes`, `POST /api/quizzes`, `GET /api/quizzes/:id`, `PUT /api/quizzes/:id`.

- [ ] **Step 3: Implement `quizzes.service.ts`**
  - Implement database queries using Drizzle: `listQuizzes`, `getQuizById`, `createQuiz`, `updateQuiz`, `deleteQuiz`.

- [ ] **Step 4: Implement `quizzes.routes.ts` and register in `src/index.ts`**
  - Wire routes with auth guard (only admin/teacher can manage quizzes).

- [ ] **Step 5: Run tests and ensure all pass**
  - Run: `cd thfat-edu-be && bun test src/modules/quizzes/quizzes.test.ts`

- [ ] **Step 6: Commit changes**
  - Commit message: `feat(be): add quizzes CRUD and import API routes`

---

### Task 4: Frontend Types, Constants & React Query Hooks

**Files:**

- Create: `thfat-edu-fe/src/features/exams/types.ts`
- Create: `thfat-edu-fe/src/features/exams/constants/exam.constants.ts`
- Create: `thfat-edu-fe/src/features/exams/hooks/use-exams.ts`
- Create: `thfat-edu-fe/src/features/exams/hooks/use-exam-detail.ts`
- Create: `thfat-edu-fe/src/features/exams/hooks/use-create-exam.ts`
- Create: `thfat-edu-fe/src/features/exams/hooks/use-update-exam.ts`
- Create: `thfat-edu-fe/src/features/exams/hooks/use-import-pdf.ts`

**Interfaces:**

- Produces: Typed hooks calling `/api/quizzes` endpoints with React Query caching & optimistic updates.

- [ ] **Step 1: Define TypeScript types in `types.ts`**
  - `TQuiz`, `TQuizSection`, `TQuizQuestion`, `TQuizSubItem`, `TQuizDetail`, `TExamFilterParams`.

- [ ] **Step 2: Define constants in `exam.constants.ts`**
  - `EXAM_SECTIONS`, `QUESTION_TYPE_LABELS`, `DEFAULT_DURATION_MINUTES = 50`, `MAX_RAW_SCORE = 150`.

- [ ] **Step 3: Implement React Query hooks**
  - `useExams()`, `useExamDetail(id)`, `useCreateExam()`, `useUpdateExam()`, `useImportPdf()`.

- [ ] **Step 4: Run typecheck**
  - Run: `cd thfat-edu-fe && bun run typecheck`

- [ ] **Step 5: Commit changes**
  - Commit message: `feat(fe): add exam bank types, constants, and react query hooks`

---

### Task 5: Frontend Exam Bank Dashboard View (`/admin/exams`)

**Files:**

- Create: `thfat-edu-fe/src/features/exams/components/exam-list-table.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/exam-metrics-bar.tsx`
- Create: `thfat-edu-fe/src/app/(admin)/admin/exams/page.tsx`
- Test: Visual & component unit test

- [ ] **Step 1: Implement `exam-metrics-bar.tsx`**
  - Summary cards: Total exams, Published exams, Draft exams, Total questions.

- [ ] **Step 2: Implement `exam-list-table.tsx`**
  - DataTable with title search, status badge (`DRAFT`, `PUBLISHED`, `ARCHIVED`), duration, questions count, actions dropdown (Edit, Preview, Delete).

- [ ] **Step 3: Implement Thin Page `src/app/(admin)/admin/exams/page.tsx`**
  - Keep under 100 LOC. Render header with "Nhập đề từ PDF" & "Tạo đề mới" buttons.

- [ ] **Step 4: Run typecheck and linting**
  - Run: `cd thfat-edu-fe && bun run typecheck && bun run lint`

- [ ] **Step 5: Commit changes**
  - Commit message: `feat(fe): implement admin exam bank list dashboard`

---

### Task 6: Frontend PDF Import Flow (`/admin/exams/create`)

**Files:**

- Create: `thfat-edu-fe/src/features/exams/components/exam-pdf-uploader.tsx`
- Create: `thfat-edu-fe/src/app/(admin)/admin/exams/create/page.tsx`

- [ ] **Step 1: Implement `exam-pdf-uploader.tsx`**
  - Drag & drop zone for `.pdf` files.
  - Progress indicator while NVIDIA Vision is analyzing and extracting 4 sections.
  - Error state handling with RFC 7807 problem details.

- [ ] **Step 2: Implement Thin Page `src/app/(admin)/admin/exams/create/page.tsx`**
  - On upload success, redirect immediately to `/admin/exams/[id]/edit` for review.

- [ ] **Step 3: Run typecheck and linting**
  - Run: `cd thfat-edu-fe && bun run typecheck`

- [ ] **Step 4: Commit changes**
  - Commit message: `feat(fe): add pdf exam uploader and import page`

---

### Task 7: Frontend Side-by-Side Review & Edit Workspace (`/admin/exams/[id]/edit`)

**Files:**

- Create: `thfat-edu-fe/src/features/exams/components/exam-side-by-side.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/exam-section-tabs.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/question-card-true-false.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/question-card-group-mcq.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/question-card-matching.tsx`
- Create: `thfat-edu-fe/src/features/exams/components/question-card-short-answer.tsx`
- Create: `thfat-edu-fe/src/app/(admin)/admin/exams/[id]/edit/page.tsx`

- [ ] **Step 1: Implement 4 Question Cards with KaTeX support**
  - `question-card-true-false.tsx`: 4 sub-items with True/False radio toggle.
  - `question-card-group-mcq.tsx`: Shared context + 4 MCQ choices per question.
  - `question-card-matching.tsx`: Left column vs Right column pairing.
  - `question-card-short-answer.tsx`: Direct input with accepted answers tags.

- [ ] **Step 2: Implement `exam-section-tabs.tsx` & `exam-side-by-side.tsx`**
  - Split view: Left = Native PDF Viewer (iframe/object or react-pdf), Right = 4-tab question editor.

- [ ] **Step 3: Implement Thin Page `src/app/(admin)/admin/exams/[id]/edit/page.tsx`**
  - Keep under 150 LOC. Provide Save Draft and Publish action buttons.

- [ ] **Step 4: Run typecheck and linting**
  - Run: `cd thfat-edu-fe && bun run typecheck && bun run lint`

- [ ] **Step 5: Commit changes**
  - Commit message: `feat(fe): implement side-by-side exam review and editor workspace`

---

### Task 8: Verification & End-to-End Walkthrough

**Files:**

- Test all backend endpoints with test suites.
- Test frontend build and run linting.

- [ ] **Step 1: Backend full verification**
  - Run: `cd thfat-edu-be && bun test && bun run typecheck && bun run lint`

- [ ] **Step 2: Frontend full verification**
  - Run: `cd thfat-edu-fe && bun test && bun run typecheck && bun run lint && bun run build`

- [ ] **Step 3: Commit final verification**
  - Commit message: `chore: verify exam bank end-to-end integration`
