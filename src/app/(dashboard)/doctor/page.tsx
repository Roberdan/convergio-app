'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-ext';
import type { DoctorSummary, DoctorIssue, DoctorFullResult } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnDashboardStrip, type StripMetric } from '@/components/maranello';
import { MnStateScaffold } from '@/components/maranello/feedback';
import { Stethoscope } from 'lucide-react';
import { useDoctorLocale } from './doctor-i18n';

function severityTone(s: string): 'success' | 'warning' | 'danger' | 'info' {
  switch (s) {
    case 'info': return 'info';
    case 'warning': return 'warning';
    case 'error': return 'danger';
    case 'critical': return 'danger';
    default: return 'info';
  }
}

export default function DoctorPage() {
  const t = useDoctorLocale();
  const [running, setRunning] = useState(false);
  const [fullResult, setFullResult] = useState<DoctorFullResult | null>(null);

  const { data: summary, loading, error, refetch } = useApiQuery<DoctorSummary>(
    extApi.doctorSummary,
    { pollInterval: 30_000 },
  );
  const { data: issues, refetch: refetchIssues } = useApiQuery<DoctorIssue[]>(
    extApi.doctorIssues,
    { pollInterval: 30_000 },
  );

  const issueCols: DataTableColumn[] = useMemo(() => [
    { key: 'check_name', label: t.checkName, sortable: true },
    { key: 'severity', label: t.severity, type: 'status' },
    { key: 'message', label: t.message },
    { key: 'detected_at', label: t.detectedAt, sortable: true },
  ], [t]);

  const displaySummary = fullResult?.summary ?? summary;
  const displayIssues = fullResult?.issues ?? issues ?? [];

  const metrics: StripMetric[] = useMemo(() => {
    if (!displaySummary) return [];
    return [
      { label: t.totalChecks, value: displaySummary.total_checks },
      { label: t.passed, value: displaySummary.passed },
      { label: t.warned, value: displaySummary.warned },
      { label: t.failed, value: displaySummary.failed },
    ];
  }, [displaySummary, t]);

  const handleRunDoctor = useCallback(async () => {
    setRunning(true);
    try {
      const result = await extApi.doctorFull();
      setFullResult(result);
      refetch();
      refetchIssues();
    } finally {
      setRunning(false);
    }
  }, [refetch, refetchIssues]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
        <button onClick={handleRunDoctor} disabled={running}
          className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
          <Stethoscope size={16} />
          {running ? t.running : t.runDoctor}
        </button>
      </div>

      {displaySummary && (
        <>
          <MnDashboardStrip metrics={metrics} />
          <MnSectionCard title={t.summary} collapsible defaultOpen>
            <div className="flex items-center gap-4 p-4">
              <MnBadge tone={displaySummary.failed === 0 ? 'success' : 'danger'}>
                {displaySummary.failed === 0 ? t.allPassed : `${displaySummary.failed} ${t.failed}`}
              </MnBadge>
              {displaySummary.warned > 0 && (
                <MnBadge tone="warning">{displaySummary.warned} {t.warned}</MnBadge>
              )}
              <span className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>
                {t.lastRun}: {new Date(displaySummary.last_run).toLocaleString()}
              </span>
            </div>
          </MnSectionCard>
        </>
      )}

      <MnSectionCard title={t.issues} badge={displayIssues.length} collapsible defaultOpen>
        <MnDataTable
          columns={issueCols}
          data={displayIssues.map((issue) => ({
            ...issue,
            severity: issue.severity,
          })) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noIssues}
        />
      </MnSectionCard>
    </div>
  );
}
