'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { TrustEntry } from '@/lib/types';
import type { SecurityLocale } from './security-i18n';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnDataTable, type DataTableColumn, MnBadge } from '@/components/maranello/data-display';
import { MnModal } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';

const TRUST_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  high: 'success', medium: 'warning', low: 'danger', untrusted: 'danger',
};

const LEVELS = ['high', 'medium', 'low', 'untrusted'] as const;

interface TrustTabProps {
  entries: TrustEntry[];
  t: SecurityLocale;
  onSave: (entries: TrustEntry[]) => Promise<void>;
  saving: boolean;
}

function emptyEntry(): TrustEntry {
  return { entity_id: '', entity_type: '', level: 'medium', trust_score: 0.5 };
}

export function TrustTab({ entries, t, onSave, saving }: TrustTabProps) {
  const [rows, setRows] = useState<TrustEntry[]>(entries);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TrustEntry | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<TrustEntry>(emptyEntry());

  const cols: DataTableColumn[] = [
    { key: 'entity_id', label: t.entityId, sortable: true },
    { key: 'entity_type', label: t.entityType, sortable: true },
    { key: 'trust_score', label: t.trustScore, sortable: true },
    { key: 'level', label: t.level },
    { key: '_actions', label: '' },
  ];

  function openAdd() {
    setEditing(null);
    setEditIdx(null);
    setForm(emptyEntry());
    setModalOpen(true);
  }

  function openEdit(row: TrustEntry, idx: number) {
    setEditing(row);
    setEditIdx(idx);
    setForm({ ...row });
    setModalOpen(true);
  }

  function removeRow(idx: number) {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }

  function submitForm() {
    if (editIdx !== null) {
      setRows((prev) => prev.map((r, i) => (i === editIdx ? form : r)));
    } else {
      setRows((prev) => [...prev, form]);
    }
    setModalOpen(false);
  }

  const tableData = rows.map((r, idx) => ({
    ...r,
    trust_score: (r.trust_score * 100).toFixed(0) + '%',
    level: <MnBadge tone={TRUST_TONE[r.level] ?? 'info'}>{r.level}</MnBadge>,
    _actions: (
      <span className="flex gap-2">
        <button type="button" aria-label={t.edit} onClick={() => openEdit(r, idx)}
          className="text-muted-foreground hover:text-foreground">
          <Pencil size={14} />
        </button>
        <button type="button" aria-label={t.remove} onClick={() => removeRow(idx)}
          className="text-muted-foreground hover:text-destructive">
          <Trash2 size={14} />
        </button>
      </span>
    ),
  })) as unknown as Record<string, unknown>[];

  return (
    <>
      <MnSectionCard title={t.trustLevels} badge={rows.length} collapsible defaultOpen>
        <div className="flex justify-end px-4 pb-2 pt-1">
          <button type="button" onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus size={14} />
            {t.add}
          </button>
        </div>
        <MnDataTable columns={cols} data={tableData} emptyMessage={t.noTrust} />
        <div className="flex justify-end px-4 py-3">
          <button type="button" disabled={saving} onClick={() => onSave(rows)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90">
            {t.save}
          </button>
        </div>
      </MnSectionCard>

      <MnModal open={modalOpen} onOpenChange={setModalOpen}
        title={editing ? t.editTrustEntry : t.addTrustEntry} size="default">
        <div className="space-y-4">
          <MnFormField label={t.entityId} fieldId="trust-entity-id">
            <input id="trust-entity-id" value={form.entity_id}
              onChange={(e) => setForm((f) => ({ ...f, entity_id: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.entityType} fieldId="trust-entity-type">
            <input id="trust-entity-type" value={form.entity_type}
              onChange={(e) => setForm((f) => ({ ...f, entity_type: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.level} fieldId="trust-level">
            <select id="trust-level" value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as TrustEntry['level'] }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm">
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </MnFormField>
          <MnFormField label={t.trustScore} fieldId="trust-score">
            <input id="trust-score" type="number" min="0" max="1" step="0.01"
              value={form.trust_score}
              onChange={(e) => setForm((f) => ({ ...f, trust_score: parseFloat(e.target.value) }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted">{t.cancel}</button>
            <button type="button" onClick={submitForm}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {t.save}
            </button>
          </div>
        </div>
      </MnModal>
    </>
  );
}
