# Extending the System

How to add new categories, themes, design tokens, and components to Maranello.

---

## 1. Adding a New Category

A category is a top-level grouping of related components (e.g. `data-viz`, `feedback`, `ops`).

### 1.1 Create the directory and barrel

```bash
mkdir -p src/components/maranello/{new-category}
```

Create the barrel file at `src/components/maranello/{new-category}/index.ts`:

```ts
export { MnMyComponent } from "./mn-my-component";
```

### 1.2 Re-export from the root barrel

File: `src/components/maranello/index.ts`

```ts
// ... existing exports
export * from "./{new-category}";
```

### 1.3 Add to sidebar navigation

File: `src/app/(dashboard)/layout.tsx`

Add a new entry to the appropriate section array:

```ts
{
  label: "New Category",
  href: "/showcase/{new-category}",
  iconName: "MyIcon",
},
```

The `iconName` must match a key in `src/lib/icon-map.ts`. If the icon doesn't exist yet, add it (see `docs/guides/adding-icons.md`).

### 1.4 Add to Cmd-K command palette

File: `src/components/shell/command-menu.tsx`

Add to the `CATEGORY_ITEMS` array:

```ts
const CATEGORY_ITEMS = [
  // ... existing items
  { label: "New Category", href: "/showcase/{new-category}", icon: MyIcon },
] as const
```

Import the Lucide icon at the top of the file.

### 1.5 Add to the category registry

File: `src/app/(dashboard)/showcase/category-registry.tsx`

Add a new entry to the `CATEGORIES` array:

```ts
{
  slug: '{new-category}',
  name: 'New Category',
  icon: MyIcon,
  count: 1,
  description: 'Brief description of what this category contains.',
},
```

Import the Lucide icon at the top of the file. The `TOTAL_COMPONENTS` and `TOTAL_CATEGORIES` values are computed automatically.

### 1.6 Add the icon to icon-map.ts

File: `src/lib/icon-map.ts`

Import and register the icon so `IconSlot` can resolve it in the sidebar:

```ts
import { MyIcon } from "lucide-react";

const iconMap = {
  // ... existing entries
  MyIcon,
};
```

### 1.7 Create the showcase page

Create `src/app/(dashboard)/showcase/{new-category}/page.tsx` to display your components.

---

## 2. Adding a New Theme

A detailed, step-by-step guide already exists at **`docs/guides/adding-a-theme.md`**. Below is a summary of the required touchpoints.

### Quick checklist

| Step | File | What to do |
|---|---|---|
| 1 | `src/components/theme/theme-provider.tsx` | Add name to `THEMES` tuple; update `applyTheme()` dark/light classification |
| 2 | `src/app/globals.css` | Add `[data-theme="mytheme"]` block with all `--mn-*` and shadcn bridge tokens |
| 3 | `src/components/theme/theme-script.tsx` | Add to allowlist array for flash prevention |
| 4 | `src/components/maranello/theme/mn-theme-toggle.tsx` | Add `THEME_META` entry |
| 5 | `src/components/maranello/theme/mn-theme-rotary.tsx` | Add `POSITIONS` entry |
| 6 | `src/components/shell/command-menu.tsx` | Add to `THEME_ITEMS` array |

### Validation

- Verify WCAG 2.2 AA contrast ratios: **4.5:1** for normal text, **3:1** for large text and UI elements
- Toggle through all themes — no flash on reload
- Test all components render correctly in the new theme

See `docs/guides/adding-a-theme.md` for full details including CSS variable templates and examples.

---

## 3. Customizing `--mn-*` Tokens

Maranello uses CSS custom properties (design tokens) prefixed with `--mn-` for all visual styling. These are defined in `src/app/globals.css` and can be overridden per-theme or globally.

### Token naming convention

```
--mn-{category}-{name}
```

### Available tokens

#### Accent

| Token | Purpose |
|---|---|
| `--mn-accent` | Primary brand/accent color |
| `--mn-accent-hover` | Hover state of accent |
| `--mn-accent-text` | Text rendered on accent backgrounds |
| `--mn-accent-bg` | Subtle accent-tinted background |
| `--mn-accent-border` | Accent-tinted border |

#### Surfaces

| Token | Purpose |
|---|---|
| `--mn-surface` | Default surface/background |
| `--mn-surface-raised` | Elevated surface (cards, popovers) |
| `--mn-surface-sunken` | Recessed/inset surface |
| `--mn-surface-input` | Input field background |
| `--mn-surface-overlay` | Overlay/popover background |
| `--mn-surface-hover` | Surface hover state |

#### Text

| Token | Purpose |
|---|---|
| `--mn-text` | Primary text color |
| `--mn-text-muted` | Secondary/muted text |
| `--mn-text-secondary` | Secondary text (alias) |
| `--mn-text-tertiary` | Tertiary/hint text |
| `--mn-text-disabled` | Disabled state text |
| `--mn-text-inverse` | Text on inverse backgrounds |

#### Borders & Focus

| Token | Purpose |
|---|---|
| `--mn-border` | Default border color |
| `--mn-border-subtle` | Subtle separator/divider |
| `--mn-border-strong` | Emphasized border |
| `--mn-border-focus` | Focus ring border |
| `--mn-border-error` | Error state border |
| `--mn-focus-ring` | Focus ring color |
| `--mn-focus-ring-offset` | Focus ring offset color |

#### Interactive States

| Token | Purpose |
|---|---|
| `--mn-hover-bg` | Generic hover background |
| `--mn-active-bg` | Active/pressed background |

#### Status

| Token | Purpose |
|---|---|
| `--mn-error` | Error color |
| `--mn-error-bg` | Error background |
| `--mn-success` | Success color |
| `--mn-success-bg` | Success background |
| `--mn-warning` | Warning color |
| `--mn-warning-bg` | Warning background |
| `--mn-info` | Info color |
| `--mn-info-bg` | Info background |
| `--mn-danger-text` | Danger/destructive text |

#### Overlays

| Token | Purpose |
|---|---|
| `--mn-backdrop` | Modal backdrop |
| `--mn-scrim` | Scrim overlay |

### Overriding tokens in your project

To customize tokens, override them in your project's `globals.css`. Place overrides **after** the Maranello base styles:

```css
/* Override accent color for your brand */
:root {
  --mn-accent: #6C5CE7;
  --mn-accent-hover: #5A4BD1;
  --mn-accent-text: #ffffff;
  --mn-accent-bg: color-mix(in srgb, #6C5CE7 8%, transparent);
  --mn-accent-border: color-mix(in srgb, #6C5CE7 20%, transparent);
}

/* Override for a specific theme */
[data-theme="dark"] {
  --mn-surface: #0d0d0d;
  --mn-surface-raised: #1a1a1a;
}
```

---

## 4. Contributing Components

### Workflow

1. **Branch** — create a feature branch from `main`
2. **Implement** — follow `docs/guides/creating-a-component.md` for file naming, structure, and API conventions
3. **Test** — verify the component renders correctly across all four themes
4. **Submit** — open a PR with a clear description of what the component does

### PR review checklist

| Requirement | Details |
|---|---|
| **TypeScript** | Fully typed props interface; no `any` |
| **Accessibility** | WCAG 2.2 AA compliant (see section 5 below) |
| **4 themes** | Renders correctly in light, dark, navy, and colorblind themes |
| **File size** | Component source ≤ 250 lines |
| **Naming** | File: `mn-{name}.tsx`; Export: `Mn{Name}` |
| **Icons** | Lucide only — no emoji (Constitution P2) |
| **Tokens** | Uses `--mn-*` tokens or Tailwind semantic classes — no hardcoded colors |

---

## 5. Maintaining WCAG AA Compliance

All Maranello components must meet **WCAG 2.2 Level AA**.

### Contrast ratios

| Element | Minimum ratio |
|---|---|
| Normal text (< 18px / < 14px bold) | **4.5:1** |
| Large text (≥ 18px / ≥ 14px bold) | **3:1** |
| UI components and graphical objects | **3:1** |

Use browser dev tools or the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify ratios. Test in all four themes.

### Focus indicators

Focus rings must always be visible. Use the Maranello focus tokens:

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mn-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mn-focus-ring-offset)]"
```

Never remove focus indicators with `outline-none` unless you provide an equivalent visible alternative.

### Keyboard navigation

All interactive elements must be operable via keyboard:

- **Tab** to move focus between elements
- **Enter / Space** to activate buttons and links
- **Arrow keys** for navigation within composite widgets (tabs, menus, radio groups)
- **Escape** to close modals, popovers, and overlays

### Screen reader support

| Technique | When to use |
|---|---|
| `aria-label` | Icon-only buttons, unlabeled controls |
| `aria-labelledby` | Complex widgets with a visible heading |
| `role` | Custom widgets that don't use semantic HTML (`role="dialog"`, `role="tablist"`) |
| `aria-live` | Dynamic content updates (toasts, loading states) |
| `aria-expanded` | Collapsible sections, dropdowns |
| `aria-hidden="true"` | Decorative icons next to text labels |

### Quick checks with MnA11yFab

Maranello includes `MnA11yFab`, a floating accessibility toolbar that lets users adjust preferences at runtime:

- **Font size** — normal, large, extra-large (`mn-font-large`, `mn-font-xl`)
- **Dyslexic font** — toggles the `mn-dyslexic` class
- **High contrast** — toggles `mn-high-contrast` for increased contrast ratios
- **Reduced motion** — toggles `mn-reduced-motion` to disable animations

Use `MnA11yFab` during development to verify your component responds correctly to each accessibility preference:

```tsx
import { MnA11yFab } from "@/components/maranello/theme";

// Add to your layout or dev page
<MnA11yFab />
```

### Accessibility checklist

- [ ] Color contrast meets 4.5:1 (text) and 3:1 (UI) in all themes
- [ ] Focus indicators visible on every interactive element
- [ ] Fully keyboard navigable — no mouse-only interactions
- [ ] Screen reader labels on all controls (`aria-label`, `aria-labelledby`)
- [ ] Decorative icons marked with `aria-hidden="true"`
- [ ] Tested with MnA11yFab: font sizes, high contrast, reduced motion
