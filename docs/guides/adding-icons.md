# Adding Icons

How to use icons in Maranello components. **Only Lucide SVG icons are allowed — zero emoji, ever** (Constitution P2).

## Finding Icons

Browse the full Lucide library at [lucide.dev/icons](https://lucide.dev/icons). Search by name or keyword to find the icon you need.

## Adding a New Icon

### 1. Import in the icon map

File: `src/lib/icon-map.ts`

Import the icon from `lucide-react` and add it to the `iconMap` object:

```ts
import {
  // ... existing imports
  Rocket,            // ← add your import
} from "lucide-react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  // ... existing entries
  Rocket,            // ← add to the map
};
```

### 2. Use the icon

There are two ways to render icons. Choose based on context:

**Dynamic resolution with `IconSlot`** — for config-driven UI where the icon name is a string (sidebar navigation, YAML config, registry metadata):

```tsx
import { IconSlot } from "@/lib/icon-slot";

<IconSlot name="Rocket" className="size-5" />
```

`IconSlot` calls `resolveIcon(name)` under the hood. If the name isn't found in the map it renders an empty `<span>` as a safe fallback.

**Direct import** — for static component code where you know the icon at build time:

```tsx
import { Rocket } from "lucide-react";

<Rocket className="size-5 text-muted-foreground" />
```

## When to Use IconSlot vs Direct Import

| Approach | Use when |
|---|---|
| `<IconSlot name="..." />` | The icon name comes from config, YAML, or props at runtime — sidebar nav, category registry, command palette |
| `import { X } from "lucide-react"` | The icon is hard-coded in a component — buttons, empty states, inline indicators |

## Icon Sizing

Use Tailwind utility classes for sizing. Never use inline `width`/`height` props.

| Class | Size | Use for |
|---|---|---|
| `size-3` | 12px | Inline indicators, badge icons |
| `size-4` | 16px | Buttons, menu items, table cells |
| `size-5` | 20px | Sidebar navigation, card headers |
| `size-6` / `h-6 w-6` | 24px | Page titles, empty states |
| `size-8` | 32px | Hero sections, onboarding |

Example:

```tsx
<Search className="size-4" />
<BarChart3 className="size-5 shrink-0" />
```

## Icon Coloring

Use semantic Tailwind color classes — never hardcode hex or RGB values.

| Class | When to use |
|---|---|
| `text-muted-foreground` | Default/secondary icons (most common) |
| `text-foreground` | Primary-weight icons |
| `text-primary` | Accent/brand icons |
| `text-destructive` | Error or danger indicators |
| `text-[var(--mn-success)]` | Status: success |
| `text-[var(--mn-warning)]` | Status: warning |
| `text-[var(--mn-error)]` | Status: error |

Example:

```tsx
<AlertTriangle className="size-4 text-[var(--mn-warning)]" />
<Settings className="size-4 text-muted-foreground" />
```

## Creating Custom Icon Components

When Lucide doesn't have the icon you need, wrap your SVG in a component that follows Lucide's API pattern so it works seamlessly with the rest of the system.

```tsx
import type { ComponentType } from "react";

interface CustomIconProps {
  className?: string;
  strokeWidth?: number;
}

export const MyCustomIcon: ComponentType<CustomIconProps> = ({
  className,
  strokeWidth = 2,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Your paths here */}
    <path d="M12 2L2 22h20L12 2z" />
  </svg>
);
```

To make a custom icon available via `IconSlot`, add it to the icon map:

```ts
// src/lib/icon-map.ts
import { MyCustomIcon } from "@/components/icons/my-custom-icon";

const iconMap = {
  // ... existing entries
  MyCustomIcon,
};
```

## Checklist

- [ ] Icon imported from `lucide-react` (or custom component following Lucide API)
- [ ] Added to `iconMap` in `src/lib/icon-map.ts` (if used dynamically)
- [ ] Sized with Tailwind classes (`size-4`, `size-5`, etc.)
- [ ] Colored with semantic classes (`text-muted-foreground`, `text-primary`, etc.)
- [ ] No emoji anywhere — Lucide SVG icons only
