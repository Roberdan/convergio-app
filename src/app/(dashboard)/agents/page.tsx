'use client';

import { useCallback, useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useApiQuery } from '@/hooks/use-api-query';
import { useSse } from '@/hooks/use-sse';
import * as api from '@/lib/api';
import type { Agent, AgentInput, RuntimeView, IpcEvent } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnModal, MnStateScaffold, toast } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { MnHubSpoke, type HubSpokeHub, type HubSpokeSpoke } from '@/components/maranello/agentic';
import { useAgentsLocale } from './agents-i18n';

const AGENT_COLS: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'model', label: 'Model', sortable: true },
  { key: 'tier', label: 'Tier', sortable: true },
  { key: 'budget_usd', label: 'Budget ($)', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
];

const EMPTY_INPUT: AgentInput = {
  name: '', description: '', model: 'gpt-4o', tier: 'standard', capabilities: [], budget_usd: 100,
};

function agentToInput(agent: Agent): AgentInput {
  return {
    name: agent.name,
    description: agent.description ?? '',
    model: agent.model,
    tier: agent.tier,
    capabilities: agent.capabilities ?? [],
    budget_usd: agent.budget_usd,
  };
}

export default function AgentsPage() {
  const t = useAgentsLocale();
  const [selected, setSelected] = useState<Agent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentInput>({ ...EMPTY_INPUT });
  const [editData, setEditData] = useState<AgentInput>({ ...EMPTY_INPUT });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [heartbeats, setHeartbeats] = useState<Record<string, string>>({});

  const { data: agents, loading, error, refetch } = useApiQuery<Agent[]>(() => api.agentList());
  const { data: runtime } = useApiQuery<RuntimeView>(api.agentRuntime, { pollInterval: 5_000 });

  useSse({
    event_type: 'AgentOnline',
    onMessage: useCallback((e: IpcEvent) => {
      setHeartbeats((prev) => ({ ...prev, [e.from]: e.ts }));
    }, []),
  });

  const agentStatus = useCallback((name: string): 'online' | 'degraded' | 'offline' => {
    const ts = heartbeats[name];
    if (!ts) return 'offline';
    const age = Date.now() - new Date(ts).getTime();
    if (age < 30_000) return 'online';
    if (age < 120_000) return 'degraded';
    return 'offline';
  }, [heartbeats]);

  const hub: HubSpokeHub = { label: 'Runtime', status: 'online' };
  const spokes: HubSpokeSpoke[] = useMemo(
    () => (agents ?? []).slice(0, 12).map((a) => ({
      label: a.name,
      status: agentStatus(a.name),
      connected: agentStatus(a.name) !== 'offline',
    })),
    [agents, agentStatus],
  );

  const handleCreate = useCallback(async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await api.agentCreate(formData);
      setShowCreate(false);
      setFormData({ ...EMPTY_INPUT });
      refetch();
    } finally {
      setSaving(false);
    }
  }, [formData, refetch]);

  const handleDelete = useCallback(async (agent: Agent) => {
    if (!confirm(t.deleteConfirm(agent.name))) return;
    await api.agentDelete(agent.name);
    setSelected(null);
    refetch();
  }, [refetch, t]);

  const openEdit = useCallback((agent: Agent) => {
    setEditTarget(agent);
    setEditData(agentToInput(agent));
  }, []);

  const handleEdit = useCallback(async () => {
    if (!editTarget) return;
    setEditing(true);
    try {
      await api.agentUpdate(editTarget.name, editData);
      setEditTarget(null);
      refetch();
      toast.success(t.editSuccess);
    } catch {
      toast.error(t.editError);
    } finally {
      setEditing(false);
    }
  }, [editTarget, editData, refetch, t]);

  if (loading) return <MnStateScaffold state="loading" message={`${t.title}...`} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          {runtime && (
            <MnBadge tone={runtime.active_agents.length > 0 ? 'success' : 'neutral'}>
              {runtime.active_agents.length} active
            </MnBadge>
          )}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t.spawnAgent}
        </button>
      </div>

      {runtime && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label={t.active} value={runtime.active_agents.length} />
          <KpiCard label={t.queue} value={runtime.queue_depth} />
          <KpiCard label={t.delegations} value={runtime.delegations_active} />
          <KpiCard label={t.stale} value={runtime.stale_count} warn={runtime.stale_count > 0} />
        </div>
      )}

      <MnSectionCard title={t.catalog} badge={(agents ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={AGENT_COLS}
          data={(agents ?? []) as unknown as Record<string, unknown>[]}
          onRowClick={(row) => setSelected(row as unknown as Agent)}
          emptyMessage={t.noAgents}
        />
      </MnSectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <MnSectionCard title={t.network} collapsible defaultOpen>
          <div className="flex items-center justify-center p-4">
            <MnHubSpoke hub={hub} spokes={spokes} />
          </div>
        </MnSectionCard>

        {selected && (
          <MnSectionCard
            title={selected.name}
            collapsible
            defaultOpen
            action={{ label: t.kill, onClick: () => handleDelete(selected) }}
          >
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MnBadge tone={agentStatus(selected.name) === 'online' ? 'success' : agentStatus(selected.name) === 'degraded' ? 'warning' : 'danger'}>
                    {agentStatus(selected.name)}
                  </MnBadge>
                  <span className="text-sm text-muted-foreground">{selected.model} / {selected.tier}</span>
                </div>
                <button
                  onClick={() => openEdit(selected)}
                  className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                  aria-label={t.editAgent}
                >
                  <Pencil size={14} />
                  {t.editAgent}
                </button>
              </div>
              <p className="text-sm">{selected.description}</p>
              <div className="text-sm"><strong>{t.budget}:</strong> ${selected.budget_usd.toFixed(2)}</div>
              <div className="text-sm">
                <strong>{t.capabilities}:</strong>{' '}
                {selected.capabilities.length > 0
                  ? selected.capabilities.map((c) => (
                      <MnBadge key={c} tone="info" className="mr-1">{c}</MnBadge>
                    ))
                  : t.none}
              </div>
              {heartbeats[selected.name] && (
                <div className="text-xs text-muted-foreground">
                  {t.lastHeartbeat}: {new Date(heartbeats[selected.name]).toLocaleTimeString()}
                </div>
              )}
            </div>
          </MnSectionCard>
        )}
      </div>

      <MnModal open={showCreate} onOpenChange={setShowCreate} title={t.spawnAgent}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.name} required>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="e.g. Elena" />
          </MnFormField>
          <MnFormField label={t.description}>
            <input type="text" value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Research specialist" />
          </MnFormField>
          <div className="grid grid-cols-2 gap-4">
            <MnFormField label={t.model}>
              <select value={formData.model}
                onChange={(e) => setFormData((f) => ({ ...f, model: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-opus-4-6">Claude Opus 4.6</option>
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              </select>
            </MnFormField>
            <MnFormField label={t.tier}>
              <select value={formData.tier}
                onChange={(e) => setFormData((f) => ({ ...f, tier: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="economy">Economy</option>
              </select>
            </MnFormField>
          </div>
          <MnFormField label={t.budget}>
            <input type="number" value={formData.budget_usd}
              onChange={(e) => setFormData((f) => ({ ...f, budget_usd: Number(e.target.value) }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" min={0} step={10} />
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="rounded-md border px-4 py-2 text-sm">{t.cancel}</button>
            <button onClick={handleCreate} disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? t.spawning : t.spawn}
            </button>
          </div>
        </div>
      </MnModal>

      <MnModal open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }} title={t.editAgent}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.name} required>
            <input type="text" value={editData.name}
              onChange={(e) => setEditData((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.description}>
            <input type="text" value={editData.description}
              onChange={(e) => setEditData((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <div className="grid grid-cols-2 gap-4">
            <MnFormField label={t.model}>
              <select value={editData.model}
                onChange={(e) => setEditData((f) => ({ ...f, model: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="gpt-4o">GPT-4o</option>
                <option value="claude-opus-4-6">Claude Opus 4.6</option>
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6</option>
              </select>
            </MnFormField>
            <MnFormField label={t.tier}>
              <select value={editData.tier}
                onChange={(e) => setEditData((f) => ({ ...f, tier: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="economy">Economy</option>
              </select>
            </MnFormField>
          </div>
          <MnFormField label={t.budget}>
            <input type="number" value={editData.budget_usd}
              onChange={(e) => setEditData((f) => ({ ...f, budget_usd: Number(e.target.value) }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" min={0} step={10} />
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditTarget(null)} className="rounded-md border px-4 py-2 text-sm">{t.cancel}</button>
            <button onClick={handleEdit} disabled={editing}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {editing ? t.editing : t.saveChanges}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}

function KpiCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${warn ? 'text-destructive' : ''}`}>{value}</p>
    </div>
  );
}
