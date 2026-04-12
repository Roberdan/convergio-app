'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { SecretRef } from '@/lib/types';
import type { SecurityLocale } from './security-i18n';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnModal } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { MnBadge } from '@/components/maranello/data-display';

interface SecretsTabProps {
  secrets: SecretRef[];
  t: SecurityLocale;
  onSave: (secrets: SecretRef[]) => Promise<void>;
  saving: boolean;
}

function emptySecret(): SecretRef {
  return { id: '', name: '', masked_value: '***', scope: 'global', created_at: new Date().toISOString() };
}

export function SecretsTab({ secrets, t, onSave, saving }: SecretsTabProps) {
  const [rows, setRows] = useState<SecretRef[]>(secrets);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; value: string; scope: string }>({
    name: '', value: '', scope: 'global',
  });

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function submitForm() {
    const newEntry: SecretRef = {
      id: crypto.randomUUID(),
      name: form.name,
      masked_value: '***',
      scope: form.scope,
      created_at: new Date().toISOString(),
    };
    setRows((prev) => [...prev, newEntry]);
    setForm({ name: '', value: '', scope: 'global' });
    setModalOpen(false);
  }

  return (
    <>
      <MnSectionCard title={t.secretsFilters} badge={rows.length} collapsible defaultOpen>
        <div className="flex justify-end px-4 pb-2 pt-1">
          <button type="button" onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus size={14} />
            {t.add}
          </button>
        </div>
        <div className="space-y-2 p-4">
          {rows.length > 0 ? rows.map((s) => (
            <div key={s.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{s.masked_value}</p>
                <p className="text-xs text-muted-foreground">{s.scope}</p>
              </div>
              <div className="flex items-center gap-2">
                <MnBadge tone="info">{s.scope}</MnBadge>
                <button type="button" aria-label={t.delete} onClick={() => removeRow(s.id)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">{t.noSecrets}</p>
          )}
        </div>
        <div className="flex justify-end px-4 py-3">
          <button type="button" disabled={saving} onClick={() => onSave(rows)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90">
            {t.save}
          </button>
        </div>
      </MnSectionCard>

      <MnModal open={modalOpen} onOpenChange={setModalOpen} title={t.addSecret} size="default">
        <div className="space-y-4">
          <MnFormField label={t.secretName} fieldId="secret-name">
            <input id="secret-name" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <MnFormField label={t.maskedValue} fieldId="secret-value">
            <input id="secret-value" type="password" value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              autoComplete="new-password" />
          </MnFormField>
          <MnFormField label={t.scope} fieldId="secret-scope">
            <input id="secret-scope" value={form.scope}
              onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
          </MnFormField>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted">{t.cancel}</button>
            <button type="button" onClick={submitForm} disabled={!form.name}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90">
              {t.add}
            </button>
          </div>
        </div>
      </MnModal>
    </>
  );
}
