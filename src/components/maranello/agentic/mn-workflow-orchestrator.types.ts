import type { VariantProps } from "class-variance-authority";
import type { workflowWrap } from "./mn-workflow-orchestrator";

/* ── Node ── */

export type WorkflowNodeStatus =
  | "idle"
  | "active"
  | "thinking"
  | "done"
  | "error";

export interface WorkflowNode {
  id: string;
  label: string;
  /** Lucide icon name (e.g. "Users", "Shield"). Rendered via dynamic import. */
  icon?: string;
  /** Hex color or CSS var for the node accent. Falls back to --mn-accent. */
  color?: string;
  status?: WorkflowNodeStatus;
  /** Secondary text below the label. */
  sublabel?: string;
  /** Small badge text (e.g. "3", "OK"). */
  badge?: string;
  /** Grouping key for cluster rendering. */
  group?: string;
}

/* ── Edge ── */

export interface WorkflowEdge {
  from: string;
  to: string;
  /** Show an arrowhead at the target end. @default true */
  directed?: boolean;
  /** Label on the edge midpoint. */
  label?: string;
  /** Whether the edge is currently active (shows particles). */
  active?: boolean;
  /** If true, render arrows in both directions. */
  bidirectional?: boolean;
}

/* ── Phase indicator ── */

export interface WorkflowPhase {
  current: number;
  total: number;
  label?: string;
  agent?: string;
}

/* ── Layout ── */

export type WorkflowLayout =
  | "circular"
  | "horizontal"
  | "vertical"
  | "auto";

export interface LayoutPosition {
  x: number;
  y: number;
}

/* ── Component props ── */

export interface MnWorkflowOrchestratorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof workflowWrap> {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  layout?: WorkflowLayout;
  /** Show the phase progress bar. */
  phase?: WorkflowPhase;
  /** Callback when a node is clicked. */
  onNodeClick?: (nodeId: string) => void;
  /** Callback when an edge is clicked. */
  onEdgeClick?: (from: string, to: string) => void;
  /** Highlight a specific node. */
  selectedNode?: string;
  /** Accessible label for the SVG. */
  ariaLabel?: string;
  /** Show animated particles on active edges. @default true */
  showParticles?: boolean;
  /** Animation speed multiplier. @default 1 */
  animationSpeed?: number;
}
