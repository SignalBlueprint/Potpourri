# AI Playbook

Rules for AI agents working on this repo.

## Minimal Read Mode

To reduce token costs, follow this read order:

1. **README.md** - Always read first (TL;DR + Task Queue)
2. **docs/AI_STATE.md** - Current blockers and last PRs
3. **src/client.config.ts** - Only if task involves branding/config
4. **src/catalogCore.tsx** - Only if task involves package integration

**Do NOT read** unless explicitly needed:

- `package-lock.json`
- `node_modules/`
- `.github/workflows/` (CI is documented in README)
- Test files (unless fixing tests)

## Task Size Rules

| Size | Time  | Scope                                       |
| ---- | ----- | ------------------------------------------- |
| S    | <1hr  | Single file change, no new dependencies     |
| M    | 1-3hr | 2-5 files, may add dev dependency           |
| L    | 3-8hr | Multiple components, new feature flag       |
| XL   | 8hr+  | Architectural change, requires planning doc |

**Autopilot Limit**: Only execute S and M tasks autonomously. L and XL require human approval.

## Task Execution Protocol

1. Check `docs/AI_STATE.md` for blockers
2. Find task in README.md Task Queue
3. Verify all dependencies are met
4. Execute task
5. Run `npm run lint && npm run typecheck && npm run test && npm run build`
6. Update `docs/AI_STATE.md` with PR info
7. Update `docs/AI_METRICS.json` counters
8. Create PR with `automerge` label (if S/M size)

## Commit Message Format

```
<type>: <short description>

[GIFT-XXX] <optional longer description>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

## File Modification Rules

- **client.config.ts**: Never modify structure, only values
- **catalogCore.tsx**: Only modify stub section or swap to real import
- **routes/\*.tsx**: These are temporary; prefer modifying catalogCore.tsx
- **package.json**: Add dependencies only if task explicitly requires

## PR Checklist

Before creating PR:

- [ ] All release gates pass locally
- [ ] Task ID in commit message
- [ ] AI_STATE.md updated
- [ ] AI_METRICS.json incremented
- [ ] No console.log or debug code
- [ ] No hardcoded secrets or credentials
