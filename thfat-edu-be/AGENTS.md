# Backend Specific Agent Rules

1. **Always adhere to root [AGENTS.md](../AGENTS.md)** and [CODING_STANDARDS.md](../CODING_STANDARDS.md).
2. **4 Files per Module**: `<feature>.model.ts`, `<feature>.service.ts`, `<feature>.routes.ts`, `index.ts`.
3. **Dependency Injection**: Use Elysia's `.decorate()` or `.derive()` to register services on context. Never call static class methods.
4. **RFC 7807 Errors**: Error responses must be Problem Details objects (`{ type, title, status, detail }`).
5. **Flat Data & Offset Pagination**: Return flat data objects directly. Paginated results must use `{ items: T[], total, page, limit }`.
