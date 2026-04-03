# Maranello Design System

100 React components, 4 themes, config-driven architecture, shadcn-compatible registry. Built on Next.js 16 App Router, Tailwind CSS v4, CVA.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript strict
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # Playwright E2E
```

## Install components in your project

Maranello components are available via a shadcn-compatible registry. Add individual components to any Next.js / React project:

```bash
npx shadcn add mn-badge --registry https://your-host/r
npx shadcn add mn-gauge --registry https://your-host/r
npx shadcn add mn-data-table --registry https://your-host/r
```

Or browse the full registry at `/r/index.json`.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 App Router |
| UI Primitives | shadcn/ui + Base UI + Tailwind CSS v4 |
| Design System | Maranello — 100 components with `Mn` prefix |
| Typography | Outfit (headings), Inter (body), Barlow Condensed (mono/data) |
| Themes | 4: Navy, Dark, Light, Colorblind (WCAG 2.2 AA) |
| Icons | Lucide (no emoji — CONSTITUTION P2) |
| AI | Vercel AI SDK v6 (optional — not required for design system) |
| Desktop | Tauri (optional, `src-tauri/`) |

## Config-driven architecture

The app reads `maranello.yaml` (or `convergio.yaml`) at startup for branding, navigation, pages, and AI agents. Edit this file and restart the dev server to customize without touching source code.

```yaml
app:
  name: Maranello Design System
  description: Component showcase and design system explorer

theme:
  default: navy            # light | dark | navy | colorblind

navigation:
  sections:
    - label: Design System
      items:
        - id: showcase
          label: Component Showcase
          href: /showcase
          icon: Palette
```

`src/lib/config-loader.ts` reads the YAML, validates with Zod, and caches. Override path with `MARANELLO_CONFIG_PATH` env var.

## Architecture

```
maranello.yaml              # config: branding, nav, pages
public/r/                   # shadcn-compatible component registry
src/
  app/
    (auth)/login/           # auth boundary (demo: admin / admin)
    (dashboard)/            # shell — layout with sidebar + header
      showcase/             # component showcase landing
        [category]/         # per-category live demo pages
        themes/             # theme playground
      preview/              # quick preview page
    api/
      chat/route.ts         # AI streaming (optional)
      health/route.ts       # liveness probe
    layout.tsx              # root: fonts, theme script, CanvasSafeArc
  components/
    maranello/              # Maranello Design System — 100 components
      agentic/              #   7 AI/agent components
      data-display/         #  12 data display components
      data-viz/             #  14 data visualization components
      feedback/             #   6 feedback components
      financial/            #   2 financial components
      forms/                #  11 form/input components
      layout/               #   8 layout components
      navigation/           #   5 navigation components
      network/              #  10 network/system components
      ops/                  #   8 operations components
      strategy/             #  11 strategy components
      theme/                #   6 theme control components
      shared/               #   shared utilities + tests
      index.ts              #   barrel re-export
    blocks/                 # page blocks: kpi-card, data-table, ai-chat-panel
    page-renderer.tsx       # renders config pages → block grid
    shell/                  # sidebar, header, command-menu
    theme/                  # theme-provider, theme-switcher, theme-script
    ui/                     # shadcn/ui source components
  hooks/
    use-api-query.ts        # generic SWR-like API poller
    use-event-source.ts     # SSE event stream hook
  lib/
    config-loader.ts        # YAML parser + Zod validation (cached)
    config-schema.ts        # Zod schema for config file
    utils.ts                # cn() helper (clsx + tailwind-merge)
  types/                    # shared TypeScript interfaces
src-tauri/                  # optional Tauri desktop scaffold
```

## Showcase

The built-in showcase app demonstrates all 100 components with live demos:

- **Landing** (`/showcase`) — category cards with component counts
- **Category pages** (`/showcase/[category]`) — live demos per category
- **Theme playground** (`/showcase/themes`) — side-by-side theme comparison
- **Preview** (`/preview`) — quick component preview

## Component Registry

The `public/r/` directory contains a shadcn-compatible component registry:

```
public/r/
  index.json              # full catalog with metadata
  mn-badge.json           # individual component (source + deps)
  mn-gauge.json
  ...
```

Each component JSON includes:
- Source code (ready to copy into your project)
- npm dependencies (e.g., `recharts`, `lucide-react`)
- Internal registry dependencies (shared utilities)

## Themes

Switch via header dropdown, command palette (Cmd-K), or the rotary dial.

| Theme | Background | Accent | Use case |
|---|---|---|---|
| Navy | Deep blue `#0d2045` | Gold `#FFC72C` | Default — Maranello signature |
| Dark | Near-black `#111111` | Gold `#FFC72C` | High contrast dark |
| Light | Warm ivory `#FAF3E6` | Red `#DC0000` | Light/warm (Avorio) |
| Colorblind | Dark `#111111` | Blue `#0072B2` | Okabe-Ito safe palette |

All themes use `--mn-*` CSS custom properties defined in `globals.css`. All pass WCAG 2.2 AA. See `docs/guides/adding-a-theme.md` for adding a 5th theme.

## Component Catalog (100 components)

```tsx
import { MnBadge, MnChart, MnDataTable, MnGauge } from "@/components/maranello"
```

| Category | Count | Components |
|---|---|---|
| Data Visualization | 14 | chart, gauge, half-gauge, heatmap, funnel, waterfall, speedometer, confidence-chart, bullet-chart, hbar, pipeline-ranking, cost-timeline, cohort-grid, budget-treemap |
| Data Display | 12 | data-table, user-table, kpi-scorecard, flip-counter, progress-ring, token-meter, source-cards, detail-panel, badge, avatar, icon, spinner |
| Forms & Input | 11 | form-field, async-select, search-drawer, date-picker, date-range-picker, calendar-range, filter-panel, toggle-switch, voice-input, login, profile |
| Strategy | 11 | bcg-matrix, nine-box-matrix, risk-matrix, decision-matrix, swot, porter-five-forces, business-model-canvas, strategy-canvas, okr, customer-journey, customer-journey-map |
| Network & System | 10 | mesh-network, mesh-network-card, mesh-network-canvas, mesh-network-toolbar, network-messages, system-status, deployment-table, social-graph, org-chart, map |
| Operations | 8 | binnacle, instrument-binnacle, night-jobs, audit-log, gantt, kanban-board, entity-workbench, facet-workbench |
| Layout | 8 | grid-layout, section-card, admin-shell, settings-panel, dashboard, dashboard-strip, dashboard-renderer, header-shell |
| Agentic / AI | 7 | agent-trace, approval-chain, neural-nodes, augmented-brain, hub-spoke, active-missions, chat |
| Feedback | 6 | toast, state-scaffold, modal, notification-center, streaming-text, activity-feed |
| Theme Controls | 6 | theme-toggle, theme-rotary, ferrari-control, a11y, a11y-fab, dropdown-menu |
| Navigation | 5 | breadcrumb, tabs, stepper, section-nav, command-palette |
| Financial | 2 | finops, agent-cost-breakdown |

### Key patterns

- **CVA + cn()** for variant styling
- **`"use client"`** only where hooks are used
- **Named exports** only (no default exports)
- **CSS custom properties** (`--mn-*`) for all colors — never hardcoded
- **Canvas components** use `ResizeObserver` + dimension guards + `CanvasSafeArc`
- **Hydration-safe formatting** via `mn-format.ts` (no `toLocaleString`)
- **Max 250 lines per file** — logic extracted to `.helpers.ts` siblings

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:8420` | Backend API URL (server-side, optional) |
| `NEXT_PUBLIC_API_URL` | — | Client-side API URL (optional) |
| `SESSION_SECRET` | `convergio-dev-secret` | HMAC signing secret for session cookies |
| `MARANELLO_CONFIG_PATH` | `./maranello.yaml` | Override config file path |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |

## Design Principles (CONSTITUTION.md)

- **WCAG 2.2 AA** minimum accessibility
- **4 themes always** — every component works in navy, dark, light, colorblind
- **Keyboard-first** — Cmd-K, Tab navigation, focus rings
- **Lucide icons only** — zero emoji
- **Max 250 lines per file** — split into component + `.helpers.ts`
- **shadcn source-first** — UI components live in your repo
- **TypeScript strict** — no `any`, named exports only

## License

MPL-2.0
