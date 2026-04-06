# AGENTS.md — Guide for AI Coding Agents

> Read this first if you are an AI agent working on or with this codebase.

## What This Project Is

**Convergio Frontend** is a **config-driven dashboard framework**, not just a component library. It ships a complete, working application: layout shell, sidebar, header, theme engine, page renderer, 100 React components, 4 themes, AI chat, SSE hooks, and a component showcase. Everything is wired together and ready to run.

**Maranello** is the name of the design system — the 100 components with the `Mn` prefix. It lives *inside* Convergio.

### Two Usage Modes

| Mode | When to use | What you do |
|---|---|---|
| **Framework mode** | Building a new dashboard/app from scratch | Clone this repo, edit `maranello.yaml`, run `pnpm dev`. You get a full app with zero custom code. Add custom pages in `src/app/(dashboard)/` when YAML blocks aren't enough. |
| **Registry mode** | Adding components to an existing project | Run `npx shadcn add mn-gauge --registry https://host/r` to copy individual component source into your project. You only get the component, not the framework. |

**Framework mode is the primary use case.** If someone asks you to "use Convergio" or "build with Maranello", they almost certainly mean framework mode.

---

## Mental Model

```
maranello.yaml
      |
      v
config-loader.ts ──> Zod validation (config-schema.ts)
      |
      ├──> loadAppConfig()    ──> app-shell.tsx (brand name, logo)
      ├──> loadNavSections()  ──> sidebar.tsx (navigation sections)
      ├──> loadPageConfig()   ──> page-renderer.tsx (block grid)
      └──> loadAIConfig()     ──> ai-chat-panel (agents, models)
```

**The YAML is the single source of truth.** When a user edits `maranello.yaml` (or `convergio.yaml`) and restarts the dev server, the entire app updates: branding, sidebar navigation, page layouts, AI agents — everything.

Config file resolution (first match wins):
1. `$MARANELLO_CONFIG_PATH` env var
2. `$CONVERGIO_CONFIG_PATH` env var
3. `./maranello.yaml` in project root
4. `./convergio.yaml` in project root

---

## Key Files You Must Know

| File | Purpose |
|---|---|
| `maranello.yaml` / `convergio.yaml` | App configuration: branding, theme, navigation, pages, AI agents |
| `src/lib/config-loader.ts` | Parses YAML, validates with Zod, caches, watches for changes in dev |
| `src/lib/config-schema.ts` | Zod schema for the config file structure |
| `src/lib/config-block-schemas.ts` | Zod schemas for each page block type (discriminated union on `type`) |
| `src/components/page-renderer.tsx` | Maps block `type` values to React components |
| `src/components/shell/` | App shell: sidebar, header, breadcrumbs, search combobox |
| `src/app/(dashboard)/layout.tsx` | Dashboard layout — calls `loadAppConfig()` + `loadNavSections()` |
| `src/app/(dashboard)/[...slug]/page.tsx` | Catch-all route for YAML-defined pages |
| `src/components/maranello/index.ts` | Barrel export for all 100 Maranello components |
| `src/app/globals.css` | Theme tokens: `--mn-*` CSS custom properties for all 4 themes |
| `CONSTITUTION.md` | Binding code rules (accessibility, themes, naming, file size limits) |

---

## How to Add a Dashboard Page (YAML Only)

Add a route entry under `pages:` in your YAML config:

```yaml
pages:
  /analytics:
    title: Analytics
    rows:
      - columns: 3
        blocks:
          - { type: kpi-card, label: Users, value: "12,345", change: "+5%", trend: up }
          - { type: kpi-card, label: Revenue, value: "$890K", change: "+12%", trend: up }
          - { type: kpi-card, label: Churn, value: "2.1%", change: "-0.3%", trend: down }
      - columns: 2
        blocks:
          - type: chart-block
            chartType: area
            labels: [Jan, Feb, Mar, Apr, May]
            series:
              - { label: Growth, data: [100, 120, 115, 140, 160] }
          - type: gauge-block
            label: Health Score
            value: 87
            min: 0
            max: 100
            unit: "%"
```

Then add it to navigation:

```yaml
navigation:
  sections:
    - label: Main
      items:
        - { id: analytics, label: Analytics, href: /analytics, icon: BarChart3 }
```

No code changes needed. Restart the dev server.

### Available Block Types

`kpi-card` | `data-table` | `data-table-maranello` | `activity-feed` | `stat-list` | `empty-state` | `ai-chat` | `gauge-block` | `chart-block` (sparkline/donut/area/bar/radar/bubble) | `funnel-block` | `hbar-block` | `speedometer-block` | `gantt-block` | `kanban-block` | `okr-block` | `map-block` | `system-status-block`

---

## How to Add a Custom Page (React)

When YAML blocks aren't enough, create a Next.js page inside the dashboard group:

```
src/app/(dashboard)/your-page/page.tsx
```

It automatically inherits the sidebar, header, breadcrumbs, and theme from the `(dashboard)` layout. Import components from the barrel:

```tsx
import { MnChart, MnDataTable, MnBadge } from "@/components/maranello";
```

Then add a navigation entry in your YAML config to make it appear in the sidebar.

---

## How to Create a New Maranello Component

Follow `docs/guides/creating-a-component.md`. Summary:

1. **File:** `src/components/maranello/{category}/mn-your-component.tsx`
2. **Prefix:** always `Mn` (e.g., `MnYourComponent`)
3. **Export:** named only, never default
4. **Pattern:** CVA + cn() for variants, `"use client"` only if hooks are used
5. **Colors:** CSS custom properties (`--mn-*`), never hardcoded hex
6. **Max size:** 250 lines — extract logic to `mn-your-component.helpers.ts`
7. **Barrel:** add to `src/components/maranello/index.ts`
8. **Registry:** add JSON to `public/r/` for shadcn CLI installation

Categories: `agentic` | `data-display` | `data-viz` | `feedback` | `financial` | `forms` | `layout` | `navigation` | `network` | `ops` | `strategy` | `theme`

---

## Code Conventions (CONSTITUTION.md)

These are **non-negotiable**. Violations will be rejected in review.

| Rule | Requirement |
|---|---|
| TypeScript strict | No `any` type, ever |
| Named exports only | No `export default` |
| No hardcoded colors | Use `--mn-*` CSS custom properties |
| 4 themes always | Every component must work in navy, dark, light, colorblind |
| Max 250 lines/file | Split logic into `.helpers.ts` sibling files |
| Lucide icons only | Zero emoji anywhere (P2) |
| `"use client"` | Only on files that use React hooks |
| WCAG 2.2 AA | Minimum accessibility level for all components |
| Keyboard-first | All interactive elements must be keyboard-navigable |
| English only | All code, comments, and documentation in English |

---

## Theme System

4 themes, switched via `data-theme` attribute on `<html>`:

| Theme | Key | Colors |
|---|---|---|
| Navy | `navy` | Deep blue bg `#0d2045`, gold accent `#FFC72C` |
| Dark | `dark` | Near-black bg `#111111`, gold accent `#FFC72C` |
| Light | `light` | Warm ivory bg `#FAF3E6`, red accent `#DC0000` |
| Colorblind | `colorblind` | Dark bg `#111111`, blue accent `#0072B2` (Okabe-Ito) |

Components read colors via:
- CSS custom properties: `var(--mn-surface)`, `var(--mn-accent)`, etc.
- Canvas components: `readPalette(el)` reads `getComputedStyle()` + `data-theme`
- Never hardcode hex values in components

---

## API Integration

| Hook | Purpose | File |
|---|---|---|
| `useApiQuery` | SWR-like poller with `pollInterval`, error handling, `refetch()` | `src/hooks/use-api-query.ts` |
| `useEventSource` | SSE stream with auto-reconnect + exponential backoff | `src/hooks/use-event-source.ts` |

Backend URL comes from `src/lib/env.ts`:
- Server: `API_URL` env var (default `http://localhost:8420`)
- Client: `NEXT_PUBLIC_API_URL` env var

---

## Build & Test Commands

```bash
pnpm dev          # dev server at http://localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript strict check
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # Playwright E2E
pnpm format       # Prettier formatting
```

---

## Common Mistakes to Avoid

1. **Treating this as a component library** — it's a full framework. Clone and configure, don't try to `npm install` it.
2. **Hardcoding colors** — use `--mn-*` CSS custom properties. The 4-theme system will break otherwise.
3. **Using `export default`** — the codebase uses named exports exclusively.
4. **Using emoji** — Lucide icons only (CONSTITUTION P2).
5. **Ignoring the YAML** — check `maranello.yaml`/`convergio.yaml` before writing code. Many features are config-driven.
6. **Creating files > 250 lines** — split into component + `.helpers.ts`.
7. **Using `any`** — TypeScript strict mode, no exceptions.
8. **Forgetting themes** — test every visual change in all 4 themes.
