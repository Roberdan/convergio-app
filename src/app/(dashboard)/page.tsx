"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useSSEAdapter } from "@/hooks/use-sse-adapter";
import { useLanguage } from "@/lib/i18n/language-provider";
import * as api from "@/lib/api";
import { MnDashboardStrip } from "@/components/maranello/layout";
import { MnSystemStatus } from "@/components/maranello/network";
import { MnActivityFeed } from "@/components/maranello/feedback";
import { MnSectionCard } from "@/components/maranello/layout";
import { MnProgressRing, MnBadge } from "@/components/maranello/data-display";
import { MnGauge } from "@/components/maranello/data-viz";
import { MnStateScaffold } from "@/components/maranello/feedback";
import { Rocket, ClipboardList, Stethoscope } from "lucide-react";
import Link from "next/link";
import {
  buildStripMetrics,
  buildActivityItems,
  buildSystemServices,
  type DaemonHealth,
  type CostSummaryResponse,
  type PlanSummary,
  type TimelineEvent,
  type MeshPeer,
} from "./mission-control-helpers";
import { useMissionControlLocale, type MCLocale } from "./mission-control-i18n";

const API = typeof window !== "undefined" ? "" : (process.env.API_URL ?? "http://localhost:8420");

export default function MissionControlPage() {
  const t = useMissionControlLocale();

  const health = useApiQuery<DaemonHealth>(() => api.health(), { pollInterval: 10000 });
  const cost = useApiQuery<CostSummaryResponse>(
    () => api.inferenceCosts().then((c) => ({
      total_cost: c.reduce((s, x) => s + x.monthly_cost, 0),
      budget_remaining: undefined, active_plans: undefined, active_agents: undefined,
    })),
  );
  const plans = useApiQuery<PlanSummary[]>(() =>
    fetch(`${API}/api/plan-db/list`).then((r) => r.ok ? r.json() : []).catch(() => []),
  );
  const agents = useApiQuery(() => api.agentRuntime());
  const peers = useApiQuery<MeshPeer[]>(() =>
    fetch(`${API}/api/mesh/peers`).then((r) => r.ok ? r.json() : []).catch(() => []),
  );
  const timeline = useSSEAdapter<TimelineEvent[]>({
    url: `${API}/api/events/stream`,
    initialData: [],
    mapEvent: (event, current) => {
      const te: TimelineEvent = {
        id: event.id, event_type: event.type,
        message: typeof event.data === "string" ? event.data : JSON.stringify(event.data),
        created_at: new Date(event.timestamp ?? Date.now()).toISOString(),
      };
      return [te, ...current].slice(0, 30);
    },
  });

  if (health.loading && plans.loading) return <MnStateScaffold state="loading" />;

  const stripMetrics = buildStripMetrics(health.data, cost.data, plans.data, agents.data?.active_agents ?? null, t);
  const activityItems = buildActivityItems(timeline.data);
  const services = buildSystemServices(health.data, peers.data);
  const activePlans = plans.data?.filter((p) => p.status === "in_progress") ?? [];
  const agentCount = (agents.data?.active_agents ?? []).length;
  const healthyCount = services.filter((s) => s.status === "operational").length;

  return (
    <div className="space-y-6">
      <MnDashboardStrip metrics={stripMetrics} />

      <div style={{ background: "var(--mn-surface-raised)", border: "1px solid var(--mn-border-subtle)", borderRadius: 8, padding: "10px 16px", color: "var(--mn-text-muted)", fontSize: 14 }}>
        {t.summaryLine(activePlans.length, agentCount, healthyCount, services.length)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <MnSectionCard title={t.systemHealth}>
            <div className="flex justify-center py-2">
              <MnGauge value={health.data?.status === "ok" ? 100 : 30} min={0} max={100} unit="%" label={t.health} startAngle={135} endAngle={405} />
            </div>
          </MnSectionCard>
          <MnSystemStatus services={services} version={health.data?.version} />
        </div>

        <MnSectionCard title={t.activePlans}>
          {activePlans.length === 0 ? (
            <p style={{ color: "var(--mn-text-muted)" }}>{t.noActivePlans}</p>
          ) : (
            <div className="space-y-3">
              {activePlans.slice(0, 5).map((plan) => (
                <Link key={plan.id} href={`/plans?id=${plan.id}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors" style={{ background: "var(--mn-surface-sunken)" }}>
                  <MnProgressRing value={plan.tasks_done} max={plan.tasks_total} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{plan.name}</p>
                    <p style={{ color: "var(--mn-text-muted)", fontSize: 12 }}>{plan.tasks_done}/{plan.tasks_total} {t.tasks}</p>
                  </div>
                  <MnBadge tone="info">{plan.status}</MnBadge>
                </Link>
              ))}
            </div>
          )}
        </MnSectionCard>

        <MnActivityFeed items={activityItems} ariaLabel={t.recentActivity} onRefresh={health.refetch} />
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: t.spawnAgent, href: "/agents", icon: Rocket },
          { label: t.createPlan, href: "/plans", icon: ClipboardList },
          { label: t.runDoctor, href: "/doctor", icon: Stethoscope },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors" style={{ background: "var(--mn-accent-bg)", color: "var(--mn-accent)", border: "1px solid var(--mn-accent-border)" }}>
            <action.icon size={16} />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
