'use client';

import { useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { TrustLevel, SecretFilter, ResourceStatus } from '@/lib/types';
import { securityTrust, securitySecretsFilter } from '@/lib/api-ext';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { MnProgressRing } from '@/components/maranello/data-display';
import { useSecurityLocale } from './security-i18n';

const TRUST_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  high: 'success', medium: 'warning', low: 'danger', untrusted: 'danger',
};

const ACTION_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  redact: 'info', block: 'danger', warn: 'warning',
};

export default function SecurityPage() {
  const t = useSecurityLocale();
  const [orgId, setOrgId] = useState('default');

  const { data: trust, loading, error, refetch } = useApiQuery<TrustLevel[]>(securityTrust);
  const { data: secrets } = useApiQuery<SecretFilter[]>(securitySecretsFilter);
  const { data: resources } = useApiQuery<ResourceStatus>(
    () => api.tenancyResources(orgId), { enabled: !!orgId },
  );

  const trustCols: DataTableColumn[] = useMemo(() => [
    { key: 'entity_id', label: t.entity, sortable: true },
    { key: 'entity_type', label: t.type, sortable: true },
    { key: 'trust_score', label: t.score, sortable: true },
    { key: 'level', label: t.level, type: 'status' as const },
    { key: 'last_evaluated', label: t.lastEvaluated, sortable: true },
  ], [t]);

  const secretCols: DataTableColumn[] = useMemo(() => [
    { key: 'pattern', label: t.pattern, sortable: true },
    { key: 'scope', label: t.scope, sortable: true },
    { key: 'action', label: t.action, type: 'status' as const },
    { key: 'enabled', label: t.enabled, sortable: true },
  ], [t]);

  const resourceRows = useMemo(() => {
    if (!resources) return [];
    return [
      { resource: t.cpuSeconds, current: resources.current_cpu_seconds ?? 0, max: resources.max_cpu_seconds_per_hour ?? 0 },
      { resource: t.memoryMb, current: resources.current_memory_mb ?? 0, max: resources.max_memory_mb ?? 0 },
      { resource: t.storageMb, current: resources.current_storage_mb ?? 0, max: resources.max_storage_mb ?? 0 },
      { resource: t.concurrentAgents, current: resources.current_agents ?? 0, max: resources.max_concurrent_agents ?? 0 },
    ].filter((r) => r.max > 0);
  }, [resources, t]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="flex items-center gap-2">
          <input type="text" placeholder={t.orgFilter} value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="w-40 rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
      </div>

      <MnSectionCard title={t.trustLevels} badge={(trust ?? []).length} collapsible defaultOpen>
        <MnDataTable columns={trustCols}
          data={(trust ?? []).map((tr) => ({
            ...tr,
            trust_score: (tr.trust_score * 100).toFixed(0) + '%',
            last_evaluated: new Date(tr.last_evaluated).toLocaleString(),
          })) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noTrust} />
      </MnSectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.secretsFilters} badge={(secrets ?? []).length} collapsible defaultOpen>
          <div className="space-y-2 p-4">
            {(secrets ?? []).length > 0 ? (
              (secrets ?? []).map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                  <div>
                    <p className="font-mono text-sm">{s.pattern}</p>
                    <p className="text-xs text-muted-foreground">{s.scope}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MnBadge tone={ACTION_TONE[s.action] ?? 'info'}>{s.action}</MnBadge>
                    <MnBadge tone={s.enabled ? 'success' : 'danger'}>
                      {s.enabled ? 'ON' : 'OFF'}
                    </MnBadge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t.noSecrets}</p>
            )}
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.tenancyResources} collapsible defaultOpen>
          <div className="space-y-4 p-4">
            {resourceRows.length > 0 ? (
              resourceRows.map((r) => (
                <div key={r.resource} className="flex items-center gap-4">
                  <MnProgressRing value={r.current} max={r.max} size="sm" label={r.resource} />
                  <div>
                    <p className="text-sm font-medium">{r.resource}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.current} / {r.max}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t.noResources}</p>
            )}
          </div>
        </MnSectionCard>
      </div>
    </div>
  );
}
