/**
 * Pure data transforms for the Mission Control page.
 * Maps daemon API responses to Maranello component props.
 */
import type { StripMetric } from "@/components/maranello/layout/mn-dashboard-strip";
import type { ActivityItem } from "@/components/maranello/feedback/mn-activity-feed";
import type { Service } from "@/components/maranello/network/mn-system-status";

export interface DaemonHealth {
  status: string;
  version?: string;
  uptime_seconds?: number;
  extensions_loaded?: number;
}

export interface CostSummaryResponse {
  total_cost?: number;
  active_plans?: number;
  active_agents?: number;
  budget_remaining?: number;
}

export interface PlanSummary {
  id: number;
  name: string;
  status: string;
  tasks_done: number;
  tasks_total: number;
  project_id?: string;
}

export interface TimelineEvent {
  id?: string;
  event_type: string;
  source?: string;
  message?: string;
  created_at?: string;
  severity?: string;
}

export interface MeshPeer {
  peer?: string;
  host?: string;
  role?: string;
  status?: string;
  last_seen?: number;
}

export function buildStripMetrics(
  health: DaemonHealth | null,
  cost: CostSummaryResponse | null,
  plans: PlanSummary[] | null,
  agents: unknown[] | null,
  t: { status: string; activePlans: string; agents: string; budget: string; extensions: string; healthy: string; unknown: string },
): StripMetric[] {
  const activePlans = plans?.filter((p) => p.status === "in_progress").length ?? 0;
  return [
    {
      label: t.status,
      value: health?.status === "ok" ? t.healthy : health?.status ?? t.unknown,
      trend: health?.status === "ok" ? ("up" as const) : ("down" as const),
    },
    { label: t.activePlans, value: activePlans },
    { label: t.agents, value: agents?.length ?? 0 },
    {
      label: t.budget,
      value: cost?.budget_remaining != null ? `$${cost.budget_remaining.toFixed(0)}` : "N/A",
    },
    { label: t.extensions, value: health?.extensions_loaded ?? 0 },
  ];
}

export function buildActivityItems(events: TimelineEvent[] | null): ActivityItem[] {
  if (!events) return [];
  return events.slice(0, 20).map((e) => ({
    agent: e.source ?? "system",
    action: e.event_type.replace(/_/g, " "),
    target: e.message ?? "",
    timestamp: e.created_at ?? new Date().toISOString(),
    priority: mapPriority(e.severity),
  }));
}

function mapPriority(
  severity?: string,
): "low" | "normal" | "high" | "critical" {
  if (severity === "error") return "critical";
  if (severity === "warning") return "high";
  return "normal";
}

export function buildSystemServices(
  health: DaemonHealth | null,
  peers: MeshPeer[] | null,
): Service[] {
  const services: Service[] = [
    {
      id: "daemon",
      name: "Daemon",
      status: health?.status === "ok" ? "operational" : "degraded",
      uptime: health?.uptime_seconds,
    },
  ];
  if (peers) {
    for (const peer of peers.slice(0, 5)) {
      services.push({
        id: `peer-${peer.peer ?? peer.host ?? "unknown"}`,
        name: peer.peer ?? peer.host ?? "unknown",
        status: peer.status === "online" ? "operational" : "degraded",
      });
    }
  }
  return services;
}
