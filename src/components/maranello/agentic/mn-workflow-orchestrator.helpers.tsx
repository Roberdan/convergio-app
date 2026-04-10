"use client";

import type { WorkflowNode, WorkflowEdge, WorkflowPhase, LayoutPosition } from "./mn-workflow-orchestrator.types";

const NODE_R = 24;

/* ── Edges ── */

export function EdgesLayer({ edges, positions, onEdgeClick }: {
  edges: WorkflowEdge[];
  positions: Map<string, LayoutPosition>;
  onEdgeClick?: (from: string, to: string) => void;
}) {
  return (
    <g>
      {edges.map((e) => {
        const a = positions.get(e.from);
        const b = positions.get(e.to);
        if (!a || !b) return null;
        const directed = e.directed !== false;
        return (
          <line
            key={`e-${e.from}-${e.to}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={e.active ? "var(--mn-accent)" : "var(--mn-border-subtle)"}
            strokeWidth={e.active ? 2 : 1}
            strokeDasharray={e.active ? "none" : "4 4"}
            markerEnd={directed ? "url(#wfo-arrow)" : undefined}
            markerStart={e.bidirectional ? "url(#wfo-arrow)" : undefined}
            className="transition-all duration-500"
            style={{ cursor: onEdgeClick ? "pointer" : undefined }}
            onClick={onEdgeClick ? () => onEdgeClick(e.from, e.to) : undefined}
          />
        );
      })}
      {edges.filter((e) => e.label).map((e) => {
        const a = positions.get(e.from);
        const b = positions.get(e.to);
        if (!a || !b) return null;
        return (
          <text
            key={`el-${e.from}-${e.to}`}
            x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6}
            textAnchor="middle"
            className="text-[8px] fill-[var(--mn-text-tertiary)]"
          >
            {e.label}
          </text>
        );
      })}
    </g>
  );
}

/* ── Particles ── */

export function ParticlesLayer({ edges, positions, dur }: {
  edges: WorkflowEdge[];
  positions: Map<string, LayoutPosition>;
  dur: string;
}) {
  return (
    <g>
      {edges.filter((e) => e.active).map((e) => {
        const a = positions.get(e.from);
        const b = positions.get(e.to);
        if (!a || !b) return null;
        return (
          <circle key={`pt-${e.from}-${e.to}`} r="3" fill="var(--mn-accent)" opacity="0.8">
            <animateMotion dur={dur} repeatCount="indefinite">
              <mpath xlinkHref={`#wfo-path-${e.from}-${e.to}`} />
            </animateMotion>
          </circle>
        );
      })}
    </g>
  );
}

/* ── Node ── */

function statusFill(node: WorkflowNode): string {
  const color = node.color ?? "var(--mn-accent)";
  const s = node.status ?? "idle";
  if (s === "active") return `${color}30`;
  if (s === "done") return `${color}15`;
  if (s === "error") return "var(--mn-error-bg)";
  return "var(--mn-surface-raised)";
}

function statusStroke(node: WorkflowNode): string {
  const s = node.status ?? "idle";
  if (s === "idle") return "var(--mn-border)";
  return node.color ?? statusColor(s);
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: "var(--mn-accent)", thinking: "var(--mn-warning)",
    done: "var(--mn-success)", error: "var(--mn-error)",
  };
  return map[status] ?? "var(--mn-text-muted)";
}

export function NodeGroup({ node, pos, selected, onClick }: {
  node: WorkflowNode;
  pos: LayoutPosition;
  selected?: boolean;
  onClick?: () => void;
}) {
  const isActive = node.status === "active";
  const isThinking = node.status === "thinking";
  const isDone = node.status === "done";
  const isError = node.status === "error";
  const sc = statusColor(node.status ?? "idle");

  return (
    <g style={{ cursor: onClick ? "pointer" : "default" }} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
      {isActive && (
        <circle cx={pos.x} cy={pos.y} r={NODE_R + 4} fill="none" stroke={sc} strokeWidth="2" style={{ animation: "wfo-pulse 1.5s ease-in-out infinite" }} />
      )}

      {selected && (
        <circle cx={pos.x} cy={pos.y} r={NODE_R + 6} fill="none" stroke="var(--mn-accent)" strokeWidth="2" strokeDasharray="4 2" />
      )}

      <circle
        cx={pos.x} cy={pos.y} r={NODE_R}
        fill={statusFill(node)}
        stroke={statusStroke(node)}
        strokeWidth={isActive || selected ? 2.5 : 1.5}
        className="transition-all duration-300"
      />

      {node.icon && (
        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="text-[14px] fill-[var(--mn-text)]" style={{ fontFamily: "system-ui" }}>
          {node.icon.charAt(0)}
        </text>
      )}

      <text x={pos.x} y={pos.y + NODE_R + 14} textAnchor="middle" className="text-[10px] font-medium fill-[var(--mn-text)]">
        {node.label}
      </text>

      {node.sublabel && (
        <text x={pos.x} y={pos.y + NODE_R + 25} textAnchor="middle" className="text-[8px] fill-[var(--mn-text-tertiary)]">
          {node.sublabel}
        </text>
      )}

      {(isActive || isThinking || isDone || isError) && (
        <circle
          cx={pos.x + 16} cy={pos.y - 16} r="5"
          fill={sc}
          stroke="var(--mn-surface)"
          strokeWidth="2"
          style={isThinking ? { animation: "wfo-think 0.8s ease-in-out infinite" } : undefined}
        />
      )}

      {node.badge && (
        <g>
          <rect x={pos.x + 10} y={pos.y - NODE_R - 8} width={node.badge.length * 7 + 6} height="14" rx="7" fill="var(--mn-accent)" />
          <text x={pos.x + 13 + (node.badge.length * 3.5)} y={pos.y - NODE_R + 2} textAnchor="middle" className="text-[8px] font-bold fill-[var(--mn-accent-text)]">{node.badge}</text>
        </g>
      )}
    </g>
  );
}

/* ── Phase bar ── */

export function PhaseBar({ phase, label }: { phase: WorkflowPhase; label: string }) {
  const pct = phase.total > 0 ? (phase.current / phase.total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 px-3 py-2 text-xs text-[var(--mn-text-muted)]">
      <span className="font-medium">{label} {phase.current}/{phase.total}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--mn-surface-sunken)]">
        <div className="h-full rounded-full bg-[var(--mn-accent)] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {phase.label && <span>{phase.label}</span>}
      {phase.agent && <span className="font-semibold text-[var(--mn-text)]">{phase.agent}</span>}
    </div>
  );
}
