# Convergio Frontend — Constitution

> Binding rules. No exceptions.

## Principles

| # | Principle |
|---|-----------|
| P1 | Accessibility first — WCAG 2.2 AA minimum |
| P2 | Zero emoji — Lucide SVG icons only |
| P3 | 4 themes always — navy, dark, light, colorblind |
| P4 | Max 250 lines per file — split if exceeds |
| P5 | shadcn source-first — components live in repo |
| P6 | prefers-reduced-motion respected in all animations |
| P7 | All text/comments in English |
| P8 | Keyboard-first interaction model |

## Accessibility (WCAG 2.2 AA)

| Rule | Requirement |
|------|-------------|
| A1 | All interactive elements keyboard-navigable |
| A2 | Color contrast >= 4.5:1 text, >= 3:1 UI |
| A3 | Focus indicators visible in all themes |
| A4 | Form inputs have associated labels |
| A5 | prefers-reduced-motion disables animations |
| A6 | Font sizes use rem, never fixed px for body |
| A7 | Touch targets >= 44x44px on mobile |

## Theme Rules

| Rule | Requirement |
|------|-------------|
| T1 | Every component renders in all 4 themes |
| T2 | Use CSS custom properties, never hardcoded colors |
| T3 | Theme via data-theme attribute on html |
| T4 | Colorblind theme passes WCAG AA for deuteranopia + protanopia |

## Typography

| Rule | Requirement |
|------|-------------|
| TY1 | Headings: Outfit (font-heading) |
| TY2 | Body: Inter (font-sans) |
| TY3 | Mono/data: Barlow Condensed (font-mono) |
| TY4 | Labels: Outfit uppercase, letter-spacing 0.06em |

## Code Rules

| Rule | Requirement |
|------|-------------|
| C1 | TypeScript strict, no `any` |
| C2 | Named exports only |
| C3 | No hardcoded color values |
| C4 | "use client" only where hooks are used |
