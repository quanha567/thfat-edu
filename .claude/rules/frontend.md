---
paths:
  - "thfat-edu-fe/**"
---

# Frontend rules

Details: `CODING_STANDARDS.md` §5. To scaffold a feature, use the `new-frontend-feature` skill.

- Component tiers: `components/ui/` (shadcn) → `components/` (shared) → `features/<f>/components/`.
- Max 200 lines per component/page; thin pages; static data ≥ 15 lines → `.constants.ts` / `.data.ts`.
- React Query calls live in `features/<f>/hooks/use-<action>.ts`; components never call the API directly.
- State: React Query (server), Zustand (global UI only), `nuqs` (URL params).
- React 19: `ref` as prop (no `forwardRef`); push `"use client"` to leaf components.
- No arbitrary font sizes (`text-[10px]`); use Tailwind scale or `text-xxs`; readable text ≥ `text-xs`.
