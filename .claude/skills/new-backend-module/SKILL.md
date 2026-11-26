---
name: new-backend-module
description: Scaffold a new backend feature module in thfat-edu-be following the 4-file Elysia structure. Use when adding a new API feature, resource, or route group to the backend.
---

# New backend module

1. Read `CODING_STANDARDS.md` §4 and look at an existing module in `thfat-edu-be/src/modules/` (e.g. `articles`) as the pattern.
2. Create `thfat-edu-be/src/modules/<feature>/` with:
   - `<feature>.model.ts` — TypeBox schemas for requests and responses.
   - `<feature>.service.ts` — logic exposed via `new Elysia({ name: "<feature>-service" }).decorate("<feature>Service", {...})`.
   - `<feature>.routes.ts` — routes using `.use(<feature>ServicePlugin)` and `ctx.<feature>Service`.
   - `index.ts` — barrel exporting the composed plugin.
3. Register the plugin in `thfat-edu-be/src/index.ts`.
4. If tables are needed, add a Drizzle schema (snake_case plural, uuid PK, timestamps) and generate a migration.
5. Return flat data, `{ items, total, page, limit }` for lists, RFC 7807 for errors.
6. Run the backend type-check/lint and tests before finishing.
