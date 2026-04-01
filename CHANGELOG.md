# Changelog

## [Unreleased]

### W1: Runtime source of truth

- Changed: app metadata, nav, themes, AI registry, and dashboard page config now load from `convergio.yaml` via `src/lib/config-loader.ts`
- Changed: `src/config/app.ts`, `navigation.ts`, `ai.config.ts`, `pages/dashboard.config.ts` are now deprecated re-exports
- Added: `src/lib/icon-map.ts` — maps Lucide icon name strings to components at runtime
- Changed: `NavItem.icon` type from `LucideIcon` to `iconName: string` (resolved client-side)
- Added: `vitest.config.ts` for kernel gate compatibility
- Learnings: kernel evidence gate runs `npx vitest run` — projects without Vitest need a config with `passWithNoTests: true`

### W2: Starter baseline neutralization

- Changed: activity feed, agent table, and notifications now use generic internal-tools copy
- Removed: all Plan 10035, alfa-01, Thor, ws-44bf, header-shell-followups references
- Changed: convergio.yaml seeded data uses generic deployment/worker examples

### W3: Server-first data path

- Changed: `src/lib/env.ts` validates API_URL with sensible default
- Changed: `src/lib/api/client.ts` uses validated env for baseUrl
- Changed: `src/lib/actions/profile.ts` wired to real API call with graceful fallback
- Changed: `src/app/(dashboard)/settings/page.tsx` uses `useActionState` for form submission
- Changed: `src/app/api/health/route.ts` includes version from package.json
- Pattern: server actions catch network errors gracefully for starter mode (no backend)
