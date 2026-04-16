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
import { FileText, Download, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Report } from '@/lib/types';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'info'> = {
  ready: 'success',
  generating: 'warning',
  failed: 'danger',
  queued: 'info',
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const { data, loading, refetch } = useApiQuery(extApi.reportList, { pollInterval: 10_000 });

  const reports: Report[] = Array.isArray(data) ? data as Report[] : (data as unknown as { reports?: Report[] })?.reports ?? [];

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Total Reports', value: reports.length },
    { label: 'Ready', value: reports.filter((r) => r.status === 'ready').length },
    { label: 'Generating', value: reports.filter((r) => r.status === 'generating').length },
  ], [reports]);

  const generate = useCallback(async () => {
    setGenerating(true);
    try { await extApi.reportGenerate({ type: 'general' }); refetch(); } finally { setGenerating(false); }
  }, [refetch]);

  const columns = useMemo<DataTableColumn[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={STATUS_TONE[row.status as string] ?? 'neutral'}>{String(row.status)}</MnBadge>
    )},
    { key: 'created_at', label: 'Created' },
    { key: 'download', label: '', render: (_v: unknown, row: Record<string, unknown>) => {
      const r = row as unknown as Report;
      if (r.status !== 'ready' || !r.download_url) return null;
      return (
        <a
          href={r.download_url}
          className="flex items-center gap-1 text-xs font-medium underline"
          style={{ color: 'var(--mn-accent)' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="h-3 w-3" /> Download
        </a>
      );
    }},
  ], []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <FileText className="h-5 w-5" /> Reports
        </h1>
        <button
          onClick={generate}
          disabled={generating}
          className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors')}
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
        >
          <Plus className="h-4 w-4" /> {generating ? 'Generating…' : 'New Report'}
        </button>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Reports overview" />

      <MnSectionCard title="All Reports" className="overflow-hidden">
        <MnDataTable columns={columns} data={(reports ?? []) as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No reports yet" />
      </MnSectionCard>
    </div>
  );
}
