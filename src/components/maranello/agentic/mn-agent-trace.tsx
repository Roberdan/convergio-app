'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/lib/i18n';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  StepRow,
  groupStepsByActor,
  buildActorLegend,
} from './mn-agent-trace.helpers';

/* ── Public types ── */

export type TraceStepStatus = 'pending' | 'running' | 'done' | 'error';
export type TraceStepKind = 'tool' | 'reasoning' | 'result' | 'handoff';

export interface TraceStep {
  id: string;
  kind: TraceStepKind;
  label: string;
  status: TraceStepStatus;
  durationMs?: number;
  input?: string;
  output?: string;
  timestamp?: string;
  actorId?: string;
  actorLabel?: string;
  actorColor?: string;
}

export interface MnAgentTraceProps {
  steps: TraceStep[];
  /** Callback when a step is expanded */
  onSelect?: (step: TraceStep) => void;
  /** Maximum visible steps (scrollable beyond this) */
  maxVisible?: number;
  ariaLabel?: string;
  className?: string;
  /** Group steps by actor with color bands (default: false) */
  groupByActor?: boolean;
  /** Show actor name header when ownership changes (default: true when groupByActor) */
  showActorHeaders?: boolean;
  /** Override actor colors by actorId */
  actorColors?: Record<string, string>;
}

/* ── Inline sub-components (small, actor-specific) ── */

function ActorHeader({ label, color }: { label: string; color: string }) {
  const t = useLocale('agentTrace');
  return (
    <div
      role="heading"
      aria-level={3}
      className="flex items-center gap-2 px-1 py-1.5 text-xs font-semibold text-muted-foreground"
    >
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span>
        {t.actorLabel}: {label}
      </span>
    </div>
  );
}

function ActorLegend({
  entries,
}: {
  entries: { actorId: string; label: string; color: string }[];
}) {
  const t = useLocale('agentTrace');
  if (entries.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border/50 px-2 pt-2 text-xs text-muted-foreground">
      <span className="font-semibold">{t.legend}:</span>
      {entries.map((e) => (
        <span key={e.actorId} className="inline-flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: e.color }}
            aria-hidden="true"
          />
          {e.label}
        </span>
      ))}
    </div>
  );
}

/* ── Handoff bridge between actor groups ── */

function HandoffBridge({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  const t = useLocale('agentTrace');
  return (
    <div
      className="mx-auto flex w-full items-center gap-1 px-2 py-0.5"
      aria-label={t.handoff}
    >
      <span
        className="h-0.5 flex-1 rounded"
        style={{ backgroundColor: fromColor }}
        aria-hidden="true"
      />
      <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {t.handoff}
      </span>
      <span
        className="h-0.5 flex-1 rounded"
        style={{ backgroundColor: toColor }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Visualizes AI agent execution traces.
 *
 * Displays steps with kind badges, status indicators, and
 * expandable input/output sections. Supports keyboard navigation,
 * optional actor grouping with color bands, and auto-scrolls to
 * the latest step.
 */
export function MnAgentTrace({
  steps,
  onSelect,
  maxVisible,
  ariaLabel = 'Agent trace',
  className,
  groupByActor = false,
  showActorHeaders,
  actorColors,
}: MnAgentTraceProps) {
  const t = useLocale('agentTrace');
  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  const showHeaders = showActorHeaders ?? groupByActor;

  const { groups, legend } = useMemo(() => {
    if (!groupByActor) return { groups: null, legend: [] };
    const { groups: g } = groupStepsByActor(steps, actorColors);
    const leg = buildActorLegend(steps, actorColors);
    return { groups: g, legend: leg };
  }, [steps, groupByActor, actorColors]);

  const toggle = useCallback(
    (id: string) => {
      setExpandedSet((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          const step = steps.find((s) => s.id === id);
          if (step && onSelect) onSelect(step);
        }
        return next;
      });
    },
    [steps, onSelect],
  );

  if (!steps.length) {
    return (
      <div
        className={cn(
          'rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        {t.noTraceSteps}
      </div>
    );
  }

  const maxH =
    maxVisible != null
      ? { maxHeight: `${maxVisible * 3.5}rem`, overflowY: 'auto' as const }
      : undefined;

  return (
    <div
      ref={listRef}
      role="list"
      aria-label={ariaLabel}
      className={cn('flex flex-col gap-1.5 rounded-lg border bg-card p-2', className)}
      style={maxH}
    >
      {groups
        ? groups.map((group, gi) => (
            <div key={`${group.actorId}-${gi}`} className="flex flex-col gap-1.5">
              {gi > 0 && (
                <HandoffBridge
                  fromColor={groups[gi - 1].color}
                  toColor={group.color}
                />
              )}
              {showHeaders && group.actorId !== '__default__' && (
                <ActorHeader label={group.actorLabel} color={group.color} />
              )}
              {group.steps.map((step) => (
                <StepRow
                  key={step.id}
                  step={step}
                  expanded={expandedSet.has(step.id)}
                  onToggle={toggle}
                  actorColor={group.color}
                />
              ))}
            </div>
          ))
        : steps.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              expanded={expandedSet.has(step.id)}
              onToggle={toggle}
            />
          ))}
      {groupByActor && <ActorLegend entries={legend} />}
    </div>
  );
}
