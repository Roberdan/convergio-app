'use client';

import { useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { CostSummary, RoutingResponse, RoutingDecision } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnChart } from '@/components/maranello/data-viz';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { useInferenceLocale } from './inference-i18n';

export default function InferencePage() {
  const t = useInferenceLocale();
  const [routingPrompt, setRoutingPrompt] = useState('');
  const [routingTier, setRoutingTier] = useState('');

  const { data: costs, loading, error, refetch } = useApiQuery<CostSummary[]>(
    () => api.inferenceCosts({}), { pollInterval: 10_000 },
  );

  const { data: routing } = useApiQuery<RoutingResponse>(
    () => api.inferenceRouting({
      prompt: routingPrompt || undefined,
      tier: routingTier || undefined,
    }),
    { enabled: !!routingPrompt || !!routingTier },
  );

  const costCols: DataTableColumn[] = useMemo(() => [
    { key: 'entity_id', label: t.entity, sortable: true },
    { key: 'entity_type', label: t.type, sortable: true },
    { key: 'model', label: t.model, sortable: true },
    { key: 'daily_cost', label: t.dailyCost, sortable: true },
    { key: 'monthly_cost', label: t.monthlyCost, sortable: true },
  ], [t]);

  const costByModel = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of costs ?? []) {
      map[c.model] = (map[c.model] ?? 0) + c.daily_cost;
    }
    return map;
  }, [costs]);

  const chartLabels = useMemo(() => Object.keys(costByModel), [costByModel]);
  const chartSeries = useMemo(() => [{
    label: t.dailyCost,
    data: Object.values(costByModel),
    color: 'var(--mn-accent)',
  }], [costByModel, t]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.costByModel} collapsible defaultOpen>
          <div className="p-4">
            {chartLabels.length > 0 ? (
              <MnChart type="bar" labels={chartLabels} series={chartSeries} showLegend={false} />
            ) : (
              <p className="text-sm text-muted-foreground">{t.noCostData}</p>
            )}
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.routingDecision} collapsible defaultOpen>
          <div className="space-y-3 p-4">
            <MnFormField label={t.prompt}>
              <input type="text" value={routingPrompt}
                onChange={(e) => setRoutingPrompt(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder={t.describeTask} />
            </MnFormField>
            <MnFormField label={t.tier}>
              <select value={routingTier}
                onChange={(e) => setRoutingTier(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">{t.any}</option>
                <option value="standard">{t.standard}</option>
                <option value="premium">{t.premium}</option>
                <option value="economy">{t.economy}</option>
              </select>
            </MnFormField>
            {routing && (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-sm font-medium">{t.decision}: {typeof routing.decision === 'string' ? routing.decision : (routing.decision as RoutingDecision).selected_model ?? '-'}</p>
                {routing.model_metrics.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {routing.model_metrics.map((m) => (
                      <div key={m.model} className="flex items-center justify-between text-xs">
                        <span className="font-medium">{m.model}</span>
                        <div className="flex gap-3">
                          <span>{m.latency_ms}ms</span>
                          <span>${m.cost_per_1k_tokens}/1k</span>
                          <MnBadge tone={m.quality_score >= 0.8 ? 'success' : m.quality_score >= 0.5 ? 'warning' : 'danger'}>
                            Q: {(m.quality_score * 100).toFixed(0)}%
                          </MnBadge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </MnSectionCard>
      </div>

      <MnSectionCard title={t.costBreakdown} badge={(costs ?? []).length} collapsible defaultOpen>
        <MnDataTable columns={costCols}
          data={(costs ?? []) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noCostData} />
      </MnSectionCard>

      <MnSectionCard title={t.budgetAlerts} collapsible defaultOpen>
        <div className="p-4">
          <div className="space-y-2">
            {(costs ?? []).filter((c) => c.daily_cost > 50).map((c) => (
              <div key={c.entity_id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                <span className="text-sm">{c.entity_id} ({c.model})</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">${c.daily_cost.toFixed(2)}/day</span>
                  <MnBadge tone="warning">{t.highSpend}</MnBadge>
                </div>
              </div>
            ))}
            {(costs ?? []).filter((c) => c.daily_cost > 50).length === 0 && (
              <p className="text-sm text-muted-foreground">{t.noAlerts}</p>
            )}
          </div>
        </div>
      </MnSectionCard>
    </div>
  );
}
