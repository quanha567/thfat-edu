<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend Specific Agent Rules

1. **Always adhere to root [AGENTS.md](../AGENTS.md)** and [CODING_STANDARDS.md](../CODING_STANDARDS.md).
2. **No `React.*` Namespace**: Never use `React.ReactNode`, `React.useState`, `React.FC`, etc. Always import named types/hooks directly from `"react"`.
3. **Custom Hooks**: Put React Query operations inside dedicated `use-<action>.ts` hooks in `features/<feature>/hooks/`. Components must not call the raw API directly.
4. **3-Tier Components**:
   - `src/components/ui/` for shadcn/ui primitives.
   - `src/components/` for shared multi-feature components.
   - `src/features/<feature>/components/` for feature-specific components.
5. **State Segregation**: React Query for server data, Zustand only for global UI states, `nuqs` for query/search parameters.
