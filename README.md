# Convergio Frontend

Product-grade operational shell with Maranello visual language. Built on Next.js, shadcn/ui, Tailwind CSS.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript --noEmit
```

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 App Router |
| UI Primitives | shadcn/ui + Base UI + Tailwind CSS v4 |
| Typography | Outfit (headings), Inter (body), Barlow Condensed (mono/data) |
| Themes | 4: Navy, Dark, Light, Colorblind |
| Icons | Lucide (no emoji) |
| Desktop | Tauri-ready (src-tauri/) |

## Themes

Switch themes via the dropdown in the header or the command palette (Cmd-K).

| Theme | Background | Accent | Use case |
|---|---|---|---|
| Navy | Deep blue #0d2045 | Gold #FFC72C | Default — Maranello signature |
| Dark | Near-black #111111 | Gold #FFC72C | High contrast dark |
| Light | Warm ivory #FAF3E6 | Red #DC0000 | Light/warm (Avorio) |
| Colorblind | Dark #111111 | Blue #0072B2 | Okabe-Ito safe palette |

All themes pass WCAG 2.2 AA contrast requirements.

## Architecture

```
src/
  app/                    # Next.js App Router pages
    layout.tsx            # Root layout with providers + shell
    page.tsx              # Dashboard
    settings/page.tsx     # Settings form
    projects/page.tsx     # Empty state example
    loading.tsx           # Skeleton loading
    error.tsx             # Error boundary
    not-found.tsx         # 404
  components/
    shell/                # App shell components
      app-shell.tsx       # Layout compositor
      sidebar.tsx         # Collapsible nav sidebar
      header.tsx          # Fixed top header
      command-menu.tsx    # Cmd-K command palette
      shell-wrapper.tsx   # Client-side shell wrapper
    theme/                # Theme system
      theme-provider.tsx  # React context + localStorage
      theme-switcher.tsx  # Dropdown theme picker
    ui/                   # shadcn/ui components (source-first)
  config/
    navigation.ts         # Default nav sections
  lib/
    utils.ts              # cn() utility
src-tauri/                # Tauri desktop scaffold
  tauri.conf.json
  src/main.rs
  Cargo.toml
```

## Tauri (Desktop)

The project includes a Tauri scaffold for desktop builds. To use:

```bash
# Install Tauri CLI globally
cargo install tauri-cli

# Development
pnpm tauri:dev

# Production build
pnpm tauri:build
```

Web builds work independently — Tauri is not required for web development.

## Design Principles

- **Maranello visual language**: typography, spacing, density from convergio-design
- **shadcn source-first**: UI components live in your repo, not node_modules
- **4 themes always**: every surface, button, badge works in all themes
- **Keyboard-first**: Cmd-K everywhere, Tab navigation, focus rings
- **WCAG 2.2 AA**: contrast ratios, reduced-motion, focus indicators
- **Max 250 lines per file**: enforced by convention
- **No emoji**: Lucide SVG icons only
