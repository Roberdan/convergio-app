'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-ext';
import type { DeployStatus, DeployHistoryEntry } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnDashboardStrip, type StripMetric } from '@/components/maranello';
import { MnStateScaffold, MnModal, toast } from '@/components/maranello/feedback';
import { ArrowUpCircle, RotateCcw } from 'lucide-react';
import { useDeployLocale } from './deploy-i18n';

function formatUptime(secs: number): string {
  const days = Math.floor(secs / 86400);
  const hours = Math.floor((secs % 86400) / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function statusTone(s: string): 'success' | 'warning' | 'danger' | 'info' {
  switch (s) {
    case 'running': return 'success';
    case 'upgrading': return 'info';
    case 'stopped': return 'warning';
    default: return 'danger';
  }
}

export default function DeployPage() {
  const t = useDeployLocale();
  const [upgrading, setUpgrading] = useState(false);
  const [rollbackVersion, setRollbackVersion] = useState<string | null>(null);
  const [rollingBack, setRollingBack] = useState(false);

  const { data: status, loading, error, refetch } = useApiQuery<DeployStatus>(
    extApi.deployStatus,
    { pollInterval: 5_000 },
  );
  const { data: history, refetch: refetchHistory } = useApiQuery<DeployHistoryEntry[]>(
    extApi.deployHistory,
    { pollInterval: 15_000 },
  );

  const historyCols: DataTableColumn[] = useMemo(() => [
    { key: 'version', label: t.version, sortable: true },
    { key: 'status', label: t.status, type: 'status' },
    { key: 'deployed_at', label: t.deployedAt, sortable: true },
    { key: 'duration_secs', label: t.duration, sortable: true },
    { key: 'triggered_by', label: t.triggeredBy },
    {
      key: 'actions',
      label: t.actions,
      render: (_value, row) => (
        <button
          onClick={() => setRollbackVersion(String(row['version'] ?? ''))}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
          style={{ background: 'var(--mn-surface-raised)', border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
          <RotateCcw size={12} />
          {t.rollback}
        </button>
      ),
    },
  ], [t]);

  const metrics: StripMetric[] = useMemo(() => {
    if (!status) return [];
    return [
      { label: t.version, value: status.version },
      { label: t.status, value: status.status ?? 'running' },
      { label: t.uptime, value: status.uptime_secs != null ? formatUptime(status.uptime_secs) : '-' },
      { label: t.environment, value: status.environment ?? status.platform ?? '-' },
    ];
  }, [status, t]);

  const handleUpgrade = useCallback(async () => {
    if (!confirm(t.upgradeConfirm)) return;
    setUpgrading(true);
    try {
      await extApi.deployUpgrade();
      refetch();
      refetchHistory();
    } finally {
      setUpgrading(false);
    }
  }, [t, refetch, refetchHistory]);

  const handleRollback = useCallback(async () => {
    if (!rollbackVersion) return;
    setRollingBack(true);
    try {
      await extApi.deployRollback(rollbackVersion);
      toast.success(t.rollbackSuccess);
      setRollbackVersion(null);
      refetch();
      refetchHistory();
    } catch {
      toast.error(t.rollbackError);
    } finally {
      setRollingBack(false);
    }
  }, [rollbackVersion, t, refetch, refetchHistory]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
        <button onClick={handleUpgrade} disabled={upgrading}
          className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
          <ArrowUpCircle size={16} />
          {upgrading ? t.upgrading : t.upgrade}
        </button>
      </div>

      {status && (
        <>
          <MnDashboardStrip metrics={metrics} />
          <MnSectionCard title={t.currentStatus} collapsible defaultOpen>
            <div className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <MnBadge tone={statusTone(status.status ?? 'running')}>{status.status ?? 'running'}</MnBadge>
                <span className="text-sm font-mono" style={{ color: 'var(--mn-text-muted)' }}>
                  v{status.version}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>
                {t.lastDeploy}: {(status.last_deploy ?? status.last_upgrade) ? new Date((status.last_deploy ?? status.last_upgrade)!).toLocaleString() : '-'}
              </p>
            </div>
          </MnSectionCard>
        </>
      )}

      <MnSectionCard title={t.history} badge={(history ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={historyCols}
          data={(history ?? []) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noHistory}
        />
      </MnSectionCard>

      <MnModal
        open={rollbackVersion !== null}
        onOpenChange={(open) => { if (!open) setRollbackVersion(null); }}
        title={t.rollbackConfirmTitle}
        size="sm">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--mn-text)' }}>
            {t.rollbackConfirmBody}{' '}
            <span className="font-mono font-semibold">{rollbackVersion}</span>?
          </p>
          <div className="flex gap-2">
            <button onClick={handleRollback} disabled={rollingBack}
              className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-error)', color: '#fff' }}>
              {rollingBack ? t.rollingBack : t.rollbackConfirm}
            </button>
            <button onClick={() => setRollbackVersion(null)}
              className="rounded-md px-4 py-2 text-sm font-medium"
              style={{ background: 'var(--mn-surface-raised)', border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
              {t.rollbackCancel}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}
