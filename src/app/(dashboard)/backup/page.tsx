'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import * as extApi from '@/lib/api-ext';
import type { Snapshot, RetentionRule } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDashboardStrip, type StripMetric } from '@/components/maranello';
import { MnStateScaffold, MnModal, toast } from '@/components/maranello/feedback';
import { Database, RotateCcw, Shield, Trash2 } from 'lucide-react';
import { useBackupLocale } from './backup-i18n';
import { RetentionRow } from './retention-row';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

type ModalAction = 'restore' | 'delete' | 'purge';

interface ConfirmState {
  action: ModalAction;
  snapshotId?: string;
}

export default function BackupPage() {
  const t = useBackupLocale();
  const [creating, setCreating] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const { data: snapshots, loading, error, refetch } = useApiQuery<Snapshot[]>(
    api.backupSnapshots,
    { pollInterval: 15_000 },
  );
  const { data: rules, refetch: refetchRules } = useApiQuery<RetentionRule[]>(
    extApi.backupRetentionRules,
    { pollInterval: 60_000 },
  );

  const totalSize = useMemo(
    () => (snapshots ?? []).reduce((sum, s) => sum + s.size_bytes, 0),
    [snapshots],
  );
  const activeRules = useMemo(
    () => (rules ?? []).filter((r) => r.enabled).length,
    [rules],
  );
  const metrics: StripMetric[] = useMemo(() => [
    { label: t.totalSnapshots, value: snapshots?.length ?? 0 },
    { label: t.totalSize, value: formatBytes(totalSize) },
    { label: t.rulesActive, value: activeRules },
  ], [snapshots, totalSize, activeRules, t]);

  const handleCreate = useCallback(async () => {
    setCreating(true);
    try { await api.backupCreate(); refetch(); } finally { setCreating(false); }
  }, [refetch]);

  const handleVerify = useCallback(async (id: string) => {
    setVerifying(id);
    try {
      const res = await extApi.backupVerify(id);
      if (res.ok) toast.success(t.verifyOk);
      else toast.error(res.message ?? t.verifyFail);
    } catch { toast.error(t.verifyFail); }
    finally { setVerifying(null); }
  }, [t]);

  const executeAction = useCallback(async () => {
    if (!confirm) return;
    const { action, snapshotId } = confirm;
    setActioning(snapshotId ?? 'purge');
    setConfirm(null);
    try {
      if (action === 'restore' && snapshotId) {
        await extApi.backupRestore(snapshotId);
        toast.success(t.restoreOk);
      } else if (action === 'delete' && snapshotId) {
        await extApi.backupDelete(snapshotId);
        toast.success(t.deleteOk);
        refetch();
      } else if (action === 'purge') {
        const res = await extApi.backupPurge();
        toast.success(`${t.purgeOkMsg} (${res.deleted})`);
        refetch();
      }
    } catch {
      if (action === 'restore') toast.error(t.restoreFail);
      else if (action === 'delete') toast.error(t.deleteFail);
      else toast.error(t.purgeFail);
    } finally { setActioning(null); }
  }, [confirm, t, refetch]);

  const modalTitle = confirm?.action === 'restore' ? t.confirmRestore
    : confirm?.action === 'delete' ? t.confirmDelete
    : t.confirmPurge;
  const modalBody = confirm?.action === 'restore' ? t.confirmRestoreBody
    : confirm?.action === 'delete' ? t.confirmDeleteBody
    : t.confirmPurgeBody;

  const btnCls = "rounded px-2 py-1 text-xs font-medium disabled:opacity-40 flex items-center gap-1";

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirm({ action: 'purge' })}
            className={btnCls}
            style={{ background: 'var(--mn-error-bg)', color: 'var(--mn-error)' }}
          >
            <Trash2 size={14} />
            {t.purgeOld}
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className={`${btnCls} px-4 py-2`}
            style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
          >
            <Database size={16} />
            {creating ? t.creating : t.createSnapshot}
          </button>
        </div>
      </div>

      <MnDashboardStrip metrics={metrics} />

      {/* Snapshots */}
      <MnSectionCard title={t.snapshots} badge={(snapshots ?? []).length} collapsible defaultOpen>
        {(snapshots ?? []).length === 0
          ? <p className="text-sm py-4 text-center" style={{ color: 'var(--mn-text-muted)' }}>{t.noSnapshots}</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--mn-border)' }}>
                    {[t.id, t.label, t.createdAt, t.size, t.actions].map((h) => (
                      <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--mn-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(snapshots ?? []).map((s) => {
                    const busy = actioning === s.id || verifying === s.id;
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--mn-border-subtle)' }}>
                        <td className="px-3 py-2 text-sm font-mono" style={{ color: 'var(--mn-text)' }}>{s.id}</td>
                        <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text)' }}>{s.label ?? '-'}</td>
                        <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text-muted)' }}>{s.created_at}</td>
                        <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text-muted)' }}>{formatBytes(s.size_bytes)}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVerify(s.id)}
                              disabled={busy}
                              className={btnCls}
                              style={{ background: 'var(--mn-info-bg)', color: 'var(--mn-info)' }}
                              aria-label={t.verify}
                            >
                              <Shield size={12} />
                              {t.verify}
                            </button>
                            <button
                              onClick={() => setConfirm({ action: 'restore', snapshotId: s.id })}
                              disabled={busy}
                              className={btnCls}
                              style={{ background: 'var(--mn-warning-bg)', color: 'var(--mn-warning)' }}
                              aria-label={t.restore}
                            >
                              <RotateCcw size={12} />
                              {t.restore}
                            </button>
                            <button
                              onClick={() => setConfirm({ action: 'delete', snapshotId: s.id })}
                              disabled={busy}
                              className={btnCls}
                              style={{ background: 'var(--mn-error-bg)', color: 'var(--mn-error)' }}
                              aria-label={t.delete}
                            >
                              <Trash2 size={12} />
                              {t.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </MnSectionCard>

      {/* Retention Rules */}
      <MnSectionCard title={t.retentionRules} badge={(rules ?? []).length} collapsible defaultOpen>
        {(rules ?? []).length === 0
          ? <p className="text-sm py-4 text-center" style={{ color: 'var(--mn-text-muted)' }}>{t.noRules}</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--mn-border)' }}>
                    {[t.name, t.keepCount, t.maxAgeDays, t.enabled, t.actions].map((h) => (
                      <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--mn-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(rules ?? []).map((r) => (
                    <RetentionRow key={r.id} rule={r} t={t} onUpdated={refetchRules} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </MnSectionCard>

      {/* Confirmation modal */}
      <MnModal
        open={confirm !== null}
        onOpenChange={(open) => { if (!open) setConfirm(null); }}
        title={modalTitle}
        size="sm"
      >
        <p className="mb-6 text-sm" style={{ color: 'var(--mn-text-muted)' }}>{modalBody}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirm(null)}
            className={`${btnCls} px-3 py-2`}
            style={{ background: 'var(--mn-surface-sunken)', color: 'var(--mn-text-muted)' }}
          >
            {t.cancel}
          </button>
          <button
            onClick={executeAction}
            className={`${btnCls} px-3 py-2`}
            style={{ background: 'var(--mn-error)', color: 'var(--mn-accent-text)' }}
          >
            {t.confirm}
          </button>
        </div>
      </MnModal>
    </div>
  );
}
