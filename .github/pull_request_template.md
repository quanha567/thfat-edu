## 📝 Summary

<!-- Brief description of the problem, motivation, and solution -->
<!-- Tip: You can include a shallow tree, diff-sketch, or diagram if helpful -->

## 🎯 Type of Change

- [ ] `feat`: New feature (non-breaking change which adds functionality)
- [ ] `fix`: Bug fix (non-breaking change which fixes an issue)
- [ ] `refactor`: Code refactoring (no functional or API change)
- [ ] `style`: Formatting, CSS, or UI token updates
- [ ] `perf`: Performance improvement
- [ ] `test`: Adding or updating tests
- [ ] `build`: Build system or external dependency updates
- [ ] `ci`: CI/CD workflows and automation scripts
- [ ] `docs`: Documentation, ADRs, or GLOSSARY updates
- [ ] `chore`: Maintenance, tooling, or repository housekeeping

## 📦 Scope

- [ ] `fe`: Frontend (`thfat-edu-fe`)
- [ ] `be`: Backend (`thfat-edu-be`)
- [ ] `ci`: CI/CD pipelines
- [ ] `config` / `deps` / `repo`: Root tooling, dependencies, or repository configuration

## 🔗 Related Issues

- Closes # <!-- Fill in issue number if applicable, e.g. Closes #42 -->

## 📸 Evidence & Testing

### How to test

1. Run command: `...`
2. Open URL / Route: `...`
3. Verify expected behavior / API response: `...`

### Verification Evidence

- **Before:** <!-- Screenshot, console output, or failing test run -->
- **After:** <!-- Screenshot, console output, or passing test run -->

## ⚠️ Merge Danger & Blast Radius

- **Door:** `two-way` (easily reversible) | `one-way` (destructive, hard-to-undo, or breaking change)
- **Blast Radius:** `isolated` (single component/file) | `broad` (API contract, shared schema, global layout)

## ✅ Author Pre-merge Checklist

- [ ] Code adheres to formatting rules (`bun run format:check`)
- [ ] Linter passes with 0 errors (`bun run lint`)
- [ ] TypeScript compiles cleanly across packages (`bun run typecheck`)
- [ ] All unit tests pass (`bun run test`)
- [ ] Production builds succeed without errors (`bun run build`)
- [ ] No credentials, secret keys, or local `.env` files committed
