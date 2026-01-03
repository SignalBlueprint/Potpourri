# AI Playbook

> Rules for agents working on Potpourri.

## Minimal Read Mode

Before starting any task, read ONLY these files:

1. `README.md` - Task queue, release gates, current status
2. `docs/AI_STATE.md` - Blockers, repo map, recent PRs
3. Files listed in the task's `Files` column

Do NOT scan the entire codebase. Read only what is needed.

## Task Size Rules

- **Max diff**: <200 lines of code changed
- **Max files**: 5 files per PR
- **One repo per PR**: Never cross repo boundaries
- **One task per PR**: Complete one GIFT-### task, then stop

## Branch Naming

```
claude/<task-description>-<session-id>
```

Example: `claude/polish-hero-section-A1B2C`

## Definition of Done

A task is DONE when:

1. All acceptance criteria met (WHAT/WHY/WHERE/DONE format)
2. `npm run lint` passes
3. `npm run typecheck` passes
4. `npm run test` passes
5. `npm run build` passes
6. PR created with `automerge` label
7. Task status updated to `DONE` in README.md Task Queue

## Commit Message Format

```
<type>: <description>

GIFT-### (if applicable)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## PR Creation

1. Push to `claude/<description>-<session-id>` branch
2. Auto-PR workflow creates PR with `automerge` label
3. CI runs release gates
4. If passing, PR auto-merges

## Stop Conditions

STOP and mark task as `BLOCKED` if:

1. **Missing dependency**: Package or file doesn't exist
2. **Unclear requirements**: Acceptance criteria is ambiguous
3. **Breaking change needed**: Task requires breaking existing functionality
4. **Auth/secrets needed**: Task requires credentials not available
5. **Cross-repo dependency**: Task requires changes in another repo

## How to Mark BLOCKED

1. Update task status to `BLOCKED` in README.md
2. Add blocker to `docs/AI_STATE.md` Active Blockers table
3. Create PR with partial work (if any)
4. Add `blocked` label to PR
5. Document blocker reason in PR description

## Task Pickup Order

1. Pick tasks marked `READY` first (highest priority, lowest risk)
2. Then pick `TODO` tasks in priority order (1 = highest)
3. Never pick `IN_PROGRESS` tasks (another agent may be working)
4. Never pick `BLOCKED` tasks until blocker is resolved

## Package Seam Rule

**CRITICAL**: Only `src/catalogCore.tsx` may import `@signal/catalog-core`.

All other files must import from `./catalogCore.tsx`. This enables:
- Easy stub-to-real swap
- Single point of package version control
- Clear integration boundary

---

*Version: 1.0.0*
