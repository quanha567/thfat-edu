---
name: new-frontend-feature
description: Scaffold a new frontend feature in thfat-edu-fe (feature folder, hooks, components, thin page). Use when adding a new page, screen, or feature area to the Next.js app.
---

# New frontend feature

1. Read `CODING_STANDARDS.md` §5 and mirror an existing feature in `thfat-edu-fe/src/features/` (e.g. `categories`).
2. Create `src/features/<feature>/` with `components/`, `hooks/`, `index.ts` (plus `*.constants.ts` for static data ≥ 15 lines).
3. Put every API call in `hooks/use-<action>.ts` using React Query; components consume hooks only.
4. Keep the route in `src/app/...` as a thin RSC page; add `"use client"` only on interactive leaf components.
5. Keep each file ≤ 200 lines; use shadcn primitives from `components/ui/`; use `nuqs` for URL state.
6. Respect typography rules (no arbitrary font sizes) and import shared types from `@thfat-edu/shared`.
7. Add tests next to the component when behavior is non-trivial, then run lint and type-check.
