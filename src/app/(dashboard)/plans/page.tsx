'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import type { Plan, PlanInput, Wave, Task } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge, MnProgressRing } from '@/components/maranello/data-display';
import { MnModal, MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';

const PLAN_COLS: DataTableColumn[] = [
  { key: 'name', label: 'Plan', sortable: true },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'wave_count', label: 'Waves', sortable: true },
  { key: 'task_count', label: 'Tasks', sortable: true },
  { key: 'completed_tasks', label: 'Done', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true },
];

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  done: 'success', completed: 'success', in_progress: 'info', pending: 'neutral',
  submitted: 'warning', failed: 'danger',
};

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState<PlanInput>({ name: '' });
  const [saving, setSaving] = useState(false);
  const [expandedWaves, setExpandedWaves] = useState<Set<string>>(new Set());

  const { data: plans, loading, error, refetch } = useApiQuery<Plan[]>(() => api.planList());
  const { data: waves } = useApiQuery<Wave[]>(
    () => selectedPlan ? api.planWaves(selectedPlan.id) : Promise.resolve([]),
    { enabled: !!selectedPlan },
  );

  const staleTasks: Task[] = useMemo(
    () => (waves ?? []).flatMap((w) => w.tasks).filter((t) => t.status === 'in_progress' && !t.assignee),
    [waves],
  );

  const toggleWave = useCallback((id: string) => {
    setExpandedWaves((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleCreate = useCallback(async () => {
    if (!formData.name) return;
    setSaving(true);
    try {
      await api.planCreate(formData);
      setShowCreate(false);
      setFormData({ name: '' });
      refetch();
    } finally {
      setSaving(false);
    }
  }, [formData, refetch]);

  if (loading) return <MnStateScaffold state="loading" message="Loading plans..." />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plans & Tasks</h1>
        <button onClick={() => setShowCreate(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New Plan
        </button>
      </div>

      <MnSectionCard title="All Plans" badge={(plans ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={PLAN_COLS}
          data={(plans ?? []) as unknown as Record<string, unknown>[]}
          onRowClick={(row) => { setSelectedPlan(row as unknown as Plan); setExpandedWaves(new Set()); }}
          emptyMessage="No plans found"
        />
      </MnSectionCard>

      {selectedPlan && (
        <MnSectionCard title={`${selectedPlan.name} — Execution Tree`} collapsible defaultOpen>
          <div className="space-y-1 p-4">
            <div className="mb-3 flex items-center gap-3">
              <MnProgressRing value={selectedPlan.completed_tasks} max={selectedPlan.task_count} size="sm" label="Progress" />
              <span className="text-sm">{selectedPlan.completed_tasks}/{selectedPlan.task_count} tasks</span>
              <MnBadge tone={STATUS_TONE[selectedPlan.status] ?? 'neutral'}>{selectedPlan.status}</MnBadge>
            </div>
            {(waves ?? []).map((wave) => (
              <div key={wave.id} className="rounded-md border">
                <button onClick={() => toggleWave(wave.id)}
                  className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50">
                  <span className="text-sm font-medium">Wave {wave.index + 1}</span>
                  <div className="flex items-center gap-2">
                    <MnBadge tone={STATUS_TONE[wave.status] ?? 'neutral'}>{wave.status}</MnBadge>
                    <span className="text-xs text-muted-foreground">{wave.tasks.length} tasks</span>
                    <span className="text-xs">{expandedWaves.has(wave.id) ? '▼' : '▶'}</span>
                  </div>
                </button>
                {expandedWaves.has(wave.id) && (
                  <div className="border-t">
                    {wave.tasks.map((task) => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(waves ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No waves loaded</p>
            )}
          </div>
        </MnSectionCard>
      )}

      {staleTasks.length > 0 && (
        <MnSectionCard title="Reaper — Stale Tasks" collapsible defaultOpen>
          <div className="space-y-2 p-4">
            {staleTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
                <span className="text-sm">{t.name}</span>
                <MnBadge tone="danger">No assignee</MnBadge>
              </div>
            ))}
          </div>
        </MnSectionCard>
      )}

      <MnModal open={showCreate} onOpenChange={setShowCreate} title="Create Plan">
        <div className="space-y-4 p-4">
          <MnFormField label="Name" required>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="e.g. Q2 Migration" />
          </MnFormField>
          <MnFormField label="Description">
            <input type="text" value={formData.description ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-muted/30">
        <span className="text-xs">{open ? '▼' : '▶'}</span>
        <span className="flex-1 text-sm">{task.name}</span>
        <MnBadge tone={STATUS_TONE[task.status] ?? 'neutral'}>{task.status}</MnBadge>
        {task.assignee && <span className="text-xs text-muted-foreground">{task.assignee}</span>}
        {task.thor_validated && <MnBadge tone="success">Thor ✓</MnBadge>}
      </button>
      {open && (
        <div className="space-y-2 border-t bg-muted/20 px-6 py-3">
          <div className="text-xs"><strong>Assignee:</strong> {task.assignee ?? 'Unassigned'}</div>
          <div className="text-xs"><strong>Thor validated:</strong> {task.thor_validated ? 'Yes' : 'No'}</div>
          {task.evidence && task.evidence.length > 0 && (
            <div className="text-xs">
              <strong>Evidence ({task.evidence.length}):</strong>
              <ul className="mt-1 list-inside list-disc">
                {task.evidence.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
