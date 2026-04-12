# Using the Maranello Component Registry

Maranello components are distributed via a **shadcn-compatible registry**. This means you can install individual components into any Next.js or React project using the `shadcn` CLI.

## Prerequisites

- A Next.js / React project with Tailwind CSS v4
- `shadcn` CLI installed (`npx shadcn@latest init` if starting fresh)
- CSS custom properties for Maranello themes (copy from `globals.css`)

## Installing Components

### Single component

```bash
npx shadcn add mn-badge --registry https://your-maranello-host/r
```

This copies the component source code into your project at `components/maranello/data-display/mn-badge.tsx` and installs any required npm dependencies.

### Multiple components

```bash
npx shadcn add mn-badge mn-gauge mn-data-table --registry https://your-maranello-host/r
```

### Browse available components

View the full registry at:

```
https://your-maranello-host/r/index.json
```

## Registry Structure

```
public/r/
  index.json          # Full catalog with metadata for all 100 components
  mn-badge.json       # Individual component (source + dependencies)
  mn-gauge.json
  mn-data-table.json
  ...
```

Each component JSON includes:
- **Source code** — the actual `.tsx` file ready to use
- **Dependencies** — npm packages required (e.g., `recharts`, `lucide-react`)
- **Registry dependencies** — other Maranello components or shared utilities needed

## Theme Setup

Maranello components use `--mn-*` CSS custom properties for theming. To get full theme support, copy the relevant CSS variable blocks from `globals.css` into your project's stylesheet.

The four themes (navy, dark, light, colorblind) are activated via the `data-theme` attribute on the `<html>` element. Use the included `ThemeProvider` or implement your own theme switching.

## Component Categories

| Category | Count | Examples |
|---|---|---|
| Data Visualization | 14 | chart, gauge, heatmap, funnel, waterfall |
| Data Display | 12 | data-table, kpi-scorecard, badge, avatar |
| Forms & Input | 11 | form-field, search-drawer, date-picker |
| Strategy | 11 | bcg-matrix, swot, okr, risk-matrix |
| Network & System | 10 | mesh-network, system-status, org-chart |
| Operations | 8 | gantt, kanban-board, audit-log |
| Layout | 8 | grid-layout, dashboard, header-shell |
| Agentic / AI | 7 | agent-trace, neural-nodes, chat |
| Feedback | 6 | toast, modal, notification-center |
| Theme Controls | 6 | theme-toggle, theme-rotary, a11y |
| Navigation | 5 | breadcrumb, tabs, command-palette |
| Financial | 2 | finops, agent-cost-breakdown |
