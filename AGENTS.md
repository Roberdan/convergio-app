# Convergio App — Agent Guide

Daemon cockpit for the Convergio platform. Next.js 16, React 19, 109 Maranello components, 4 themes.

## Quick orientation

| Directory | What | Guide |
|-----------|------|-------|
| `src/components/maranello/` | 109 Mn* design system components | Each category has its own AGENTS.md |
| `src/components/shell/` | App shell (sidebar, header, layout) | [AGENTS.md](src/components/shell/AGENTS.md) |
| `src/components/blocks/` | Built-in page blocks (KPI, table, feed) | [AGENTS.md](src/components/blocks/AGENTS.md) |
| `src/lib/` | Config loader, block registry, i18n, utils | [AGENTS.md](src/lib/AGENTS.md) |
| `src/hooks/` | Data fetching, SSE, real-time hooks | [AGENTS.md](src/hooks/AGENTS.md) |
| `src/app/` | Next.js routes (19 Convergio pages + API) | [AGENTS.md](src/app/AGENTS.md) |
| `src/mcp/` | MCP server for AI agents (Nasra tools) | [AGENTS.md](src/mcp/AGENTS.md) |
| `src/types/` | TypeScript types (config, AI, blocks) | [AGENTS.md](src/types/AGENTS.md) |
| `packages/core/` | @convergio/core npm package (re-exports) | [AGENTS.md](packages/core/AGENTS.md) |

## Daemon API

All pages talk to the Convergio daemon at `http://localhost:8420`.
SSE endpoint for real-time events. API client: `src/lib/api.ts`, types: `src/lib/types.ts`.

## Rules (apply everywhere)

1. **No hardcoded colors** — `var(--mn-*)` tokens only
2. **4 themes** — navy, dark, light, colorblind. Test all.
3. **Lucide icons only** — zero emoji
4. **250 lines max per file** — split to `.helpers.ts`
5. **Named exports only** — no `export default`
6. **TypeScript strict** — no `any`
7. **WCAG 2.2 AA** — keyboard nav, focus rings, ARIA
8. **i18n** — `useLocale("ns")` for all UI strings
9. **Catalog-first** — search `component-catalog-data.ts` before creating UI

## Build commands

```bash
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm test       # Vitest
pnpm test:e2e   # Playwright
pnpm mcp        # MCP server
```

## Agent workflow

1. Read the plan: `cvg plan tree <plan_id> --human`
2. Worktree per task: `git worktree add .worktrees/<name> feat/<name>`
3. Never work on main checkout directly
4. Before commit: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
5. Commit + PR: conventional commit, `gh pr create`
6. Complete: `cvg task complete <id> --agent-id <name> --pr-url <url>`
