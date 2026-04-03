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

## Install Components in Your Project

Maranello components are available via a shadcn-compatible registry. Add individual components to any Next.js or React project:

```bash
npx shadcn add mn-badge --registry https://your-host/r
npx shadcn add mn-gauge --registry https://your-host/r
npx shadcn add mn-data-table --registry https://your-host/r
```

Or browse the full registry at `/r/index.json`. See `docs/guides/using-the-registry.md` for full setup instructions.

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 App Router |
| UI Primitives | shadcn/ui + Base UI + Tailwind CSS v4 |
| Design System | Maranello — 100 components with `Mn` prefix |
| Typography | Outfit (headings), Inter (body), Barlow Condensed (mono/data) |
| Themes | 4: Navy, Dark, Light, Colorblind (WCAG 2.2 AA) |
| Icons | Lucide only (no emoji — CONSTITUTION P2) |
| AI | Vercel AI SDK v6 (optional — not required for design system) |
| Desktop | Tauri (optional, `src-tauri/`) |

---

## Config-Driven Architecture

The app reads `maranello.yaml` (or `convergio.yaml`) at startup for branding, navigation, dashboard pages, and AI agents. Edit this file and restart the dev server — no source code changes needed.

The config loader searches for files in this order:

1. `$MARANELLO_CONFIG_PATH` (env var override)
2. `$CONVERGIO_CONFIG_PATH` (env var override)
3. `./maranello.yaml` (project root)
4. `./convergio.yaml` (project root)

`src/lib/config-loader.ts` parses the YAML, validates it with Zod (`src/lib/config-schema.ts`), and caches the result.

### Full YAML Schema Reference

```yaml
# ── App Identity ──
app:
  name: "My App"                      # required — displayed in header/title
  description: "My app description"   # optional
  logo: "/logo.svg"                   # optional — path to logo asset

# ── Theme ──
theme:
  default: navy                       # light | dark | navy | colorblind
  storageKey: my-theme                # optional — localStorage key for persistence

# ── API Connection (optional) ──
api:
  baseUrl: http://localhost:8420      # backend API URL (must be valid URL)

# ── AI Agents (optional) ──
ai:
  defaultAgent: jervis                # id of the default agent
  agents:
    - id: jervis                      # unique identifier
      name: Jervis                    # display name
      description: "Platform AI"      # description
      provider: openai                # LLM provider
      model: gpt-4o                   # model name
      systemPrompt: |                 # system prompt for the agent
        You are Jervis, a helpful assistant.
      apiRoute: /api/chat             # optional — API endpoint
      avatar: J                       # optional — avatar character
      maxTokens: 2048                 # optional — max response tokens

# ── Navigation ──
# Defines sidebar navigation. Each section has a label and a list of items.
# Icons must be valid Lucide icon names registered in src/lib/icon-map.ts.
navigation:
  sections:
    - label: Overview
      items:
        - id: dashboard
          label: Dashboard
          href: /dashboard
          icon: LayoutDashboard
          badge: 3                    # optional — numeric badge

        - id: settings
          label: Settings
          href: /settings
          icon: Settings

# ── Pages ──
# Config-driven dashboard pages. Each route maps to a page with rows of blocks.
# The page-renderer reads this config and renders the appropriate block components.
pages:
  /:                                  # route path
    title: Dashboard                  # page title (required)
    description: "Overview"           # optional
    rows:
      - columns: 4                    # number of grid columns (1-12)
        blocks:
          - type: kpi-card            # block type (see list below)
            label: Active Users
            value: "1,234"
            change: "+12%"
            trend: up                 # up | down | flat

      - columns: 2
        blocks:
          - type: gauge-block
            value: 73
            min: 0
            max: 100
            unit: "%"
            label: CPU Load
            animate: true
            size: md                  # sm | md | lg | fluid

          - type: chart-block
            chartType: bar            # sparkline | donut | area | bar | radar | bubble
            labels: [Mon, Tue, Wed]
            series:
              - label: Visits
                data: [100, 200, 150]
            showLegend: true
            animate: true

      - columns: 1
        blocks:
          - type: ai-chat
            agentId: jervis           # optional — references ai.agents[].id
```

### Available Block Types

| Block Type | Description | Key Props |
|---|---|---|
| `kpi-card` | Metric card with trend | `label`, `value`, `change`, `trend` |
| `data-table` | Simple table | `columns[]`, `rows[]` |
| `data-table-maranello` | Rich data table | `columns[]`, `data[]` |
| `activity-feed` | Timeline of events | `items[]{time, text, status}` |
| `stat-list` | Key-value stat list | `items[]{label, value, status}` |
| `empty-state` | Placeholder | `title`, `description`, `actionLabel`, `actionHref` |
| `ai-chat` | AI chat panel | `agentId` |
| `gauge-block` | Radial gauge | `value`, `min`, `max`, `unit`, `label`, `size` |
| `chart-block` | Chart (6 types) | `chartType`, `series[]`, `labels[]`, `segments[]`, `points[]`, `radarData[]` |
| `funnel-block` | Sales/conversion funnel | `data{pipeline[], total}`, `size` |
| `hbar-block` | Horizontal bar chart | `bars[]{label, value, color}` |
| `speedometer-block` | Speedometer dial | `value`, `min`, `max` |
| `gantt-block` | Gantt timeline | `tasks[]` |
| `kanban-block` | Kanban board | `columns[]`, `cards[]` |
| `okr-block` | OKR tracker | `objectives[]` |
| `map-block` | Geographic map | (passthrough) |
| `system-status-block` | Service status panel | `services[]{id, name, status}`, `incidents[]` |

---

## Architecture

```
maranello.yaml              # config: branding, nav, pages, AI agents
public/r/                   # shadcn-compatible component registry
src/
  app/
    (dashboard)/            # shell — layout with sidebar + header
      showcase/             # component showcase landing
        [category]/         # per-category live demo pages (12 categories)
        icons/              # icon browser with search + copy-to-clipboard
        themes/             # theme playground — side-by-side comparison
    api/
      chat/route.ts         # AI streaming endpoint (optional)
      health/route.ts       # liveness probe
    globals.css             # theme tokens: --mn-* + shadcn bridge vars
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
      theme/                #   6 theme control + accessibility components
      shared/               #   shared utilities + tests
      index.ts              #   barrel re-export (all 100 components)
    blocks/                 # page blocks: renders config → UI
    page-renderer.tsx       # renders config pages → block grid
    shell/                  # sidebar, header, command-menu (Cmd-K)
    theme/                  # theme-provider, theme-switcher, theme-script
    ui/                     # shadcn/ui source components
  hooks/
    use-api-query.ts        # generic SWR-like API poller
    use-event-source.ts     # SSE event stream hook
  lib/
    config-loader.ts        # YAML parser + Zod validation (cached)
    config-schema.ts        # Zod schema for config file
    config-block-schemas.ts # Zod schemas for each block type
    component-catalog.ts    # 100-entry catalog with bilingual search
    icon-map.ts             # Lucide icon name → component resolver
    icon-slot.tsx           # <IconSlot name="..." /> for dynamic icons
    utils.ts                # cn() helper (clsx + tailwind-merge)
  types/                    # shared TypeScript interfaces
src-tauri/                  # optional Tauri desktop scaffold
docs/
  guides/                   # how-to guides (see Documentation section)
  components/               # per-component MDX docs (100 files)
  adr/                      # architecture decision records
```

## Showcase

The built-in showcase app at `/showcase` demonstrates all 100 components with live interactive demos:

- **Landing** (`/showcase`) — category cards with component counts + live previews
- **Category pages** (`/showcase/[category]`) — live demos per category with inline documentation (description, when to use, props table, code examples)
- **Icons browser** (`/showcase/icons`) — searchable grid of all Lucide icons with click-to-copy import
- **Theme playground** (`/showcase/themes`) — side-by-side comparison across all 4 themes

### Sidebar Navigation

The sidebar is organized into two groups:

| Section | Items |
|---|---|
| **Design System** | Home, Icons |
| **Components** | Agentic AI, Data Display, Data Viz, Feedback, Financial, Forms, Layout, Navigation, Network, Operations, Strategy, Theme & A11y |

### Command Palette (Cmd-K)

Press `Cmd+K` (or `Ctrl+K`) to open the command palette with:
- **Fuzzy search** across all 100 components (bilingual IT/EN keywords)
- **Category navigation** — jump to any showcase section
- **Theme switching** — switch between all 4 themes

## Component Registry

The `public/r/` directory contains a shadcn-compatible component registry:

```
public/r/
  index.json              # full catalog with metadata for all 100 components
  mn-badge.json           # individual component (source + dependencies)
  mn-gauge.json
  ...
```

Each component JSON includes:
- **Source code** — the actual `.tsx` file, ready to paste into your project
- **npm dependencies** — packages required (e.g., `recharts`, `lucide-react`)
- **Registry dependencies** — other Maranello components or shared utilities needed

See `docs/guides/using-the-registry.md` for full installation instructions.

## Themes

Switch via header dropdown, command palette (Cmd-K), or the Manettino rotary dial.

| Theme | Background | Accent | Use case |
|---|---|---|---|
| Navy | Deep blue `#0d2045` | Gold `#FFC72C` | Default — Maranello signature |
| Dark | Near-black `#111111` | Gold `#FFC72C` | High contrast dark |
| Light | Warm ivory `#FAF3E6` | Red `#DC0000` | Light/warm (Avorio) |
| Colorblind | Dark `#111111` | Blue `#0072B2` | Okabe-Ito safe palette |

All themes use `--mn-*` CSS custom properties defined in `globals.css`. All pass WCAG 2.2 AA. See `docs/guides/adding-a-theme.md` for adding a 5th theme.

### Accessibility (A11y)

The app includes `MnA11yFab`, a floating accessibility toolbar giving users runtime control over:
- **Font size** — S / M / L / XL
- **Line spacing** — 1x / 1.5x / 2x
- **Dyslexia font** — toggles OpenDyslexic
- **Reduced motion** — disables animations
- **High contrast** — increases contrast ratios
- **Focus indicators** — toggle visible focus rings

See `docs/guides/extending-the-system.md` § 5 for WCAG compliance details.

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

### Key Patterns

- **CVA + cn()** for variant styling
- **`"use client"`** only where hooks are used
- **Named exports** only (no default exports)
- **CSS custom properties** (`--mn-*`) for all colors — never hardcoded hex
- **Canvas components** use `ResizeObserver` + dimension guards + `CanvasSafeArc`
- **Hydration-safe formatting** via `mn-format.ts` (no `toLocaleString`)
- **Max 250 lines per file** — logic extracted to `.helpers.ts` siblings

## Documentation

Full documentation lives in `docs/`:

| Path | Content |
|---|---|
| `docs/guides/creating-a-component.md` | Step-by-step guide: naming, CVA template, theme tokens, barrel exports, registry, showcase demo, testing |
| `docs/guides/adding-icons.md` | How to add Lucide icons, `IconSlot` vs direct import, custom SVG icons, sizing & coloring |
| `docs/guides/adding-a-theme.md` | How to add a 5th theme: CSS tokens, ThemeProvider, theme-script, toggle/rotary |
| `docs/guides/extending-the-system.md` | Adding categories, themes, design tokens, WCAG AA compliance |
| `docs/guides/using-the-registry.md` | How to install components via shadcn CLI into your project |
| `docs/components/{category}/` | Per-component MDX: description, props table, code example, a11y notes |
| `docs/adr/` | Architecture decision records |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:8420` | Backend API URL (server-side, optional) |
| `NEXT_PUBLIC_API_URL` | — | Client-side API URL (optional) |
| `SESSION_SECRET` | `convergio-dev-secret` | HMAC signing secret for session cookies |
| `MARANELLO_CONFIG_PATH` | `./maranello.yaml` | Override config file path |
| `CONVERGIO_CONFIG_PATH` | `./convergio.yaml` | Alternate config file path |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm format` | Format code with Prettier |

## Design Principles (CONSTITUTION.md)

- **WCAG 2.2 AA** minimum accessibility
- **4 themes always** — every component works in navy, dark, light, colorblind
- **Keyboard-first** — Cmd-K, Tab navigation, focus rings
- **Lucide icons only** — zero emoji (CONSTITUTION P2)
- **Max 250 lines per file** — split into component + `.helpers.ts`
- **shadcn source-first** — UI components live in your repo, not in node_modules
- **TypeScript strict** — no `any`, named exports only
- **Config-driven** — branding, navigation, and pages defined in YAML

## License

MPL-2.0
