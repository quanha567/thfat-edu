---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript rules

Details: `CODING_STANDARDS.md` §2–3.

- `type` over `interface`; no `any`, no `!` (use `unknown` + narrowing).
- More than 3 params → single typed options object.
- Guard clauses, nesting depth ≤ 3.
- Generics prefixed with `T` (`TItem`).
- Import React APIs by name; never `React.*`.
- Shared utility types (`Maybe`, `Nullable`, `Optional`, `OnChange`, `OnPress`, `WithChildren`) come from `@thfat-edu/shared`.
- One blank line after imports and before `return`; never two consecutive blank lines.
