'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/lib/i18n';
import { cva } from 'class-variance-authority';
import type { TraceStep, TraceStepKind, TraceStepStatus } from './mn-agent-trace';

export const KIND_LABELS: Record<TraceStepKind, string> = {
  tool: 'T', reasoning: 'R', result: 'Res', handoff: 'H',
};
export const MAX_DISPLAY_LEN = 500;

export const kindBadge = cva(
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold',
  {
    variants: {
      kind: {
        tool: 'bg-[var(--mn-kind-tool-bg,theme(colors.blue.500/0.15))] text-[var(--mn-kind-tool-fg,theme(colors.blue.600))]',
        reasoning:
          'bg-[var(--mn-kind-reasoning-bg,theme(colors.purple.500/0.15))] text-[var(--mn-kind-reasoning-fg,theme(colors.purple.600))]',
        result:
          'bg-[var(--mn-kind-result-bg,theme(colors.green.500/0.15))] text-[var(--mn-kind-result-fg,theme(colors.green.600))]',
        handoff:
          'bg-[var(--mn-kind-handoff-bg,theme(colors.amber.500/0.15))] text-[var(--mn-kind-handoff-fg,theme(colors.amber.600))]',
      },
    },
  },
);

export const statusDot = cva('h-2.5 w-2.5 shrink-0 rounded-full', {
  variants: {
    status: {
      pending: 'bg-muted-foreground/40',
      running: 'bg-status-warning animate-pulse',
      done: 'bg-status-success',
      error: 'bg-status-error',
    } satisfies Record<TraceStepStatus, string>,
  },
});

export function truncate(text: string | undefined): string {
  if (!text) return '';
  return text.length > MAX_DISPLAY_LEN ? text.slice(0, MAX_DISPLAY_LEN) + '\u2026' : text;
}

/* ── Actor grouping ── */

/** Default palette using CSS custom properties. */
const DEFAULT_ACTOR_PALETTE = [
  'var(--mn-accent)', 'var(--mn-info)', 'var(--mn-success)',
  'var(--mn-warning)', 'var(--mn-error)',
];

/** Priority: step.actorColor > actorColors map > default palette. */
export function resolveActorColor(
  actorId: string, step: TraceStep,
  actorColors: Record<string, string> | undefined,
  actorIndex: Map<string, number>,
): string {
  if (step.actorColor) return step.actorColor;
  if (actorColors?.[actorId]) return actorColors[actorId];
  return DEFAULT_ACTOR_PALETTE[(actorIndex.get(actorId) ?? 0) % DEFAULT_ACTOR_PALETTE.length];
}

export interface ActorGroup {
  actorId: string; actorLabel: string; color: string; steps: TraceStep[];
}
export interface ActorLegendEntry {
  actorId: string; label: string; color: string;
}

function buildActorIndex(steps: TraceStep[]): Map<string, number> {
  const idx = new Map<string, number>();
  let c = 0;
  for (const s of steps) { const id = s.actorId ?? '__default__'; if (!idx.has(id)) idx.set(id, c++); }
  return idx;
}

/** Group consecutive steps by actor. Steps without actorId use "__default__". */
export function groupStepsByActor(
  steps: TraceStep[], actorColors: Record<string, string> | undefined,
): { groups: ActorGroup[]; actorIndex: Map<string, number> } {
  const actorIndex = buildActorIndex(steps);
  const groups: ActorGroup[] = [];
  let current: ActorGroup | null = null;
  for (const step of steps) {
    const id = step.actorId ?? '__default__';
    const color = resolveActorColor(id, step, actorColors, actorIndex);
    if (!current || current.actorId !== id) {
      current = { actorId: id, actorLabel: step.actorLabel ?? id, color, steps: [] };
      groups.push(current);
    }
    current.steps.push(step);
  }
  return { groups, actorIndex };
}

/** Build a de-duped legend of actors. */
export function buildActorLegend(
  steps: TraceStep[], actorColors: Record<string, string> | undefined,
): ActorLegendEntry[] {
  const actorIndex = buildActorIndex(steps);
  const seen = new Map<string, ActorLegendEntry>();
  for (const step of steps) {
    const id = step.actorId ?? '__default__';
    if (seen.has(id)) continue;
    const color = resolveActorColor(id, step, actorColors, actorIndex);
    seen.set(id, { actorId: id, label: step.actorLabel ?? id, color });
  }
  return Array.from(seen.values());
}

/* ── Sub-components ── */

export function StepBody({ step }: { step: TraceStep }) {
  const t = useLocale('agentTrace');
  if (!step.input && !step.output) return null;
  return (
    <div className="border-t border-border/50 px-3 py-2 text-xs">
      {step.input && (
        <div className="mb-2">
          <span className="mb-1 block font-semibold text-muted-foreground">{t.input}</span>
          <pre className="whitespace-pre-wrap break-words rounded bg-muted/50 p-2 font-mono text-card-foreground">
            {truncate(step.input)}
          </pre>
        </div>
      )}
      {step.output && (
        <div>
          <span className="mb-1 block font-semibold text-muted-foreground">{t.output}</span>
          <pre className="whitespace-pre-wrap break-words rounded bg-muted/50 p-2 font-mono text-card-foreground">
            {truncate(step.output)}
          </pre>
        </div>
      )}
    </div>
  );
}

export function StepRow({
  step, expanded, onToggle, actorColor,
}: {
  step: TraceStep; expanded: boolean; onToggle: (id: string) => void; actorColor?: string;
}) {
  const hasBody = !!(step.input || step.output);
  function handleClick() { if (hasBody) onToggle(step.id); }
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ' ') && hasBody) { e.preventDefault(); onToggle(step.id); }
  }

  return (
    <div
      role="listitem"
      data-id={step.id}
      className={cn(
        'rounded-md border bg-card transition-colors',
        step.status === 'error' && 'border-status-error/30',
        actorColor && 'overflow-hidden',
      )}
    >
      <div className={cn(actorColor && 'flex')}>
        {actorColor && (
          <div className="w-[3px] shrink-0 rounded-l" style={{ backgroundColor: actorColor }} aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <div
            role="button" tabIndex={0}
            aria-expanded={hasBody ? expanded : undefined}
            aria-label={`${step.kind} step: ${step.label}, status ${step.status}${step.durationMs != null ? `, ${step.durationMs}ms` : ''}`}
            onClick={handleClick} onKeyDown={handleKeyDown}
            className={cn(
              'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
              'hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
              !hasBody && 'cursor-default',
            )}
          >
            <span className={kindBadge({ kind: step.kind })}>{KIND_LABELS[step.kind]}</span>
            <span className="min-w-0 flex-1 truncate font-medium text-card-foreground">{step.label}</span>
            {step.timestamp && (
              <span className="shrink-0 text-xs text-muted-foreground">{step.timestamp}</span>
            )}
            {step.durationMs != null && (
              <span className="shrink-0 tabular-nums text-xs text-muted-foreground">{step.durationMs}ms</span>
            )}
            <span className={statusDot({ status: step.status })} aria-label={`Status: ${step.status}`} />
          </div>
          {expanded && <StepBody step={step} />}
        </div>
      </div>
    </div>
  );
}
