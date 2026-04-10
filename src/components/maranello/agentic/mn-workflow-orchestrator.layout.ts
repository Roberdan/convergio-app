import type { WorkflowNode, WorkflowEdge, LayoutPosition, WorkflowLayout } from "./mn-workflow-orchestrator.types";

const TWO_PI = Math.PI * 2;

/* ── Circular ── */

function circularLayout(nodes: WorkflowNode[], _edges: WorkflowEdge[], w: number, h: number): Map<string, LayoutPosition> {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) * 0.65;
  const positions = new Map<string, LayoutPosition>();
  const count = nodes.length;
  if (count === 0) return positions;
  if (count === 1) {
    positions.set(nodes[0].id, { x: cx, y: cy });
    return positions;
  }
  for (let i = 0; i < count; i++) {
    const angle = (TWO_PI * i) / count - Math.PI / 2;
    positions.set(nodes[i].id, {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return positions;
}

/* ── Horizontal pipeline ── */

function horizontalLayout(nodes: WorkflowNode[], edges: WorkflowEdge[], w: number, h: number): Map<string, LayoutPosition> {
  const sorted = topoSort(nodes, edges);
  const positions = new Map<string, LayoutPosition>();
  const count = sorted.length;
  if (count === 0) return positions;
  const padX = w * 0.1;
  const stepX = count > 1 ? (w - padX * 2) / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    positions.set(sorted[i], { x: padX + stepX * i, y: h / 2 });
  }
  return positions;
}

/* ── Vertical flow ── */

function verticalLayout(nodes: WorkflowNode[], edges: WorkflowEdge[], w: number, h: number): Map<string, LayoutPosition> {
  const sorted = topoSort(nodes, edges);
  const positions = new Map<string, LayoutPosition>();
  const count = sorted.length;
  if (count === 0) return positions;
  const padY = h * 0.1;
  const stepY = count > 1 ? (h - padY * 2) / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    positions.set(sorted[i], { x: w / 2, y: padY + stepY * i });
  }
  return positions;
}

/* ── Auto (simple force-directed) ── */

function autoLayout(nodes: WorkflowNode[], edges: WorkflowEdge[], w: number, h: number): Map<string, LayoutPosition> {
  if (nodes.length === 0) return new Map();
  // Seed with circular positions
  const positions = circularLayout(nodes, edges, w, h);
  const edgeSet = edges.map((e) => [e.from, e.to] as const);
  const repulsion = 3000;
  const attraction = 0.005;
  const damping = 0.9;
  const vel = new Map<string, { vx: number; vy: number }>();
  for (const n of nodes) vel.set(n.id, { vx: 0, vy: 0 });

  for (let iter = 0; iter < 60; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = positions.get(nodes[i].id)!;
        const b = positions.get(nodes[j].id)!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        vel.get(nodes[i].id)!.vx += fx;
        vel.get(nodes[i].id)!.vy += fy;
        vel.get(nodes[j].id)!.vx -= fx;
        vel.get(nodes[j].id)!.vy -= fy;
      }
    }
    // Attraction along edges
    for (const [from, to] of edgeSet) {
      const a = positions.get(from);
      const b = positions.get(to);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const fx = dx * attraction;
      const fy = dy * attraction;
      vel.get(from)!.vx += fx;
      vel.get(from)!.vy += fy;
      vel.get(to)!.vx -= fx;
      vel.get(to)!.vy -= fy;
    }
    // Apply velocities
    for (const n of nodes) {
      const v = vel.get(n.id)!;
      const p = positions.get(n.id)!;
      p.x = Math.max(40, Math.min(w - 40, p.x + v.vx));
      p.y = Math.max(40, Math.min(h - 40, p.y + v.vy));
      v.vx *= damping;
      v.vy *= damping;
    }
  }
  return positions;
}

/* ── Topological sort (for pipeline layouts) ── */

function topoSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const ids = new Set(nodes.map((n) => n.id));
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();
  for (const id of ids) { adj.set(id, []); inDeg.set(id, 0); }
  for (const e of edges) {
    if (ids.has(e.from) && ids.has(e.to)) {
      adj.get(e.from)!.push(e.to);
      inDeg.set(e.to, (inDeg.get(e.to) ?? 0) + 1);
    }
  }
  const queue = [...ids].filter((id) => (inDeg.get(id) ?? 0) === 0);
  const result: string[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    result.push(cur);
    for (const next of adj.get(cur) ?? []) {
      const d = (inDeg.get(next) ?? 1) - 1;
      inDeg.set(next, d);
      if (d === 0) queue.push(next);
    }
  }
  // Append any nodes missed by cycles
  for (const id of ids) {
    if (!result.includes(id)) result.push(id);
  }
  return result;
}

/* ── Public API ── */

export function computeLayout(
  layout: WorkflowLayout,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  width: number,
  height: number,
): Map<string, LayoutPosition> {
  switch (layout) {
    case "circular": return circularLayout(nodes, edges, width, height);
    case "horizontal": return horizontalLayout(nodes, edges, width, height);
    case "vertical": return verticalLayout(nodes, edges, width, height);
    case "auto": return autoLayout(nodes, edges, width, height);
  }
}
