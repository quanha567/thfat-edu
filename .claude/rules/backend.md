---
paths:
  - "thfat-edu-be/**"
---

# Backend rules

Details: `CODING_STANDARDS.md` §4. To scaffold a feature, use the `new-backend-module` skill.

- 4 files per module: `<feature>.model.ts`, `.service.ts`, `.routes.ts`, `index.ts`.
- Register services with Elysia `.decorate()` / `.derive()`; never call static class methods.
- Success: flat objects; lists: `{ items, total, page, limit }`.
- Errors: RFC 7807 `{ type, title, status, detail }`.
- Drizzle: snake_case plural tables, `id` uuid PK, `created_at`/`updated_at`, indexes `idx_<table>_<cols>`.
