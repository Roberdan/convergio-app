'use client';

import {
  MnA11y,
  MnA11yFab,
  MnThemeToggle,
  MnThemeRotary,
} from '@/components/maranello';

/** Sub-section: Theme & Accessibility controls. */
export function ShowcaseInteractiveTheme() {
  return (
    <>
      {/* Theme Toggle */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnThemeToggle</h3>
        <div className="flex items-center gap-4">
          <MnThemeToggle size="sm" />
          <MnThemeToggle size="md" />
          <MnThemeToggle size="lg" />
          <MnThemeToggle showLabel />
        </div>
      </div>

      {/* Theme Rotary */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnThemeRotary</h3>
        <div className="flex justify-center py-4">
          <MnThemeRotary size="md" />
        </div>
      </div>

      {/* A11y (inline preview) */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnA11y</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Display settings FAB with text size, reduced motion, high contrast, and focus indicators.
        </p>
        <MnA11y className="relative bottom-auto right-auto z-auto" />
      </div>

      {/* A11y FAB */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">MnA11yFab</h3>
        <p className="text-xs text-muted-foreground">
          The accessibility FAB renders fixed at the bottom-right corner of the viewport.
        </p>
        <MnA11yFab />
      </div>
    </>
  );
}
