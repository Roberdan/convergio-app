'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-ext';
import type { SchedulerPolicy, SchedulerDecision } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnStateScaffold, toast } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { useSchedulerLocale } from './scheduler-i18n';

export default function SchedulerPage() {
  const t = useSchedulerLocale();
  const [testPrompt, setTestPrompt] = useState('');
  const [testTier, setTestTier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<SchedulerDecision | null>(null);

  // Policy edit state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStrategy, setEditStrategy] = useState('');
  const [editMaxConcurrent, setEditMaxConcurrent] = useState('');
  const [editEnabled, setEditEnabled] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);

  const { data: policy, loading, error, refetch } = useApiQuery<SchedulerPolicy>(
    extApi.schedulerPolicy,
    { pollInterval: 30_000 },
  );
  const { data: history, refetch: refetchHistory } = useApiQuery<SchedulerDecision[]>(
    () => extApi.schedulerHistory({ limit: 50 }),
    { pollInterval: 10_000 },
  );

  const historyCols: DataTableColumn[] = useMemo(() => [
    { key: 'agent_id', label: t.agentId, sortable: true },
    { key: 'model', label: t.model, sortable: true },
    { key: 'reason', label: t.reason },
    { key: 'cost_estimate', label: t.costEstimate, sortable: true },
    { key: 'decided_at', label: t.decidedAt, sortable: true },
  ], [t]);

  const handleSubmit = useCallback(async () => {
    if (!testPrompt) return;
    setSubmitting(true);
    try {
      const result = await extApi.schedulerDecide({
        prompt: testPrompt,
        tier: testTier || undefined,
      });
      setTestResult(result);
      refetchHistory();
    } finally {
      setSubmitting(false);
    }
  }, [testPrompt, testTier, refetchHistory]);

  const openEdit = useCallback(() => {
    if (!policy) return;
    setEditName(policy.name);
    setEditStrategy(policy.strategy);
    setEditMaxConcurrent(String(policy.max_concurrent));
    setEditEnabled(policy.enabled);
    setEditMode(true);
  }, [policy]);

  const handleSavePolicy = useCallback(async () => {
    setSavingPolicy(true);
    try {
      await extApi.schedulerUpdatePolicy({
        name: editName,
        strategy: editStrategy,
        max_concurrent: Number(editMaxConcurrent),
        enabled: editEnabled,
      });
      toast.success(t.policySaved);
      setEditMode(false);
      refetch();
    } catch {
      toast.error(t.policySaveError);
    } finally {
      setSavingPolicy(false);
    }
  }, [editName, editStrategy, editMaxConcurrent, editEnabled, t, refetch]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>

      {policy && (
        <MnSectionCard title={t.policy} collapsible defaultOpen>
          {!editMode ? (
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MnBadge tone={policy.enabled ? 'success' : 'warning'}>
                    {policy.enabled ? t.enabled : t.disabled}
                  </MnBadge>
                  <span className="text-sm font-medium" style={{ color: 'var(--mn-text)' }}>
                    {policy.name}
                  </span>
                </div>
                <button onClick={openEdit}
                  className="rounded-md px-3 py-1.5 text-sm font-medium"
                  style={{ background: 'var(--mn-surface-raised)', border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
                  {t.editPolicy}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span style={{ color: 'var(--mn-text-muted)' }}>{t.strategy}: </span>
                  <span className="font-mono" style={{ color: 'var(--mn-text)' }}>{policy.strategy}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--mn-text-muted)' }}>{t.maxConcurrent}: </span>
                  <span className="font-mono" style={{ color: 'var(--mn-text)' }}>{policy.max_concurrent}</span>
                </div>
              </div>
              {policy.priority_boost && Object.keys(policy.priority_boost).length > 0 && (
                <div>
                  <p className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>{t.priorityBoost}:</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Object.entries(policy.priority_boost).map(([key, val]) => (
                      <MnBadge key={key} tone="info">{key}: +{val}</MnBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <MnFormField label={t.policyName} required>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-md px-3 py-2 text-sm"
                  style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }} />
              </MnFormField>
              <MnFormField label={t.strategy} required>
                <input type="text" value={editStrategy} onChange={(e) => setEditStrategy(e.target.value)}
                  className="w-full rounded-md px-3 py-2 text-sm"
                  style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }} />
              </MnFormField>
              <MnFormField label={t.maxConcurrent} required>
                <input type="number" value={editMaxConcurrent} onChange={(e) => setEditMaxConcurrent(e.target.value)}
                  className="w-full rounded-md px-3 py-2 text-sm"
                  style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }} />
              </MnFormField>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="policy-enabled" checked={editEnabled}
                  onChange={(e) => setEditEnabled(e.target.checked)} />
                <label htmlFor="policy-enabled" className="text-sm" style={{ color: 'var(--mn-text)' }}>
                  {t.enabled}
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSavePolicy} disabled={savingPolicy}
                  className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                  style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
                  {savingPolicy ? t.savingPolicy : t.savePolicy}
                </button>
                <button onClick={() => setEditMode(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium"
                  style={{ background: 'var(--mn-surface-raised)', border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </MnSectionCard>
      )}

      <MnSectionCard title={t.testDecision} collapsible defaultOpen>
        <div className="space-y-4 p-4">
          <MnFormField label={t.prompt} required>
            <textarea value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="h-20 w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.promptPlaceholder} />
          </MnFormField>
          <MnFormField label={t.tier}>
            <input type="text" value={testTier}
              onChange={(e) => setTestTier(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder="opus, sonnet, haiku" />
          </MnFormField>
          <button onClick={handleSubmit} disabled={submitting || !testPrompt}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
            {submitting ? t.submitting : t.submit}
          </button>
          {testResult && (
            <div className="rounded-md p-3" style={{ background: 'var(--mn-surface-sunken)' }}>
              <p className="mb-1 text-xs font-medium" style={{ color: 'var(--mn-text-muted)' }}>
                {t.result}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <MnBadge tone="info">{testResult.model}</MnBadge>
                <span style={{ color: 'var(--mn-text)' }}>{testResult.reason}</span>
                <span className="font-mono text-xs" style={{ color: 'var(--mn-text-muted)' }}>
                  ${testResult.cost_estimate.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>
      </MnSectionCard>

      <MnSectionCard title={t.history} badge={(history ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={historyCols}
          data={(history ?? []).map((d) => ({
            ...d,
            cost_estimate: `$${d.cost_estimate.toFixed(4)}`,
          })) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noHistory}
        />
      </MnSectionCard>
    </div>
  );
}
