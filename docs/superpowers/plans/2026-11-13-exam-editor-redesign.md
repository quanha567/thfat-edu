# Exam Editor Redesign & Code Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the entire V-SAT Exam Editor interface (`features/exams/components/editor/`) to strictly follow the Design System (shadcn/ui primitives, Tailwind v4 tokens, a11y, consistent UI hierarchy) and monorepo coding standards (max 200 lines/file, strict TypeScript, no raw HTML form controls).

**Architecture:** Component modularization following the 3-tier tree architecture. Extract sub-item rows where necessary to keep all files strictly under 200 lines. Replace raw form controls (`<select>`, raw `<span>` labels) with shadcn primitives (`Select`, `Label`, `Tooltip`, `AlertDialog`). Enrich TOC with active question tracking and clean visual status indicators.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn/ui (Radix UI), Lucide React, Bun, Oxlint.

**Spec:** User requirement to redesign the entire Exam Editor page to follow design system and coding conventions.

---

### File Structure Map

```
thfat-edu-fe/src/features/exams/components/editor/
├── exam-editor-header.tsx               # (Modify) Top navigation bar, dirty status badge, preview & save actions with tooltips
├── exam-editor-overview-card.tsx        # (Modify) General exam metadata, shadcn Select, Labels, 2-column grid
├── question-editor-card-header.tsx      # (Modify) Card header with points badge, action tooltips, delete AlertDialog
├── exam-markdown-editor.tsx             # (Modify) Markdown editor with tabs/segmented control, math snippets, preview empty state
├── exam-editor-toc.tsx                  # (Modify) Sidebar navigation, question grid with error badges, scroll-spy highlight
├── section-editor-true-false.tsx        # (Modify) Section 1 editor: True/False statements with semantic toggle buttons
├── section-editor-mcq.tsx               # (Modify) Section 2 editor: Group MCQ with context and sub-questions
├── section-editor-mcq-item.tsx          # (Create) Extracted sub-item row for MCQ to ensure file length <= 200 lines
├── section-editor-matching.tsx          # (Modify) Section 3 editor: Matching pairs with clean side-by-side connector layout
├── section-editor-short-answer.tsx      # (Modify) Section 4 editor: Short answer with acceptable answer pills
└── exam-editor-container.tsx            # (Modify) Layout orchestrator, sticky TOC, section cards, responsive spacing
```

---

### Task Decomposition

#### Task 1: Refactor `ExamEditorHeader` & `ExamEditorOverviewCard`

- **Files to modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/exam-editor-header.tsx`
  - `thfat-edu-fe/src/features/exams/components/editor/exam-editor-overview-card.tsx`
- **Requirements**:
  - `ExamEditorHeader`:
    - Wrap action buttons in `TooltipProvider` / `Tooltip` (Quay lại, Xem trước, Lưu thay đổi).
    - Replace hardcoded badge colors with standard badge variants or clean semantic border/backgrounds.
    - Ensure clean sticky top positioning with backdrop-blur.
  - `ExamEditorOverviewCard`:
    - Replace native `<select>` with `@/components/ui/select` (`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`).
    - Replace raw `<span>` with `@/components/ui/label` (`Label`) linked via proper IDs.
    - Keep file length $\le 200$ lines.
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint`.

#### Task 2: Refactor `QuestionEditorCardHeader` with Delete Confirmation & Tooltips

- **Files to modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/question-editor-card-header.tsx`
- **Requirements**:
  - Wrap action icons (Lên, Xuống, Nhân bản, Đính kèm ảnh) with `Tooltip`s for clear affordance and a11y.
  - Integrate `AlertDialog` for the delete action:
    - Clicking the trash button triggers an `AlertDialog` confirming: "Bạn có chắc chắn muốn xóa câu này? Hành động này không thể hoàn tác."
    - Confirmation calls `onDelete()`, cancel dismisses dialog.
  - Polish the Question badge (e.g. `Câu {questionNumber}` in primary soft badge) and Points badge.
  - Ensure file length $\le 200$ lines.
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint`.

#### Task 3: Refactor `ExamMarkdownEditor`

- **Files to modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/exam-markdown-editor.tsx`
- **Requirements**:
  - Clean tab switcher between "Soạn thảo" (Write) and "Xem trước" (Preview) with subtle active background.
  - Use `Label` for the editor label.
  - Clean toolbar for LaTeX / Chemistry math snippets with subtle icons or compact buttons.
  - In Preview mode, render `ChemRenderer` with an empty state placeholder if empty (`Chưa có nội dung để hiển thị`).
  - Ensure file length $\le 200$ lines.
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint`.

#### Task 4: Refactor Section Editors (True/False & MCQ)

- **Files to create/modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/section-editor-true-false.tsx`
  - `thfat-edu-fe/src/features/exams/components/editor/section-editor-mcq-item.tsx` (new component)
  - `thfat-edu-fe/src/features/exams/components/editor/section-editor-mcq.tsx`
- **Requirements**:
  - `section-editor-true-false.tsx`:
    - True/False toggles: create distinct visual toggle button states ("Đúng" = emerald/teal variant when selected; "Sai" = rose/red variant when selected).
    - Use `Label` for form fields.
  - `section-editor-mcq-item.tsx`:
    - Extract sub-item question row with 4 options (A, B, C, D) and radio selector for correct option.
    - Keeps parent file under 200 lines and adheres to single responsibility.
  - `section-editor-mcq.tsx`:
    - Clean context editor + sub-item list.
  - Ensure all files are $\le 200$ lines, strictly typed, no `any`.
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint`.

#### Task 5: Refactor Section Editors (Matching & Short Answer)

- **Files to modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/section-editor-matching.tsx`
  - `thfat-edu-fe/src/features/exams/components/editor/section-editor-short-answer.tsx`
- **Requirements**:
  - `section-editor-matching.tsx`:
    - Two-column card layout for matching pairs: Left side (Thông tin vế trái) and Right side (Thông tin vế phải ghép đôi).
    - Visual connection indicator between the two halves.
    - Delete pair button with ghost destructive style.
  - `section-editor-short-answer.tsx`:
    - Primary answer input with clear label.
    - Acceptable answers list shown as removable `Badge` pills with an add input, or comma-separated field with helper text and live preview badges.
  - Ensure all files are $\le 200$ lines.
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint`.

#### Task 6: Refactor `ExamEditorToc` & `ExamEditorContainer`

- **Files to modify**:
  - `thfat-edu-fe/src/features/exams/components/editor/exam-editor-toc.tsx`
  - `thfat-edu-fe/src/features/exams/components/editor/exam-editor-container.tsx`
- **Requirements**:
  - `ExamEditorToc`:
    - Add active question state tracking (highlight question button when clicked or scrolled to).
    - Use clean semantic badges for total questions and validation status (warning for error items with subtle ping/dot, checkmark for complete items).
    - Smooth scroll to question card on click.
  - `ExamEditorContainer`:
    - Polish section headers: section type icon, title, description, points badge, count badge.
    - Add question button with dashed border and clean hover transition.
    - Responsive layout (grid layout, sticky TOC).
  - Verify all files adhere to coding standards ($\le 200$ lines, exactly 1 blank line after imports, blank line before returns).
- **Verification**: Run `bun --filter thfat-edu-fe typecheck` and `bun --filter thfat-edu-fe lint` and verify entire project builds cleanly.
