'use client';

import { useMemo, useCallback, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-extended';
import type { SecurityFinding, SecurityScan, SecurityPolicy } from '@/lib/types';
import {
  MnSectionCard,
  MnDataTable,
  MnBadge,
  MnDashboardStrip,
} from '@/components/maranello';
import type { DataTableColumn, StripMetric } from '@/components/maranello';
import { Shield, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEVERITY_TONE: Record<SecurityFinding['severity'], 'danger' | 'warning' | 'info'> = {
  critical: 'danger',
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

const SCAN_TONE: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  completed: 'success',
  running: 'warning',
  failed: 'danger',
};

export default function SecurityPage() {
  const [scanning, setScanning] = useState(false);
  const { data: policies, loading: lPol } = useApiQuery(extApi.securityPolicies, { pollInterval: 30_000 });
  const { data: scans, loading: lScan, refetch: refetchScans } = useApiQuery(extApi.securityScans, { pollInterval: 10_000 });
  const { data: findings, loading: lFind, refetch: refetchFindings } = useApiQuery(extApi.securityFindings, { pollInterval: 10_000 });

  const metrics = useMemo<StripMetric[]>(() => {
    const f = findings ?? [];
    const critical = f.filter((x) => x.severity === 'critical').length;
    const high = f.filter((x) => x.severity === 'high').length;
    const scanList = scans ?? [];
    return [
      { label: 'Policies', value: (policies ?? ([] as SecurityPolicy[])).length },
      { label: 'Active Scans', value: scanList.filter((s) => s.status === 'running').length },
      { label: 'Open Findings', value: f.filter((x) => !x.resolved).length },
      { label: 'Critical / High', value: `${critical} / ${high}`, trend: critical + high > 0 ? ('up' as const) : ('flat' as const) },
    ];
  }, [policies, scans, findings]);

  const triggerScan = useCallback(async () => {
    setScanning(true);
    try { await extApi.securityScanTrigger(); refetchScans(); refetchFindings(); } finally { setScanning(false); }
  }, [refetchScans, refetchFindings]);

  const findingCols = useMemo<DataTableColumn[]>(() => [
    { key: 'severity', label: 'Severity', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={SEVERITY_TONE[row.severity as SecurityFinding['severity']] ?? 'neutral'}>{String(row.severity)}</MnBadge>
    )},
    { key: 'title', label: 'Title' },
    { key: 'resource', label: 'Resource' },
    { key: 'resolved', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={row.resolved ? 'success' : 'danger'}>{row.resolved ? 'resolved' : 'open'}</MnBadge>
    )},
  ], []);

  const scanCols = useMemo<DataTableColumn[]>(() => [
    { key: 'status', label: 'Status', render: (_v: unknown, row: Record<string, unknown>) => (
      <MnBadge tone={SCAN_TONE[row.status as string] ?? 'neutral'}>{String(row.status)}</MnBadge>
    )},
    { key: 'started_at', label: 'Started' },
    { key: 'completed_at', label: 'Finished' },
    { key: 'findings', label: 'Findings', align: 'right' as const },
  ], []);

  const loading = lPol || lScan || lFind;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Shield className="h-5 w-5" /> Security
        </h1>
        <button onClick={triggerScan} disabled={scanning}
          className={cn('flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors')}
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
          <Scan className="h-4 w-4" /> {scanning ? 'Scanning\u2026' : 'Trigger Scan'}
        </button>
      </div>
      <MnDashboardStrip metrics={metrics} ariaLabel="Security overview" />
      <MnSectionCard title="Findings" className="overflow-hidden">
        <MnDataTable columns={findingCols} data={(findings ?? []) as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No findings" />
      </MnSectionCard>
      <MnSectionCard title="Scan History" className="overflow-hidden">
        <MnDataTable columns={scanCols} data={(scans ?? []) as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No scans yet" />
      </MnSectionCard>
    </div>
  );
}
