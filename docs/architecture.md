# Convergio Mission Control — Architecture

## Overview

Mission Control is a Next.js 16 dashboard for managing the Convergio daemon.
It provides real-time visibility into agents, plans, mesh nodes, deployments,
and platform configuration via a Maranello Design System UI.

## Page Map

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — KPI strip, agent timeline, plan overview |
| `/agents` | Active agents list, status, budget tracking |
| `/agents/workspace` | Agent workspace — live logs, task progress |
| `/approvals` | Pending approvals queue (plans, PRs, reviews) |
| `/backup` | Backup management — snapshots, restore, retention |
| `/billing` | Cost tracking — inference spend, agent budgets |
| `/deploy` | Deployment status, history, rollback |
| `/doctor` | Health checks — E2E smoke, system diagnostics |
| `/inbox` | Notifications and event feed |
| `/inference` | Model routing, cost breakdown, usage metrics |
| `/knowledge` | Knowledge base — search, write, sync |
| `/mesh` | Mesh network — peer status, sync, delegation |
| `/night-agents` | Night agent scheduling and results |
| `/observatory` | System-wide observability — metrics, timeline |
| `/orgs` | Organization management — members, settings |
| `/plans` | Plan lifecycle — create, review, execute, validate |
| `/prompts` | Prompt library and skill management |
| `/reports` | Generated reports and analytics |
| `/scheduler` | Task scheduling policies and decisions |
| `/security` | Security audit, secrets, trust levels |
| `/settings` | Platform config, daemon connections, extensions |

## API Proxy

All API calls go through `/api/proxy/[...path]` which forwards to the
Convergio daemon (default `http://localhost:8420`). The proxy handles:

- Authentication token forwarding
- CORS headers
- Error normalization

Client-side API functions are split into two modules:
- `src/lib/api.ts` — core endpoints (agents, plans, orgs, etc.)
- `src/lib/api-ext.ts` — extension endpoints (doctor, deploy, inference, etc.)

## i18n

Every page has a companion `<page>-i18n.ts` file exporting a `use<Page>Locale()`
hook. Supported locales: `en`, `it`, `es`, `zh`. The language provider stores
the active locale in localStorage and provides it via React context.

## Component Pattern

Pages follow a strict composition pattern:

1. Fetch data via `useApiQuery()` hooks
2. Transform data into Maranello component props (pure functions)
3. Render using only Maranello Design System components
4. No custom HTML elements for UI (tables, cards, charts, etc.)

All colors use `var(--mn-*)` CSS tokens. Icons use Lucide React.

## Tauri Desktop

The app is wrapped in Tauri for desktop distribution. The Rust shell
(`src-tauri/src/main.rs`) provides:
- System tray with Open/Quit menu
- Native window management

## File Organization

```
convergio-app/
  src/
    app/(dashboard)/        # All dashboard pages
      <page>/
        page.tsx            # Page component (max 250 lines)
        <page>-i18n.ts      # Localized strings
        *.helpers.ts        # Extracted logic (if needed)
    components/maranello/   # Design system components
    hooks/                  # Shared React hooks
    lib/
      api.ts               # Core API client
      api-ext.ts           # Extension API client
      types.ts             # Shared TypeScript types
      i18n/                # Language provider
  e2e/                     # Playwright E2E tests
  src-tauri/               # Tauri desktop shell
  docs/                    # Architecture docs, guides
```
