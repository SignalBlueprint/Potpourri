# AI State

Current truth for AI agents. Update after every PR.

## Last Updated

2026-01-03

## Current Blockers

| Blocker                              | Impact                               | Waiting On      |
| ------------------------------------ | ------------------------------------ | --------------- |
| `@signal/catalog-core` not published | Cannot complete GIFT-001 to GIFT-004 | Package release |

## Recent PRs

| PR  | Task                                  | Status | Date       |
| --- | ------------------------------------- | ------ | ---------- |
| #4  | Add release gates and CI/CD workflows | Merged | 2026-01-03 |
| #3  | Add typed client configuration        | Merged | 2026-01-03 |
| #2  | Setup catalog-core package scaffold   | Merged | 2026-01-03 |

## Active Branch

`claude/review-priority-task-y996s` - GIFT-005: Apply brand colors from config to Tailwind theme

## Environment Notes

- Node.js 20.x required
- No backend deployed yet (uses stub data)
- `VITE_API_BASE_URL` defaults to `/api`

## Next Recommended Tasks

Tasks that can proceed without blockers:

1. **GIFT-005** - Apply brand colors (no package dependency)
2. **GIFT-006** - Add logo component (no package dependency)
3. **GIFT-008** - Add SEO meta tags (no package dependency)
4. **GIFT-009** - Add Vercel deployment config (no package dependency)
5. **GIFT-010** - Add admin auth gate (no package dependency)

## Known Technical Debt

1. Stub routes duplicate code from catalogCore.tsx (will be deleted)
2. No error boundaries
3. No loading states
4. Tests are minimal (happy path only)
