'use client';

import { useMemo, useCallback } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-extended';
import {
  MnSectionCard,
  MnDataTable,
  MnBadge,
} from '@/components/maranello';
import type { DataTableColumn } from '@/components/maranello';
import { Stethoscope, RefreshCw } from 'lucide-react';
import type { DiagnosticReport } from '@/lib/types';
import { cn } from '@/lib/utils';

const OVERALL_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  healthy: 'success',
  degraded: 'warning',
  unhealthy: 'danger',
};

const CHECK_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  pass: 'success',
  warn: 'warning',
  fail: 'danger',
};

export default function DoctorPage() {
  const { data, loading, refetch } = useApiQuery(extApi.doctorRun, { pollInterval: 30_000 });

  const diag = data as DiagnosticReport | null;
  const checks = diag?.checks ?? [];

  const rerun = useCallback(() => { refetch(); }, [refetch]);

  const columns = useMemo<DataTableColumn[]>(() => [
    { key: 'name', label: 'Check' },
    { key: 'status', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={CHECK_TONE[row.status as string] ?? 'neutral'}>{String(row.status)}</MnBadge>
    )},
    { key: 'message', label: 'Message' },
    { key: 'details', label: 'Details' },
  ], []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Stethoscope className="h-5 w-5" /> Doctor
        </h1>
        <button
          onClick={rerun}
          disabled={loading}
          className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors')}
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Re-run
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium" style={{ color: 'var(--mn-text-muted)' }}>Overall Status</span>
        <MnBadge tone={OVERALL_TONE[diag?.overall ?? ''] ?? 'neutral'} className="text-lg px-4 py-1">
          {diag?.overall ?? 'unknown'}
        </MnBadge>
      </div>

      <MnSectionCard title="Diagnostic Checks" className="overflow-hidden">
        <MnDataTable columns={columns} data={checks as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No diagnostics available" />
      </MnSectionCard>
    </div>
  );
}
