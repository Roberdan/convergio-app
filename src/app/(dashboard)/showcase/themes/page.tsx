'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/components/theme/theme-provider';
import {
  MnBadge,
  MnGauge,
  MnProgressRing,
  MnSpinner,
  MnToggleSwitch,
  MnFlipCounter,
} from '@/components/maranello';

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  navy: 'Navy',
  colorblind: 'Colorblind',
};

const CSS_VARS = [
  '--background',
  '--foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--ring',
  '--card',
  '--card-foreground',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
];

export default function ThemePlaygroundPage() {
  const { theme, setTheme, themes } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<Theme>(theme);
  const [toggle, setToggle] = useState(true);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const copyToken = useCallback((varName: string) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    const text = `${varName}: ${value}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedVar(varName);
      setTimeout(() => setCopiedVar(null), 1500);
    });
  }, []);

  const handlePreviewChange = useCallback(
    (t: Theme) => {
      setPreviewTheme(t);
      setTheme(t);
    },
    [setTheme],
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Categories
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Theme Playground</h1>
        <p className="text-muted-foreground mt-1">
          Preview components across all themes and explore design tokens.
        </p>
      </div>

      {/* Theme selector */}
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => handlePreviewChange(t)}
            className={cn(
              'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              previewTheme === t
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary/50',
            )}
          >
            {THEME_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Preview grid */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Component Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PreviewCard title="Badge">
            <div className="flex flex-wrap gap-2">
              <MnBadge tone="neutral">Neutral</MnBadge>
              <MnBadge tone="success">Success</MnBadge>
              <MnBadge tone="warning">Warning</MnBadge>
              <MnBadge tone="danger">Error</MnBadge>
              <MnBadge tone="info">Info</MnBadge>
            </div>
          </PreviewCard>

          <PreviewCard title="Gauge">
            <MnGauge value={72} min={0} max={100} label="CPU Usage" size="sm" />
          </PreviewCard>

          <PreviewCard title="Progress Ring">
            <div className="flex gap-4">
              <MnProgressRing value={87} size="md" variant="primary" label="Score" />
              <MnProgressRing value={42} size="md" variant="muted" label="Adoption" />
            </div>
          </PreviewCard>

          <PreviewCard title="Spinner">
            <div className="flex gap-3">
              <MnSpinner size="sm" variant="primary" label="Loading" />
              <MnSpinner size="md" variant="muted" label="Processing" />
              <MnSpinner size="lg" variant="destructive" label="Error" />
            </div>
          </PreviewCard>

          <PreviewCard title="Flip Counter">
            <MnFlipCounter value={4872} digits={5} size="md" label="Revenue" />
          </PreviewCard>

          <PreviewCard title="Toggle Switch">
            <div className="flex flex-col gap-2">
              <MnToggleSwitch
                checked={toggle}
                onCheckedChange={setToggle}
                label="Auto-deploy"
              />
              <MnToggleSwitch
                checked={!toggle}
                onCheckedChange={(v) => setToggle(!v)}
                label="Debug mode"
                size="sm"
              />
            </div>
          </PreviewCard>
        </div>
      </section>

      {/* Color palette */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Color Palette — {THEME_LABELS[previewTheme]}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click any token to copy its name and value to clipboard.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {CSS_VARS.map((v) => (
            <button
              key={v}
              onClick={() => copyToken(v)}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors text-left group"
            >
              <div
                className="h-8 w-8 rounded border border-border shrink-0"
                style={{ backgroundColor: `var(${v})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate">{v}</p>
              </div>
              {copiedVar === v ? (
                <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function PreviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}
