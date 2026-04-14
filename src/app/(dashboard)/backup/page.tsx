'use client';

import { useMemo, useCallback, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import {
  MnSectionCard,
  MnDataTable,
  MnBadge,
  MnDashboardStrip,
} from '@/components/maranello';
import type { DataTableColumn, StripMetric } from '@/components/maranello';
import { HardDrive, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Snapshot } from '@/lib/types';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function BackupPage() {
  const [creating, setCreating] = useState(false);
  const { data, loading, refetch } = useApiQuery(api.backupSnapshots, { pollInterval: 30_000 });

  const snapshots = (data ?? []) as unknown as Snapshot[];

  const totalSize = useMemo(() => snapshots.reduce((sum, s) => sum + (s.size_bytes ?? 0), 0), [snapshots]);
  const latestDate = useMemo(() => {
    if (snapshots.length === 0) return '\u2014';
    return snapshots.reduce((latest, s) => (s.created_at > latest ? s.created_at : latest), snapshots[0].created_at);
  }, [snapshots]);

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Snapshots', value: snapshots.length },
    { label: 'Latest', value: latestDate },
    { label: 'Total Size', value: formatBytes(totalSize) },
  ], [snapshots.length, latestDate, totalSize]);

  const createBackup = useCallback(async () => {
    setCreating(true);
    try { await api.backupCreate(); refetch(); } finally { setCreating(false); }
  }, [refetch]);

  const columns = useMemo<DataTableColumn[]>(() => [
    { key: 'label', label: 'Label' },
    { key: 'created_at', label: 'Created' },
    { key: 'size_bytes', label: 'Size', align: 'right' as const, render: (_v: unknown, row: Record<string, unknown>) => (
      <span>{formatBytes(Number(row.size_bytes ?? 0))}</span>
    )},
  ], []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <HardDrive className="h-5 w-5" /> Backups
        </h1>
        <button
          onClick={createBackup}
          disabled={creating}
          className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors')}
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
        >
          <Plus className="h-4 w-4" /> {creating ? 'Creating…' : 'New Backup'}
        </button>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Backup overview" />

      <MnSectionCard title="Snapshots" className="overflow-hidden">
        <MnDataTable columns={columns} data={snapshots as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No snapshots" />
      </MnSectionCard>
    </div>
  );
}
