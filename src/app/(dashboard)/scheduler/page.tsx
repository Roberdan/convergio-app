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
import { Clock, Play, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { ScheduledJob } from '@/lib/types';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  running: 'warning',
  succeeded: 'success',
  failed: 'danger',
  idle: 'neutral',
};

export default function SchedulerPage() {
  const [busy, setBusy] = useState<string | null>(null);
  const { data, loading, refetch } = useApiQuery(extApi.schedulerJobs, { pollInterval: 10_000 });

  const jobs = data ?? [];

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Total Jobs', value: jobs.length },
    { label: 'Running', value: jobs.filter((j) => j.status === 'running').length },
    { label: 'Failed', value: jobs.filter((j) => j.status === 'failed').length, trend: jobs.some((j) => j.status === 'failed') ? 'up' as const : 'flat' as const },
  ], [jobs]);

  const trigger = useCallback(async (id: string) => {
    setBusy(id);
    try { await extApi.schedulerJobTrigger(id); refetch(); } finally { setBusy(null); }
  }, [refetch]);

  const toggle = useCallback(async (id: string, enabled: boolean) => {
    setBusy(id);
    try { await extApi.schedulerJobToggle(id, !enabled); refetch(); } finally { setBusy(null); }
  }, [refetch]);

  const columns = useMemo<DataTableColumn[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'schedule', label: 'Schedule (cron)' },
    { key: 'status', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={STATUS_TONE[row.status as string] ?? 'neutral'}>{String(row.status)}</MnBadge>
    )},
    { key: 'last_run', label: 'Last Run' },
    { key: 'next_run', label: 'Next Run' },
    { key: 'actions', label: 'Actions', render: (_v: unknown, row: Record<string, unknown>) => {
      const j = row as unknown as ScheduledJob;
      const isBusy = busy === j.id;
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => trigger(j.id)}
            disabled={isBusy}
            className={cn('flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors')}
            style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
          >
            <Play className="h-3 w-3" /> Run
          </button>
          <button
            onClick={() => toggle(j.id, j.enabled)}
            disabled={isBusy}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors"
            style={{ color: 'var(--mn-text-muted)' }}
          >
            {j.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {j.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      );
    }},
  ], [busy, trigger, toggle]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
        <Clock className="h-5 w-5" /> Scheduler
      </h1>

      <MnDashboardStrip metrics={metrics} ariaLabel="Scheduler overview" />

      <MnSectionCard title="Scheduled Jobs" className="overflow-hidden">
        <MnDataTable columns={columns} data={(jobs ?? []) as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No scheduled jobs" />
      </MnSectionCard>
    </div>
  );
}
