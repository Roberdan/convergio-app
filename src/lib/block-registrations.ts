/**
 * Default block registrations — registers all built-in Maranello block types.
 *
 * This file is imported by the framework-mode layout to ensure all block
 * types are available to the PageRenderer. Consumer apps that use only
 * specific components can skip this import and register blocks individually
 * via their component's .register.ts sidecar.
 *
 * Import this file once in your app (e.g. in the dashboard layout):
 * ```ts
 * import "@/lib/block-registrations";
 * ```
 */
import { lazyBlock } from "./block-registry";

/* ── Maranello data-viz blocks ── */
lazyBlock("gauge-block", () => import("@/components/maranello/data-viz/mn-gauge"), "MnGauge");
lazyBlock("chart-block", () => import("@/components/maranello/data-viz/mn-chart"), "MnChart");
lazyBlock("funnel-block", () => import("@/components/maranello/data-viz/mn-funnel"), "MnFunnel");
lazyBlock("hbar-block", () => import("@/components/maranello/data-viz/mn-hbar"), "MnHbar");
lazyBlock("speedometer-block", () => import("@/components/maranello/data-viz/mn-speedometer"), "MnSpeedometer");
lazyBlock("map-block", () => import("@/components/maranello/network/mn-map"), "MnMap");

/* ── Maranello data-display blocks ── */
lazyBlock("data-table-maranello", () => import("@/components/maranello/data-display/mn-data-table"), "MnDataTable");

/* ── Maranello ops blocks ── */
lazyBlock("gantt-block", () => import("@/components/maranello/ops/mn-gantt"), "MnGantt");
lazyBlock("kanban-block", () => import("@/components/maranello/ops/mn-kanban-board"), "MnKanbanBoard");
lazyBlock("system-status-block", () => import("@/components/maranello/network/mn-system-status"), "MnSystemStatus");

/* ── Maranello strategy blocks ── */
lazyBlock("okr-block", () => import("@/components/maranello/strategy/mn-okr"), "MnOkr");

/* ── Maranello agentic blocks ── */
lazyBlock("workflow-orchestrator-block", () => import("@/components/maranello/agentic/mn-workflow-orchestrator"), "MnWorkflowOrchestrator");
