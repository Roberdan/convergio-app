'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { UsageResponse, Invoice, RateCard, Org, BillingAlert, BillingAlertInput } from '@/lib/types';
import { billingAlertList, billingAlertCreate } from '@/lib/api-ext';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnBudgetTreemap, type TreemapItem, MnChart } from '@/components/maranello/data-viz';
import { MnModal, MnStateScaffold } from '@/components/maranello/feedback';
import { toast } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { MnDashboardStrip, type StripMetric } from '@/components/maranello';
import { useBillingLocale } from './billing-i18n';

export default function BillingPage() {
  const t = useBillingLocale();
  const [selectedOrg, setSelectedOrg] = useState('');
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertForm, setAlertForm] = useState<BillingAlertInput>({
    org_id: '', threshold_usd: 100, notification_channel: 'email',
  });
  const [savingAlert, setSavingAlert] = useState(false);

  const { data: orgs } = useApiQuery<Org[]>(api.orgList);
  const { data: usage, loading, error, refetch } = useApiQuery<UsageResponse>(
    () => selectedOrg ? api.billingUsage({ org_id: selectedOrg }) : Promise.reject(new Error('no org')),
    { enabled: !!selectedOrg, pollInterval: 10_000 },
  );
  const { data: invoices } = useApiQuery<Invoice[]>(
    () => selectedOrg ? api.billingInvoices(selectedOrg) : Promise.resolve([]),
    { enabled: !!selectedOrg, pollInterval: 60_000 },
  );
  const { data: rates } = useApiQuery<RateCard[]>(
    () => selectedOrg ? api.billingRates(selectedOrg) : Promise.resolve([]),
    { enabled: !!selectedOrg, pollInterval: 60_000 },
  );
  const { data: alerts, refetch: refetchAlerts } = useApiQuery<BillingAlert[]>(
    () => selectedOrg ? billingAlertList(selectedOrg) : Promise.resolve([]),
    { enabled: !!selectedOrg, pollInterval: 60_000 },
  );

  const handleSaveAlert = useCallback(async () => {
    setSavingAlert(true);
    try {
      await billingAlertCreate({ ...alertForm, org_id: alertForm.org_id || selectedOrg });
      toast.success(t.alertSaved);
      setAlertModalOpen(false);
      refetchAlerts();
    } catch {
      toast.error(t.alertSaveFailed);
    } finally {
      setSavingAlert(false);
    }
  }, [alertForm, selectedOrg, t, refetchAlerts]);

  const alertCols: DataTableColumn[] = useMemo(() => [
    { key: 'threshold_usd', label: t.alertThreshold, sortable: true },
    { key: 'notification_channel', label: t.alertChannel, sortable: true },
    { key: 'created_at', label: t.alertCreated, sortable: true },
  ], [t]);

  const invoiceCols: DataTableColumn[] = useMemo(() => [
    { key: 'id', label: t.invoice, sortable: true },
    { key: 'amount', label: t.amount, sortable: true },
    { key: 'currency', label: t.currency },
    { key: 'status', label: t.status, type: 'status' },
    { key: 'period_start', label: t.periodStart, sortable: true },
    { key: 'period_end', label: t.periodEnd, sortable: true },
  ], [t]);

  const rateCols: DataTableColumn[] = useMemo(() => [
    { key: 'capability', label: t.capability, sortable: true },
    { key: 'unit', label: t.unit },
    { key: 'rate', label: t.rate, sortable: true },
  ], [t]);

  const budgetItems: TreemapItem[] = useMemo(
    () => (orgs ?? []).map((o) => ({ name: o.name, value: o.spent_usd ?? 0 })),
    [orgs],
  );

  const metrics: StripMetric[] = useMemo(() => [
    { label: t.dailyCost, value: usage ? `$${usage.daily_cost.toFixed(2)}` : '-' },
    { label: t.monthlyCost, value: usage ? `$${usage.monthly_cost.toFixed(2)}` : '-' },
    { label: t.categories, value: usage?.categories.length ?? 0 },
  ], [usage, t]);

  const categoryLabels = useMemo(() => (usage?.categories ?? []).map((c) => c.category), [usage]);
  const categorySeries = useMemo(() => [{
    label: t.costByCategory,
    data: (usage?.categories ?? []).map((c) => c.cost),
    color: 'var(--mn-accent)',
  }], [usage, t]);

  if (!selectedOrg) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
        <MnSectionCard title={t.budgetHierarchy} collapsible defaultOpen>
          <div className="p-4">
            {budgetItems.length > 0
              ? <MnBudgetTreemap items={budgetItems} ariaLabel={t.budgetHierarchy} />
              : <MnStateScaffold state="empty" message={t.noOrgs} />}
          </div>
        </MnSectionCard>
        <MnSectionCard title={t.selectOrg} collapsible defaultOpen>
          <div className="space-y-2 p-4">
            {(orgs ?? []).map((o) => (
              <button key={o.id} onClick={() => setSelectedOrg(o.id)}
                className="flex w-full items-center justify-between rounded-md p-3 text-left"
                style={{ border: '1px solid var(--mn-border)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--mn-text)' }}>{o.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--mn-text-muted)' }}>
                    ${(o.spent_usd ?? 0).toFixed(2)} / ${(o.budget_usd ?? o.budget ?? 0).toFixed(2)}
                  </span>
                  <MnBadge tone={o.status === 'active' ? 'success' : 'danger'}>{o.status}</MnBadge>
                </div>
              </button>
            ))}
            {(orgs ?? []).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>{t.noOrgs}</p>
            )}
          </div>
        </MnSectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
          <MnBadge tone="info">{(orgs ?? []).find((o) => o.id === selectedOrg)?.name ?? selectedOrg}</MnBadge>
        </div>
        <button onClick={() => setSelectedOrg('')}
          className="rounded-md px-3 py-1 text-sm"
          style={{ border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
          {t.allOrgs}
        </button>
      </div>

      {loading && <MnStateScaffold state="loading" message={t.loading} />}
      {error && <MnStateScaffold state="error" message={error} onRetry={refetch} />}

      {usage && <MnDashboardStrip metrics={metrics} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.costByCategory} collapsible defaultOpen>
          <div className="p-4">
            {categoryLabels.length > 0
              ? <MnChart type="bar" labels={categoryLabels} series={categorySeries} showLegend={false} />
              : <p className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>{t.noCategoryData}</p>}
          </div>
        </MnSectionCard>
        <MnSectionCard title={t.rateCards} badge={(rates ?? []).length} collapsible defaultOpen>
          <MnDataTable
            columns={rateCols}
            data={(rates ?? []) as unknown as Record<string, unknown>[]}
            emptyMessage={t.noRateCards}
          />
        </MnSectionCard>
      </div>

      <MnSectionCard title={t.invoices} badge={(invoices ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={invoiceCols}
          data={(invoices ?? []) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noInvoices}
        />
      </MnSectionCard>

      <MnSectionCard
        title={t.alerts}
        badge={(alerts ?? []).length}
        collapsible
        defaultOpen
        action={{ label: t.addAlert, onClick: () => { setAlertForm({ org_id: selectedOrg, threshold_usd: 100, notification_channel: 'email' }); setAlertModalOpen(true); } }}
      >
        <MnDataTable
          columns={alertCols}
          data={(alerts ?? []).map((a) => ({
            ...a, created_at: new Date(a.created_at).toLocaleString(),
          })) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noAlerts}
        />
      </MnSectionCard>

      <MnModal open={alertModalOpen} onOpenChange={setAlertModalOpen} title={t.addAlertTitle}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.alertThreshold}>
            <input type="number" min={1} value={alertForm.threshold_usd}
              onChange={(e) => setAlertForm((f) => ({ ...f, threshold_usd: Number(e.target.value) }))}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', borderColor: 'var(--mn-border)', color: 'var(--mn-text)' }} />
          </MnFormField>
          <MnFormField label={t.alertChannel}>
            <select value={alertForm.notification_channel}
              onChange={(e) => setAlertForm((f) => ({ ...f, notification_channel: e.target.value }))}
              className="w-full rounded-md border px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', borderColor: 'var(--mn-border)', color: 'var(--mn-text)' }}>
              <option value="email">Email</option>
              <option value="telegram">Telegram</option>
              <option value="webhook">Webhook</option>
            </select>
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAlertModalOpen(false)}
              className="rounded-md border px-4 py-2 text-sm"
              style={{ borderColor: 'var(--mn-border)', color: 'var(--mn-text)' }}>
              {t.cancel}
            </button>
            <button onClick={handleSaveAlert} disabled={savingAlert}
              className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
              {savingAlert ? '...' : t.save}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}
