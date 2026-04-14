'use client';

import { useMemo, useCallback, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-extended';
import {
  MnSectionCard,
  MnDataTable,
  MnBadge,
  MnDashboardStrip,
} from '@/components/maranello';
import type { DataTableColumn, StripMetric } from '@/components/maranello';
import { Rocket, RotateCcw, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Deployment } from '@/lib/types';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  live: 'success',
  deploying: 'warning',
  pending: 'info',
  failed: 'danger',
  rolled_back: 'neutral',
};

export default function DeployPage() {
  const [acting, setActing] = useState<string | null>(null);
  const { data, loading, refetch } = useApiQuery(extApi.deployList, { pollInterval: 10_000 });

  const deploys = data ?? [];

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Total', value: deploys.length },
    { label: 'Live', value: deploys.filter((d) => d.status === 'live').length },
    { label: 'Pending', value: deploys.filter((d) => d.status === 'pending').length },
  ], [deploys]);

  const deploy = useCallback(async () => {
    setActing('deploy');
    try { await extApi.deployTrigger('default', 'latest'); refetch(); } finally { setActing(null); }
  }, [refetch]);

  const rollback = useCallback(async (id: string) => {
    setActing(id);
    try { await extApi.deployRollback(id); refetch(); } finally { setActing(null); }
  }, [refetch]);

  const columns = useMemo<DataTableColumn[]>(() => [
    { key: 'target', label: 'Target' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={STATUS_TONE[row.status as string] ?? 'neutral'}>{String(row.status)}</MnBadge>
    )},
    { key: 'created_at', label: 'Created' },
    { key: 'completed_at', label: 'Finished' },
    { key: 'actions', label: '', render: (_v: unknown, row: Record<string, unknown>) => {
      const d = row as unknown as Deployment;
      if (d.status !== 'live') return null;
      return (
        <button
          onClick={() => rollback(d.id)}
          disabled={acting === d.id}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
          style={{ color: 'var(--mn-error)' }}
        >
          <RotateCcw className="h-3 w-3" /> Rollback
        </button>
      );
    }},
  ], [acting, rollback]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Rocket className="h-5 w-5" /> Deployments
        </h1>
        <button
          onClick={deploy}
          disabled={acting !== null}
          className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors')}
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
        >
          <Upload className="h-4 w-4" /> {acting === 'deploy' ? 'Deploying…' : 'Deploy'}
        </button>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Deployment overview" />

      <MnSectionCard title="Deployment History" className="overflow-hidden">
        <MnDataTable columns={columns} data={(deploys ?? []) as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No deployments" />
      </MnSectionCard>
    </div>
  );
}
