'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import { useSse } from '@/hooks/use-sse';
import * as api from '@/lib/api';
import type { IpcEvent, TimelineEvent, Anomaly, ObservatoryDashboard, CostPerHour } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnBadge } from '@/components/maranello/data-display';
import { MnChart } from '@/components/maranello/data-viz';
import { MnActivityFeed, type ActivityItem } from '@/components/maranello/feedback';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { useObservatoryLocale } from './observatory-i18n';

export default function ObservatoryPage() {
  const t = useObservatoryLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sseEvents, setSseEvents] = useState<IpcEvent[]>([]);

  const onSseMessage = useCallback((e: IpcEvent) => {
    setSseEvents((prev) => [e, ...prev].slice(0, 200));
  }, []);

  const { connected } = useSse({
    event_type: typeFilter || undefined,
    org_id: orgFilter || undefined,
    onMessage: onSseMessage,
  });

  const { data: dashboard, loading, error, refetch } =
    useApiQuery<ObservatoryDashboard>(() => api.observatoryDashboard(), { pollInterval: 30_000 });
  const { data: timeline } = useApiQuery<TimelineEvent[]>(
    () => api.observatoryTimeline({
      org_id: orgFilter || undefined,
      event_type: typeFilter || undefined,
      source: sourceFilter || undefined,
      limit: 100,
    }),
    { pollInterval: 15_000 },
  );
  const { data: anomalies, refetch: refetchAnomalies } = useApiQuery<Anomaly[]>(
    () => api.observatoryAnomalies({ include_resolved: false, limit: 50 }),
    { pollInterval: 30_000 },
  );
  const { data: searchResults } = useApiQuery(
    () => searchQuery.length >= 2 ? api.observatorySearch(searchQuery, 20) : Promise.resolve([]),
    { enabled: searchQuery.length >= 2 },
  );

  const activityItems: ActivityItem[] = useMemo(() => {
    const polled = (timeline ?? []).map((e) => ({
      agent: e.source ?? 'system',
      action: e.event_type,
      target: e.org_id ?? '',
      timestamp: e.timestamp,
      priority: e.event_type.includes('Alert') ? 'critical' as const : 'normal' as const,
    }));
    const live = sseEvents.map((e) => ({
      agent: e.from,
      action: e.event_type,
      target: e.to ?? '',
      timestamp: e.ts,
      priority: e.event_type.includes('Alert') ? 'critical' as const : 'normal' as const,
    }));
    return [...live, ...polled].slice(0, 200);
  }, [timeline, sseEvents]);

  const modelSegments = useMemo(
    () => Object.entries(dashboard?.model_breakdown ?? {}).map(([label, value]) => ({
      label, value: value as number,
    })),
    [dashboard],
  );

  const handleResolve = useCallback(async (anomaly: Anomaly) => {
    await api.observatoryResolve(anomaly.id);
    refetchAnomalies();
  }, [refetchAnomalies]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="flex items-center gap-2">
          <MnBadge tone={connected ? 'success' : 'danger'}>
            {connected ? t.live : t.polling}
          </MnBadge>
          {(anomalies ?? []).length > 0 && (
            <MnBadge tone="warning">{(anomalies ?? []).length} {t.anomalies}</MnBadge>
          )}
        </div>
      </div>

      {dashboard && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label={t.costPerHour} value={`$${costPerHourAvg(dashboard.cost_per_hour)}`} />
          <KpiCard label={t.tasksPerDay} value={dashboard.tasks_per_day ?? 0} />
          <KpiCard label={t.avgLatency} value={`${(dashboard.avg_latency_ms ?? 0).toFixed(0)}ms`} />
          <KpiCard label={t.models} value={Object.keys(dashboard.model_breakdown ?? {}).length} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input type="text" placeholder={t.searchPlaceholder} value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm" />
        <input type="text" placeholder={t.filterOrg} value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="w-40 rounded-md border bg-background px-3 py-2 text-sm" />
        <input type="text" placeholder={t.filterSource} value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-40 rounded-md border bg-background px-3 py-2 text-sm" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">{t.allTypes}</option>
          <option value="MessageSent">{t.messages}</option>
          <option value="TaskAssigned">{t.tasks}</option>
          <option value="DelegationStarted">{t.delegations}</option>
          <option value="BudgetAlert">{t.budgetAlerts}</option>
          <option value="HealthDegraded">{t.health}</option>
        </select>
      </div>

      {searchResults && searchResults.length > 0 && (
        <MnSectionCard title={`${t.searchResults} (${searchResults.length})`} collapsible defaultOpen>
          <div className="space-y-2 p-4">
            {searchResults.map((r) => (
              <div key={r.id} className="flex items-center gap-3 border-b border-border py-2 last:border-0">
                <MnBadge tone="info">{r.kind}</MnBadge>
                <span className="flex-1 text-sm">{r.excerpt}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{r.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </MnSectionCard>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.eventTimeline} badge={(timeline ?? []).length} collapsible defaultOpen>
          <div className="max-h-96 overflow-y-auto">
            <MnActivityFeed items={activityItems} ariaLabel={t.eventTimeline} />
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.modelBreakdown} collapsible defaultOpen>
          <div className="p-4">
            {modelSegments.length > 0 ? (
              <MnChart type="donut" segments={modelSegments} showLegend />
            ) : (
              <p className="text-sm text-muted-foreground">{t.noModelData}</p>
            )}
          </div>
        </MnSectionCard>
      </div>

      <MnSectionCard title={t.anomalyDetection} badge={(anomalies ?? []).length} collapsible defaultOpen>
        {(anomalies ?? []).length > 0 ? (
          <div className="space-y-2 p-4">
            {(anomalies ?? []).map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-md border p-3">
                <MnBadge tone={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'info'}>
                  {a.severity}
                </MnBadge>
                <span className="flex-1 text-sm">{a.message}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.detected_at).toLocaleString()}</span>
                {!a.resolved && (
                  <button onClick={() => handleResolve(a)}
                    className="rounded-md border px-3 py-1 text-xs hover:bg-muted/50">{t.resolve}</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{t.noAnomalies}</p>
          </div>
        )}
      </MnSectionCard>
    </div>
  );
}

function costPerHourAvg(v: CostPerHour | number | null | undefined): string {
  if (v == null) return '0.00';
  if (typeof v === 'number') return v.toFixed(2);
  return (v.avg ?? 0).toFixed(2);
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
