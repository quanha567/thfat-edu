# Coding Standards & Conventions

This document defines the engineering standards, architecture patterns, naming conventions, and best practices across the **thfat-edu** monorepo (`thfat-edu-fe`, `thfat-edu-be`, and shared packages).

---

## 1. Monorepo Architecture & Organization

### 1.1 Monorepo Layout

We use **Bun Workspaces** for multi-package management:

```
thfat-edu/
├── packages/
│   └── shared/                 # Shared domain types, utility types, and pure helpers
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── types/          # Common types (Maybe, Nullable, OnChange, etc.)
│           └── utils/          # Pure shared utils (formatters, dates)
├── thfat-edu-be/               # Backend (ElysiaJS, Drizzle ORM, PostgreSQL, Bun)
├── thfat-edu-fe/               # Frontend (Next.js 16 App Router, React 19, Tailwind v4)
├── docs/                       # Architecture Decision Records (ADRs) and deployment docs
├── GLOSSARY.md                 # Domain vocabulary (Vietnamese)
├── CODING_STANDARDS.md         # This specification
├── AGENTS.md                   # AI Agent guidance rules
└── package.json                # Root package configuration
```

### 1.2 Git & Branching Strategy: Git Flow

- **Branches**:
  - `main`: Production-ready code only.
  - `develop`: Integration branch for day-to-day development.
  - Feature branches: branched off `develop`.
  - Release branches: branched off `develop`, merged into `main` and `develop`.
  - Hotfix branches: branched off `main`, merged into `main` and `develop`.
- **Branch Naming**: `<type>/<short-description>` (kebab-case)
  - Examples: `feat/quiz-builder`, `fix/auth-refresh-race`, `chore/oxlint-update`
- **Commit Messages**: Conventional Commits specification.
  - Format: `<type>(<scope>): <short summary>`
  - Scopes: `fe`, `be`, `shared`, `repo`, `deps`, `docs`, `ci`, `config`

---

## 2. Shared Types & Common Utilities

All cross-boundary types and non-framework utilities belong in `packages/shared`.

### 2.1 Standard Utility Types

```ts
// packages/shared/src/types/common.ts

// Nullability & Optionals
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type Optional<T> = T | null | undefined;

// Async & Functions
export type Callback<TArgs extends unknown[] = [], TReturn = void> = (...args: TArgs) => TReturn;
export type AsyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
  ...args: TArgs
) => Promise<TReturn>;
export type Predicate<T> = (value: T) => boolean;

// Generic Object & Dictionaries
export type Dictionary<T = unknown> = Record<string, T>;
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// Pagination & Responses
export type PaginationQuery = {
  page: number;
  limit: number;
};

export type PaginatedResponse<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
};

// RFC 7807 Problem Details
export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
};
```

### 2.2 Standard UI Event Types (Frontend & Shared)

```ts
// packages/shared/src/types/events.ts
import type { ReactNode } from "react";

import type { Nullable, Maybe } from "./common";

// Event and UI Action Callbacks
export type OnPress<TReturn = void> = () => TReturn;

// Flexible OnChange: supports single value, multi-args tuple, and custom return types
export type OnChange<TArgs = unknown, TReturn = void> = (
  ...args: TArgs extends unknown[] ? TArgs : [value: TArgs]
) => TReturn;

export type OnKeyValueChange<K extends string = string, V = unknown, TReturn = void> = (
  key: K,
  value: V,
) => TReturn;
export type OnSelect<TItem, TReturn = void> = (item: TItem) => TReturn;

// UI Component Props Helpers
export type WithChildren<P = unknown> = P & { children: ReactNode };
export type WithClassName<P = unknown> = P & { className?: string };
```

### 2.3 Generics Naming Rule

- Prefix all type parameters with `T` in `PascalCase`: `TItem`, `TResponse`, `TValue`, `TContext`.
- For standard map keys and values: `K` and `V` or `TKey` and `TValue`.

---

## 3. General TypeScript & Code Quality Rules

### 3.1 Strict Typing Standards

1. **Always use `type` instead of `interface`** unless declaration merging is required.
   ```ts
   // ✅ Good
   export type UserProfile = {
     id: string;
     email: string;
   };

   // ❌ Bad
   export interface UserProfile {
     id: string;
   }
   ```
2. **Explicitly ban `any`**: Always use `unknown` and type narrowing (type guards, `instanceof`, Zod/TypeBox).
3. **No Non-Null Assertions (`!`)**: Use explicit guards, default fallbacks, or throw standard errors.
4. **Use `import type`**: Always specify `import type { ... }` for purely type-level imports.
5. **No `React` Namespace Imports**: Never use the global `React.*` namespace (e.g. `React.FC`, `React.ReactNode`, `React.useState`, `React.ChangeEvent`). Always use named imports directly:
   ```ts
   // ✅ Good
   import { useState, type ReactNode, type ChangeEvent } from "react";
   // ❌ Bad
   import React from "react";
   type Props = { children: React.ReactNode };
   ```

### 3.2 Functions & Clean Code

1. **Function Declarations over Arrow Functions for Exports**:
   ```ts
   // ✅ Good
   export function calculateScore(items: QuizItem[]): number { ... }

   // ❌ Bad (for top-level utilities)
   export const calculateScore = (items: QuizItem[]): number => { ... };
   ```
2. **Parameter Limit (Max 3)**:
   - If a function needs more than 3 arguments, collapse them into a typed options object.
   ```ts
   // ✅ Good
   export function createUser({ name, email, role, sendWelcomeEmail }: CreateUserOptions) { ... }

   // ❌ Bad
   export function createUser(name: string, email: string, role: Role, sendWelcomeEmail: boolean) { ... }
   ```
3. **Guard Clauses & Early Returns**:
   - Keep the happy path at 0 indent levels. Maximum nesting depth is 3.
   ```ts
   // ✅ Good
   export function processOrder(order?: Order) {
     if (!order) return;
     if (!order.isValid) throw new ValidationError("Invalid order");
     // Happy path
   }
   ```
4. **Strong Immutability**:
   - `const` everywhere. `let` is permitted only when variable reassignment is unavoidable.
   - Prefer `map`, `filter`, `reduce`, object spread `{ ...obj }` over in-place mutations.
5. **Async Handling**:
   - Always `async/await`. Avoid `.then()` chains.
6. **Enums Policy**:
   - Use union types for simple enumerations (`type Role = "student" | "teacher" | "admin"`).
   - Use `const` objects with `as const` when iterating over keys/values or runtime lookups are needed.
7. **Date Handling**:
   - Use `date-fns` for date manipulation.
   - Store all dates in UTC (ISO 8601 strings or timestamp with timezone in PostgreSQL).
   - Convert to local client timezone only in the UI display layer.

### 3.3 Vertical Whitespace & Line Spacing

Code must be structured into readable, scannable logical paragraphs:

1. **Newline After Imports**: Always separate the import block from code statements with exactly 1 blank line (enforced by `import/newline-after-import`).
2. **Blank Line Before `return`**: Always insert a blank line before `return` statements when preceded by logical code (single-expression guard clauses are exempt).
   ```ts
   // ✅ Good
   const score = computeScore(items);
   const bonus = calculateBonus(score);

   return score + bonus;
   ```
3. **Blank Line Between Declarations**: Separate top-level functions, type aliases, classes, and exported constants by exactly 1 blank line.
4. **Logical Paragraphs Inside Functions**: Use blank lines to separate guard clauses, step-by-step logic transforms, and side effects.
5. **Max 1 Consecutive Blank Line**: Never leave 2 or more consecutive blank lines anywhere in the codebase.

---

## 4. Backend Conventions (`thfat-edu-be`)

### 4.1 Module Architecture

Backend features are grouped under `src/modules/<feature>/` with a strict 4-file structure:

```
src/modules/<feature>/
├── <feature>.model.ts     # TypeBox schemas (t.Object({...})) for request & response
├── <feature>.service.ts   # Business logic and Elysia service plugin via decorate/derive
├── <feature>.routes.ts    # Elysia route handlers consuming ctx.<feature>Service
└── index.ts               # Barrel exporting the composed feature plugin
```

### 4.2 Elysia Context Dependency Injection

Services must be registered onto the Elysia instance using `.decorate()` or `.derive()` so that route handlers retrieve them directly from `context`.

```ts
// src/modules/user/user.service.ts
import { Elysia } from "elysia";

export const userServicePlugin = new Elysia({ name: "user-service" })
  .decorate("userService", {
    async findById(id: string) { ... },
    async update(id: string, data: UpdateUserInput) { ... },
  });

// src/modules/user/user.routes.ts
import { Elysia } from "elysia";
import { userServicePlugin } from "./user.service";
import { userModel } from "./user.model";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(userServicePlugin)
  .get("/:id", async ({ userService, params: { id } }) => {
    return userService.findById(id);
  }, {
    params: userModel.idParam,
    response: userModel.userResponse,
  });
```

### 4.3 API Responses & Error Handling

- **Success Responses**: Flat JSON data.
  - Single record: `GET /users/123` -> `{ "id": "123", "email": "test@domain.com" }`
  - Paginated list:
    ```json
    {
      "items": [...],
      "total": 120,
      "page": 1,
      "limit": 20
    }
    ```
- **Error Responses**: **RFC 7807 Problem Details** format.
  ```json
  {
    "type": "https://api.domain.com/errors/unauthorized",
    "title": "Unauthorized",
    "status": 401,
    "detail": "Invalid or expired access token."
  }
  ```
- **Logging**: Structured JSON logs (`info`, `warn`, `error`, `debug`). Every request log must include `requestId` and authenticated `userId` when available.

### 4.4 Database Schema & Drizzle ORM

- Tables: `snake_case`, plural (`users`, `refresh_tokens`, `quiz_questions`).
- Columns: `snake_case` in SQL, mapped to `camelCase` in TypeScript schema files.
- Primary Keys: Always `id uuid DEFAULT gen_random_uuid() PRIMARY KEY` or UUIDv7.
- Timestamps: Always include `createdAt` (`created_at`) and `updatedAt` (`updated_at`).
- Foreign Keys: `<referenced_table_singular>_id` (e.g., `user_id`).
- Indexes: Explicitly named `idx_<table>_<column(s)>`.

---

## 5. Frontend Conventions (`thfat-edu-fe`)

### 5.1 Component Organization (3 Tiers)

1. **Tier 1 — `src/components/ui/`**: Base UI primitives (shadcn/ui, Radix, Base UI). No custom business domain logic.
2. **Tier 2 — `src/components/`**: Composed and shared components used across multiple features (e.g. `src/components/brand/`, `src/components/chemistry/`).
3. **Tier 3 — `src/features/<feature>/components/`**: Components scoped strictly to a single business domain.

### 5.2 State Management Boundaries

- **Server State**: TanStack React Query + Eden Treaty client.
- **Client UI State**: Zustand stores (only for complex modal workflows, global UI preferences).
- **URL / Filter State**: `nuqs` for search params, tab selection, and pagination.

### 5.3 Data Fetching & Hooks

- Create dedicated `use-<action>.ts` hooks inside `features/<feature>/hooks/`.
- Components should not call `api.*` directly; invoke through custom feature hooks.

```ts
// src/features/auth/hooks/use-login.ts
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data, error } = await api.auth.login.post(credentials);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
```

### 5.4 Component Slicing & File Length Limits

- **File Length Ceiling**: No component or page file should exceed **200 lines** (target $\le 150$ lines). Any file exceeding this limit must be split.
- **Thin Page Architecture (`page.tsx`)**:
  - `page.tsx` must only serve as an orchestrator (routing params, high-level layout, Suspense boundaries, and composing sections).
  - Never place hundreds of lines of section UI, long static lists, or inline form states directly inside `page.tsx`.
- **Colocated Section Slicing**:
  - Complex views with multiple sections/tabs must extract each section into a standalone component inside a `components/` subfolder colocated with the route (e.g. `src/app/design/components/color-section.tsx`).
- **Data & Constants Segregation**:
  - Static datasets, configuration dictionaries, or mock lists $\ge 15$ lines must reside in dedicated `<name>.constants.ts` or `<name>.data.ts` files.
- **No Inline Helper Components (`rerender-no-inline-components`)**:
  - Do not define temporary component functions (e.g. `function Section()`, `function Demo()`) inside a parent component file. Extract them to their own typed files.

### 5.5 React 19 & Next.js 16 Modern Engineering Standards

- **`ref` as a Prop (React 19)**:
  - In React 19, `ref` is a standard prop on function components. Deprecate `forwardRef` for all new components.
  - Type the ref explicitly in the props type:
    ```ts
    type TCustomInputProps = {
      label: string;
      ref?: Ref<HTMLInputElement>;
    };

    export function CustomInput({ label, ref }: TCustomInputProps) {
      return <input ref={ref} placeholder={label} />;
    }
    ```
- **Imperative Control without Re-renders (`useImperativeHandle` + `ref`)**:
  - For components with high-frequency updates (e.g. CBT exam countdown timer, audio/media scrubbers, chemical molecule canvas), expose imperative control methods via `useImperativeHandle` instead of pushing state updates up to the parent:
    ```ts
    export type TTimerHandle = {
      reset: () => void;
      getRemainingSeconds: () => number;
    };

    type TTimerProps = {
      initialSeconds: number;
      ref?: Ref<TTimerHandle>;
    };

    export function ExamTimer({ initialSeconds, ref }: TTimerProps) {
      const remainingRef = useRef(initialSeconds);

      useImperativeHandle(ref, () => ({
        reset: () => {
          remainingRef.current = initialSeconds;
        },
        getRemainingSeconds: () => remainingRef.current,
      }));

      return <div>{/* Timer UI */}</div>;
    }
    ```
- **Re-render Prevention with `useRef` (`rerender-use-ref-transient-values`)**:
  - Store transient values (timers, animation frames, previous state, values read only inside event listeners) in `useRef` rather than `useState` to prevent wasteful re-render cycles.
- **Push `"use client"` to the Leaves**:
  - In Next.js 16 App Router, keep pages and layout containers as React Server Components (RSC) by default.
  - Only mark leaf interactive components with `"use client"`. Do not mark an entire 500+ line page as client-rendered if 80% of it is static display.

### 5.6 Accessibility & Performance

- **WCAG 2.1 AA Compliance**:
  - Always provide accessible labels (`aria-label`, `aria-labelledby`, or visible text).
  - Ensure keyboard focus visibility.
  - Interactive elements must be semantic (`<button>` not `<div onClick>`).
- **Performance Rules**:
  - Use `next/image` for image assets.
  - Use `next/font` for webfonts (already configured with Be Vietnam Pro and Geist Mono).
  - Code-split heavy routes and large components using dynamic imports (`next/dynamic` or `React.lazy`).

---

## 6. Linter & Formatter Enforcement Rules

### 6.1 Oxlint (Linting & Static Analysis via Native + JS Plugins)

Enforced in CI and pre-commit hooks via `oxlint`:

| Rule Name                                                     | Severity                       | Purpose                                                |
| ------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| `max-params`                                                  | `error` (`{ "max": 3 }`)       | Enforce options object pattern for >3 params           |
| `max-depth`                                                   | `error` (`{ "max": 3 }`)       | Prevent deep nesting, enforce early returns            |
| `prefer-const`                                                | `error`                        | Enforce immutability by default                        |
| `no-var`                                                      | `error`                        | Prevent legacy `var` declarations                      |
| `eqeqeq`                                                      | `error`                        | Strict equality `===` checks                           |
| `no-nested-ternary`                                           | `error`                        | Avoid unreadable nested ternary operators              |
| `no-else-return`                                              | `error`                        | Enforce guard clauses                                  |
| `prefer-template`                                             | `error`                        | String interpolation over concatenation                |
| `no-param-reassign`                                           | `error`                        | Prevent mutating incoming function arguments           |
| `import/newline-after-import`                                 | `error`                        | Enforce exactly 1 empty line after import block        |
| `import/no-namespace`                                         | `error`                        | Ban `import * as React` wildcards                      |
| `react/no-namespace`                                          | `error`                        | Ban React component/type namespaces                    |
| `typescript/no-explicit-any`                                  | `error`                        | Require proper type narrowing / `unknown`              |
| `typescript/no-non-null-assertion`                            | `error`                        | Ban `!` operator                                       |
| `typescript/consistent-type-imports`                          | `error`                        | Enforce `import type`                                  |
| `stylistic/padding-line-between-statements` (via `jsPlugins`) | `error`                        | **Auto-enforce blank line before `return` statements** |
| `no-console`                                                  | `warn` (allow `warn`, `error`) | Ban `console.log` in production                        |

### 6.2 Oxfmt (Code Formatting & Built-in Plugins)

Shared across the monorepo via `.oxfmtrc.json` files:

- **Indent & Spacing**: 2 spaces (`tabWidth: 2`, `useTabs: false`).
- **Quotes**: Double quotes for JS/TS (`singleQuote: false`), JSX (`jsxSingleQuote: false`).
- **Semicolons**: Always present (`semi: true`).
- **Print Width**: 100 characters (`printWidth: 100`).
- **Trailing Commas**: All multiline structures (`trailingComma: "all"`).
- **Brackets**: Object spaces enabled (`bracketSpacing: true`), bracket on next line (`bracketSameLine: false`).
- **Line Endings**: Unix LF (`endOfLine: "lf"`).
- **Final Newline**: Always insert newline at EOF (`insertFinalNewline: true`).
- **Import Groups & Spacing Plugin (`sortImports`)**:
  - `newlinesBetween: true`: Tự động phân tách và chèn đúng 1 dòng trống giữa các nhóm import (`builtin`, `external`, `internal` via `@/*`, `parent`/`sibling`, `style`).
  - `order: "asc"`, `ignoreCase: true`.
- **JSDoc Plugin (`jsdoc: true`)**: Tự động chuẩn hóa và format khối comment JSDoc/TSDoc.
- **Tailwind Plugin (`sortTailwindcss: true`)**: Tự động sắp xếp class Tailwind CSS tối ưu trong FE.
- **Consecutive Blank Lines**: Oxfmt tự động thu gọn $\ge 2$ dòng trống liên tiếp thành đúng 1 dòng trống.

### 6.2 Oxfmt (Code Formatting & Built-in Plugins)

Shared across the monorepo via `.oxfmtrc.json` files:

- **Indent & Spacing**: 2 spaces (`tabWidth: 2`, `useTabs: false`).
- **Quotes**: Double quotes for JS/TS (`singleQuote: false`), JSX (`jsxSingleQuote: false`).
- **Semicolons**: Always present (`semi: true`).
- **Print Width**: 100 characters (`printWidth: 100`).
- **Trailing Commas**: All multiline structures (`trailingComma: "all"`).
- **Brackets**: Object spaces enabled (`bracketSpacing: true`), bracket on next line (`bracketSameLine: false`).
- **Line Endings**: Unix LF (`endOfLine: "lf"`).
- **Final Newline**: Always insert newline at EOF (`insertFinalNewline: true`).
- **Import Groups & Spacing Plugin (`sortImports`)**:
  - `newlinesBetween: true`: Tự động phân tách và chèn đúng 1 dòng trống giữa các nhóm import (`builtin`, `external`, `internal` via `@/*`, `parent`/`sibling`, `style`).
  - `order: "asc"`, `ignoreCase: true`.
- **JSDoc Plugin (`jsdoc: true`)**: Tự động chuẩn hóa và format khối comment JSDoc/TSDoc.
- **Tailwind Plugin (`sortTailwindcss: true`)**: Tự động sắp xếp class Tailwind CSS tối ưu trong FE.
- **Consecutive Blank Lines**: Oxfmt tự động thu gọn $\ge 2$ dòng trống liên tiếp thành đúng 1 dòng trống.
