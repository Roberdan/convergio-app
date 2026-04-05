'use client';

import type { DiscoveredAgent } from '@/lib/types';
import { MnBadge } from '@/components/maranello/data-display';

/* ── Badge tone by agent type ── */

function typeTone(t: string): 'info' | 'success' | 'warning' {
  if (t.includes('claude')) return 'info';
  if (t.includes('mlx')) return 'success';
  if (t.includes('copilot')) return 'warning';
  return 'info';
}

function typeLabel(t: string): string {
  if (t.includes('claude')) return 'Claude';
  if (t.includes('mlx')) return 'MLX';
  if (t.includes('copilot')) return 'Copilot';
  return t;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1_000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

/* ── Component ── */

export function DiscoveredAgentsList({
  agents,
}: {
  agents: DiscoveredAgent[];
}) {
  if (agents.length === 0) return null;

  return (
    <div className="mt-4 border-t border-dashed border-border pt-4">
      <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Discovered External Agents
      </p>
      <div className="space-y-2">
        {agents.map((a) => (
          <div
            key={`${a.name}-${a.pid}`}
            className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2"
          >
            <MnBadge tone={typeTone(a.agent_type)}>
              {typeLabel(a.agent_type)}
            </MnBadge>
            <span className="text-sm font-medium">{a.name}</span>
            <span className="text-xs text-muted-foreground">{a.host}</span>
            {a.pid && (
              <span className="text-xs tabular-nums text-muted-foreground">
                PID {a.pid}
              </span>
            )}
            {a.parent_agent && (
              <span className="text-xs text-muted-foreground">
                &larr; {a.parent_agent}
              </span>
            )}
            <span className="ml-auto text-[0.65rem] tabular-nums text-muted-foreground">
              {timeAgo(a.last_seen)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
