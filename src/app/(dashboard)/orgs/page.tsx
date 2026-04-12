'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { Org, OrgInput, PeerEntry } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnOrgChart, type OrgNode } from '@/components/maranello/network';
import { MnBudgetTreemap, type TreemapItem } from '@/components/maranello/data-viz';
import { MnModal, MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { MnProgressRing } from '@/components/maranello/data-display';
import { useOrgsLocale } from './orgs-i18n';

export default function OrgsPage() {
  const t = useOrgsLocale();
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [formMode, setFormMode] = useState<null | 'create' | 'edit'>(null);
  const [formData, setFormData] = useState<OrgInput>({ name: '', budget_usd: 0 });
  const [saving, setSaving] = useState(false);

  const { data: orgs, loading, error, refetch } = useApiQuery<Org[]>(api.orgList);
  const { data: peers } = useApiQuery<PeerEntry[]>(
    () => selectedOrg ? api.tenancyPeers(selectedOrg.id) : Promise.resolve([]),
    { enabled: !!selectedOrg },
  );

  const columns: DataTableColumn[] = useMemo(() => [
    { key: 'name', label: t.name, sortable: true },
    { key: 'status', label: t.status, type: 'status' },
    { key: 'agent_count', label: t.agents, sortable: true },
    { key: 'budget_usd', label: t.budget, sortable: true },
    { key: 'spent_usd', label: t.spent, sortable: true },
    { key: 'created_at', label: t.created, sortable: true },
  ], [t]);

  const orgTree: OrgNode = useMemo(() => ({
    name: 'Convergio Platform',
    role: 'Root',
    status: 'active',
    children: (orgs ?? []).map((o) => ({
      name: o.name,
      role: o.description ?? 'Organization',
      status: o.status === 'active' ? 'active' : o.status === 'suspended' ? 'error' : 'inactive' as const,
    })),
  }), [orgs]);

  const budgetItems: TreemapItem[] = useMemo(
    () => (orgs ?? []).map((o) => ({ name: o.name, value: o.spent_usd ?? 0 })),
    [orgs],
  );

  const openCreate = useCallback(() => {
    setFormData({ name: '', budget_usd: 0 });
    setFormMode('create');
  }, []);

  const openEdit = useCallback((org: Org) => {
    setFormData({ name: org.name, description: org.description, budget_usd: org.budget_usd ?? org.budget ?? 0 });
    setFormMode('edit');
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      if (formMode === 'edit' && selectedOrg) {
        await api.orgUpdate(selectedOrg.id, formData);
      } else {
        await api.orgCreate(formData);
      }
      setFormMode(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }, [formData, formMode, selectedOrg, refetch]);

  const handleDelete = useCallback(async (org: Org) => {
    if (!confirm(t.deleteConfirm(org.name))) return;
    await api.orgDelete(org.id);
    setSelectedOrg(null);
    refetch();
  }, [refetch, t]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <button onClick={openCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          {t.newOrg}
        </button>
      </div>

      <MnSectionCard title={t.allOrgs} badge={(orgs ?? []).length} collapsible defaultOpen>
        <MnDataTable columns={columns}
          data={(orgs ?? []) as unknown as Record<string, unknown>[]}
          onRowClick={(row) => setSelectedOrg(row as unknown as Org)}
          emptyMessage={t.noOrgs} />
      </MnSectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.orgChart} collapsible defaultOpen>
          <div className="p-4">
            <MnOrgChart tree={orgTree}
              onNodeClick={(node) => {
                const found = (orgs ?? []).find((o) => o.name === node.name);
                if (found) setSelectedOrg(found);
              }}
              ariaLabel={t.orgChart} />
          </div>
        </MnSectionCard>

        <MnSectionCard title={t.budgetDist} collapsible defaultOpen>
          <div className="p-4">
            {budgetItems.length > 0 ? (
              <MnBudgetTreemap items={budgetItems} ariaLabel={t.budgetDist} />
            ) : (
              <p className="text-sm text-muted-foreground">{t.noBudget}</p>
            )}
          </div>
        </MnSectionCard>

        {selectedOrg && (
          <MnSectionCard title={selectedOrg.name} collapsible defaultOpen>
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <MnBadge tone={selectedOrg.status === 'active' ? 'success' : 'danger'}>
                  {selectedOrg.status}
                </MnBadge>
                <span className="text-sm text-muted-foreground">{selectedOrg.description}</span>
              </div>
              <div className="flex items-center gap-6">
                <MnProgressRing value={selectedOrg.spent_usd ?? 0} max={selectedOrg.budget_usd ?? selectedOrg.budget ?? 0}
                  size="md" label={t.budgetUsage} />
                <div>
                  <p className="text-sm font-medium">
                    ${(selectedOrg.spent_usd ?? 0).toFixed(2)} / ${(selectedOrg.budget_usd ?? selectedOrg.budget ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedOrg.agent_count ?? 0} {t.agents.toLowerCase()}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => openEdit(selectedOrg)}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted/50">{t.edit}</button>
                <button onClick={() => handleDelete(selectedOrg)}
                  className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10">
                  {t.delete}
                </button>
              </div>
            </div>
          </MnSectionCard>
        )}

        {selectedOrg && (
          <MnSectionCard title={t.interOrgPeers} collapsible defaultOpen>
            <div className="space-y-2 p-4">
              {(peers ?? []).length > 0 ? (
                (peers ?? []).map((p) => (
                  <div key={p.peer_name} className="flex items-center justify-between border-b border-border py-2">
                    <span className="text-sm font-medium">{p.peer_name}</span>
                    <MnBadge tone={p.allowed ? 'success' : 'danger'}>
                      {p.allowed ? t.allowed : t.blocked}
                    </MnBadge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t.noPeers}</p>
              )}
            </div>
          </MnSectionCard>
        )}
      </div>

      <MnModal open={!!formMode} onOpenChange={(v) => !v && setFormMode(null)}
        title={formMode === 'edit' ? t.editOrg : t.newOrg}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.name} required error={!formData.name && saving ? t.required : undefined}>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.description}>
            <input type="text" value={formData.description ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.budgetUsd}>
            <input type="number" value={formData.budget_usd}
              onChange={(e) => setFormData((f) => ({ ...f, budget_usd: Number(e.target.value) }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" min={0} step={10} />
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setFormMode(null)} className="rounded-md border px-4 py-2 text-sm">
              {t.cancel}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? (formMode === 'edit' ? t.saving : t.creating) : (formMode === 'edit' ? t.save : t.create)}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}
