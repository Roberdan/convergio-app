# Creating a New Maranello Component

> Step-by-step guide for adding a component to the Maranello design system while
> keeping naming, theming, accessibility, and registration consistent.

---

## 1 — Naming Convention

Every Maranello component follows a strict naming scheme:

| Aspect | Convention | Example |
|---|---|---|
| **Prefix** | `Mn` (PascalCase) | `MnStatusIndicator` |
| **File name** | `mn-` prefix, kebab-case | `mn-status-indicator.tsx` |
| **Props interface** | `<ComponentName>Props` | `MnStatusIndicatorProps` |
| **CVA variants const** | `mn<Name>Variants` | `mnStatusIndicatorVariants` |
| **Helpers file** | same base + `.helpers.ts` | `mn-status-indicator.helpers.ts` |

- **Always use named exports** — never `export default`.
- The file name mirrors the component name: `MnMyWidget` → `mn-my-widget.tsx`.

---

## 2 — File Structure

Components live under a **category** folder inside `src/components/maranello/`:

```
src/components/maranello/{category}/
  mn-my-widget.tsx            # Main component (≤ 250 lines)
  mn-my-widget.helpers.ts     # Types, constants, helpers (if needed)
  index.ts                    # Category barrel — re-exports all components
```

### Existing categories

`agentic` · `data-display` · `data-viz` · `feedback` · `financial` · `forms` ·
`layout` · `navigation` · `network` · `ops` · `shared` · `strategy` · `theme`

Pick the category that best fits your component's purpose. If none fits, discuss
with the team before creating a new category.

---

## 3 — Component Template

Below is the canonical skeleton every Maranello component should follow.

```tsx
"use client"
// ↑ Only include if the component uses React hooks (useState, useEffect, etc.)

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const mnMyWidgetVariants = cva(
  // Base classes — layout, typography, theme-aware colors
  [
    "inline-flex items-center gap-2 rounded-md px-3 py-1.5",
    "text-sm font-medium",
    "text-[var(--mn-text)] bg-[var(--mn-surface)]",
    "border border-[var(--mn-border)]",
    "transition-colors duration-150",
  ],
  {
    variants: {
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
      tone: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-[var(--mn-success-bg)] text-[var(--mn-success)]",
        warning: "bg-[var(--mn-warning-bg)] text-[var(--mn-warning)]",
        danger:  "bg-[var(--mn-error-bg)]   text-[var(--mn-error)]",
      },
    },
    defaultVariants: { size: "md", tone: "neutral" },
  },
)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MnMyWidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mnMyWidgetVariants> {
  /** A short label rendered inside the widget. */
  label: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Brief JSDoc description of what this component does. */
export function MnMyWidget({
  label,
  size,
  tone,
  className,
  ...props
}: MnMyWidgetProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(mnMyWidgetVariants({ size, tone }), className)}
      {...props}
    >
      {label}
    </div>
  )
}

export { mnMyWidgetVariants }
```

### Key rules

| Rule | Detail |
|---|---|
| `"use client"` | Only add when the component uses hooks or browser APIs. |
| `cn()` | Always merge CVA output with the incoming `className` prop via `cn()`. |
| Named export | `export function MnX` — never `export default`. |
| No `any` | Use strict TypeScript types. Prefer generics over `any`. |
| CSS vars | All colors through `--mn-*` custom properties — **never** hardcoded hex values. |
| Accessibility | Include `role`, `aria-label`, or `aria-*` attributes as appropriate. |
| Responsive | Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) for layout changes. |

---

## 4 — Theme Support

### CSS custom properties

Maranello themes define a set of `--mn-*` CSS variables. Always reference them
via Tailwind arbitrary values:

```tsx
// ✅ Correct — adapts to every theme automatically
"text-[var(--mn-text)] bg-[var(--mn-surface)] border-[var(--mn-border)]"

// ❌ Wrong — breaks when the user switches theme
"text-white bg-[#1a1a2e] border-gray-700"
```

Common variables:

| Variable | Purpose |
|---|---|
| `--mn-text` | Primary text |
| `--mn-text-muted` | Secondary/muted text |
| `--mn-text-tertiary` | Tertiary text |
| `--mn-surface` | Default surface background |
| `--mn-surface-raised` | Elevated surface (cards, popovers) |
| `--mn-surface-sunken` | Recessed surface |
| `--mn-border` | Default border |
| `--mn-accent` | Brand accent color |
| `--mn-success` / `--mn-success-bg` | Success semantic pair |
| `--mn-warning` / `--mn-warning-bg` | Warning semantic pair |
| `--mn-error` / `--mn-error-bg` | Error/danger semantic pair |
| `--mn-info` / `--mn-info-bg` | Info semantic pair |
| `--mn-hover-bg` | Hover state background |

### Canvas / SVG components — `readPalette()` pattern

For components that render on `<canvas>` or `<svg>` and cannot use CSS classes,
read computed CSS variable values at runtime:

```ts
export function readPalette(el: Element) {
  const g = (name: string, fallback: string) =>
    getComputedStyle(el).getPropertyValue(name).trim() || fallback

  const theme = document.documentElement.getAttribute("data-theme") ?? "navy"
  const isLight = theme === "light"

  return {
    text:   isLight ? "#1a1206" : g("--mn-text", "#fafafa"),
    accent: g("--mn-accent", "#FFC72C"),
    border: g("--mn-border", "#333"),
    // ...add what the component needs
  }
}
```

Call `readPalette` inside a `useEffect` or event handler where you have a
reference to a mounted DOM element.

### Testing across themes

Every component must look correct on all four themes:

1. **navy** (default dark)
2. **dark** (pure dark)
3. **light**
4. **colorblind** (deuteranopia-safe palette)

Toggle themes in the showcase and visually verify contrast. All text must meet
**WCAG 2.2 AA** contrast ratios (4.5:1 for normal text, 3:1 for large text).

---

## 5 — Icons

> **CONSTITUTION P2 — Zero emoji.** Only Lucide icons are allowed anywhere in
> the UI.

### Direct import

For components that always show a specific icon:

```tsx
import { CheckCircle, AlertTriangle } from "lucide-react"

<CheckCircle className="size-4 text-[var(--mn-success)]" />
```

### Dynamic resolution — `icon-map.ts`

When the icon name comes from data at runtime, use the shared icon map:

```tsx
import { resolveIcon } from "@/lib/icon-map"

const Icon = resolveIcon(iconName)
return Icon ? <Icon className="size-4" /> : null
```

If your component needs an icon that isn't already registered, add it to
`src/lib/icon-map.ts`:

```ts
import { Satellite } from "lucide-react"

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  // ... existing entries
  Satellite,
}
```

---

## 6 — Max 250 Lines Rule

If a component file exceeds **250 lines**, extract supporting code into a
co-located `.helpers.ts` file.

### What to extract

| Extract to `.helpers.ts` | Keep in `.tsx` |
|---|---|
| Type aliases & interfaces | Component function + JSX |
| Constants (class strings, config objects) | CVA variant definition |
| Utility / transformation functions | Props interface (if small) |
| Custom hooks used only by this component | Imports & exports |
| Sub-components that don't need their own file | |

### Example split

**`mn-status-indicator.helpers.ts`**

```ts
import * as React from "react"

export type StatusLevel = "healthy" | "degraded" | "critical" | "unknown"

export const STATUS_LABELS: Record<StatusLevel, string> = {
  healthy:  "Healthy",
  degraded: "Degraded",
  critical: "Critical",
  unknown:  "Unknown",
}

export function usePolling(url: string, intervalMs: number) {
  const [data, setData] = React.useState<unknown>(null)
  React.useEffect(() => {
    const id = setInterval(() => fetch(url).then(r => r.json()).then(setData), intervalMs)
    return () => clearInterval(id)
  }, [url, intervalMs])
  return data
}
```

**`mn-status-indicator.tsx`** — imports from the helpers file:

```ts
import { type StatusLevel, STATUS_LABELS, usePolling } from "./mn-status-indicator.helpers"
```

---

## 7 — Registration Checklist

After your component compiles and renders correctly, register it everywhere:

### 7.1 — Category barrel

Add named exports to `src/components/maranello/{category}/index.ts`:

```ts
export { MnStatusIndicator } from "./mn-status-indicator"
export type { MnStatusIndicatorProps } from "./mn-status-indicator"
```

The root barrel at `src/components/maranello/index.ts` re-exports every
category with `export * from "./{category}"`, so your component is
automatically available via:

```ts
import { MnStatusIndicator } from "@/components/maranello"
```

### 7.2 — Shadcn registry

Create `public/r/mn-status-indicator.json`:

```json
{
  "name": "mn-status-indicator",
  "type": "registry:ui",
  "files": [
    {
      "path": "components/maranello/feedback/mn-status-indicator.tsx",
      "content": "… full file content …",
      "type": "registry:ui"
    }
  ],
  "dependencies": ["class-variance-authority"],
  "registryDependencies": []
}
```

Then add an entry to `public/r/index.json`:

```json
{
  "name": "mn-status-indicator",
  "type": "registry:ui",
  "description": "Semantic status dot with label — healthy, degraded, critical, unknown.",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": [],
  "files": ["feedback/mn-status-indicator.tsx"]
}
```

### 7.3 — Showcase demo

Add a demo section to the appropriate showcase file in
`src/app/(dashboard)/showcase/` so the component is visible in the living
catalog. See [Section 8](#8--complete-example) for a concrete example.

### 7.4 — Unit test

If the component contains conditional logic, state, or data transformations,
add a test in `src/components/maranello/shared/` following the existing
`mn-simple.test.tsx` / `mn-complex.test.tsx` pattern:

```tsx
import { render, screen } from "@testing-library/react"
import { MnStatusIndicator } from "../feedback/mn-status-indicator"

describe("MnStatusIndicator", () => {
  it("renders the label for a given status", () => {
    render(<MnStatusIndicator status="healthy" />)
    expect(screen.getByText("Healthy")).toBeInTheDocument()
  })
})
```

---

## 8 — Complete Example

Let's build **`MnStatusIndicator`** end-to-end — a small component that shows a
colored dot next to a status label.

### 8.1 — The component file

**`src/components/maranello/feedback/mn-status-indicator.tsx`**

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Activity } from "lucide-react"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StatusLevel = "healthy" | "degraded" | "critical" | "unknown"

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const mnStatusIndicatorVariants = cva(
  "inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        healthy:
          "bg-[var(--mn-success-bg)] text-[var(--mn-success)]",
        degraded:
          "bg-[var(--mn-warning-bg)] text-[var(--mn-warning)]",
        critical:
          "bg-[var(--mn-error-bg)] text-[var(--mn-error)]",
        unknown:
          "bg-muted text-muted-foreground",
      },
      size: {
        sm: "text-[0.65rem] px-1.5 py-0.5 gap-1",
        md: "text-xs px-2.5 py-1 gap-2",
        lg: "text-sm px-3 py-1.5 gap-2",
      },
    },
    defaultVariants: { status: "unknown", size: "md" },
  },
)

// ---------------------------------------------------------------------------
// Dot color map (uses same CSS variables as the variant text color)
// ---------------------------------------------------------------------------

const dotColor: Record<StatusLevel, string> = {
  healthy:  "bg-[var(--mn-success)]",
  degraded: "bg-[var(--mn-warning)]",
  critical: "bg-[var(--mn-error)]",
  unknown:  "bg-muted-foreground",
}

const STATUS_LABELS: Record<StatusLevel, string> = {
  healthy:  "Healthy",
  degraded: "Degraded",
  critical: "Critical",
  unknown:  "Unknown",
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MnStatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof mnStatusIndicatorVariants> {
  /** Current status level. */
  status?: StatusLevel
  /** Override the default label text. */
  label?: string
  /** Show a leading Activity icon. */
  showIcon?: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * `MnStatusIndicator` renders a colored dot + label reflecting a service or
 * entity health status. Adapts automatically to all Maranello themes.
 */
export function MnStatusIndicator({
  status = "unknown",
  size,
  label,
  showIcon = false,
  className,
  ...props
}: MnStatusIndicatorProps) {
  const displayLabel = label ?? STATUS_LABELS[status]

  return (
    <span
      role="status"
      aria-label={displayLabel}
      className={cn(mnStatusIndicatorVariants({ status, size }), className)}
      {...props}
    >
      {showIcon && <Activity className="size-3 shrink-0" aria-hidden="true" />}
      <span
        className={cn("size-2 shrink-0 rounded-full", dotColor[status])}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  )
}

export { mnStatusIndicatorVariants }
```

### 8.2 — Add to the category barrel

**`src/components/maranello/feedback/index.ts`** — append:

```ts
export { MnStatusIndicator, mnStatusIndicatorVariants } from "./mn-status-indicator"
export type { MnStatusIndicatorProps, StatusLevel } from "./mn-status-indicator"
```

Because the root barrel already has `export * from "./feedback"`, you can now
import from anywhere:

```ts
import { MnStatusIndicator } from "@/components/maranello"
```

### 8.3 — Add to the shadcn registry

Add an entry to `public/r/index.json`:

```json
{
  "name": "mn-status-indicator",
  "type": "registry:ui",
  "description": "Semantic status dot with label — healthy, degraded, critical, unknown.",
  "dependencies": ["class-variance-authority"],
  "registryDependencies": [],
  "files": ["feedback/mn-status-indicator.tsx"]
}
```

### 8.4 — Demo in the showcase

In the relevant showcase section (e.g., `showcase-utilities.tsx`), add:

```tsx
import { MnStatusIndicator } from "@/components/maranello"

{/* Status Indicators */}
<div className="rounded-lg border p-4 space-y-3">
  <h3 className="text-sm font-medium text-muted-foreground">
    MnStatusIndicator
  </h3>
  <div className="flex flex-wrap items-center gap-3">
    <MnStatusIndicator status="healthy" />
    <MnStatusIndicator status="degraded" />
    <MnStatusIndicator status="critical" showIcon />
    <MnStatusIndicator status="unknown" size="sm" />
    <MnStatusIndicator status="healthy" size="lg" label="All systems go" />
  </div>
</div>
```

---

## Quick-Reference Checklist

```
☐  File named mn-{name}.tsx in the correct category folder
☐  Component and props use Mn prefix (MnX / MnXProps)
☐  "use client" only if hooks are used
☐  CVA + cn() for variant styling
☐  Named export, never default
☐  All colors via --mn-* CSS variables — no hardcoded hex
☐  aria-* attributes for accessibility
☐  Lucide icons only — zero emoji
☐  File ≤ 250 lines (split to .helpers.ts if needed)
☐  Exported from category barrel index.ts
☐  Entry added to public/r/index.json + individual JSON
☐  Demo added to showcase
☐  Unit test if component has logic
☐  Visually verified on all 4 themes (navy, dark, light, colorblind)
```
