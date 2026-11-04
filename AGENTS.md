# AI Agent Guidelines & Coding Standards Reference

This file outlines strict instructions for AI agents operating in this repository.

## 1. Primary Rule Reference

Always read and adhere to [CODING_STANDARDS.md](file:///d:/projects/thfat-edu/CODING_STANDARDS.md) before writing or refactoring any code.

## 2. Core Directives

### TypeScript & Code Style

- **`type` over `interface`**: Never use `interface` unless explicit declaration merging is needed.
- **No `any` or `!`**: Always use `unknown` with type narrowing. Never use non-null assertion `!`.
- **Max 3 Parameters**: Functions requiring >3 arguments MUST accept a single typed options object.
- **Guard Clauses**: Use early returns. Keep max nesting depth $\le 3$.
- **Function Exports**: Use `export function functionName()` for functions, `export const` only for constants and components/stores where required.
- **Generic Types**: Always prefix type parameters with `T` (e.g. `TItem`, `TValue`, `TContext`).
- **No `React.*` Namespace**: Never use `React.ReactNode`, `React.useState`, `React.FC`. Always import named types/hooks directly (`import { useState, type ReactNode } from "react"`).
- **Vertical Whitespace & Line Spacing**:
  - Exactly 1 empty line after import blocks (`import/newline-after-import`).
  - Blank line before `return` statements (unless single guard clause).
  - Blank line between functions, types, and logic steps.
  - Never allow $\ge 2$ consecutive blank lines.

### Shared Types & Packages

- Common utility types (`Maybe<T>`, `Nullable<T>`, `Optional<T>`, `OnChange<T>`, `OnPress`, `WithChildren<T>`) reside in `@thfat-edu/shared` (`packages/shared`). Always import from there instead of re-defining them locally.

### Backend (`thfat-edu-be`)

- **Module Structure**: 4 files per feature (`<feature>.model.ts`, `<feature>.service.ts`, `<feature>.routes.ts`, `index.ts`).
- **Dependency Injection**: Use Elysia's `.decorate()` or `.derive()` to register services on the context. Never call static class methods.
- **Errors**: Return errors formatted according to RFC 7807 Problem Details (`{ type, title, status, detail }`).
- **Success Responses**: Return flat data objects directly. Paginated results must use `{ items: T[], total, page, limit }`.

### Frontend (`thfat-edu-fe`)

- **3-Tier Component Tree**:
  1. `src/components/ui/` for shadcn/ui primitives.
  2. `src/components/` for shared multi-feature components.
  3. `src/features/<feature>/components/` for feature-specific components.
- **File Length & Slicing**: Max 200 lines per component/page. Use Thin Page Architecture; colocate multi-section page components in `components/` subfolder.
- **Constants Separation**: Extract static datasets and dictionaries $\ge 15$ lines into `.constants.ts` or `.data.ts`.
- **React 19 & Next.js 16**:
  - Use `ref` directly as a prop (no `forwardRef`).
  - Use `useImperativeHandle` + `ref` for high-frequency or imperative UI controls (e.g. CBT timer, canvas) to avoid state re-renders.
  - Use `useRef` for transient values read in callbacks/listeners.
  - Push `"use client"` down to interactive leaf components; keep pages/layouts RSC by default.
- **Custom Hooks**: Put React Query operations inside dedicated `use-<action>.ts` hooks in `features/<feature>/hooks/`. Components must not call the raw API directly.
- **State Segregation**: React Query for server data, Zustand only for global UI states, `nuqs` for query/search parameters.
