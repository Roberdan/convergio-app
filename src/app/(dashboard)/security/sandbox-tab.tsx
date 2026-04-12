'use client';

import { useState } from 'react';
import type { SandboxPolicy } from '@/lib/types';
import type { SecurityLocale } from './security-i18n';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnToggleSwitch } from '@/components/maranello/forms';

interface SandboxTabProps {
  policies: SandboxPolicy[];
  t: SecurityLocale;
  onSave: (policies: SandboxPolicy[]) => Promise<void>;
  saving: boolean;
}

export function SandboxTab({ policies, t, onSave, saving }: SandboxTabProps) {
  const [rows, setRows] = useState<SandboxPolicy[]>(policies);

  function toggle(id: string, checked: boolean) {
    setRows((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: checked } : p)));
  }

  return (
    <MnSectionCard title={t.sandboxPolicies} collapsible defaultOpen>
      <div className="space-y-3 p-4">
        {rows.length > 0 ? rows.map((policy) => (
          <div key={policy.id}
            className="flex items-center justify-between rounded-md border border-border px-4 py-3">
            <span className="text-sm font-medium">{policy.label}</span>
            <MnToggleSwitch
              checked={policy.enabled}
              onCheckedChange={(checked) => toggle(policy.id, checked)}
              size="md"
            />
          </div>
        )) : (
          <p className="text-sm text-muted-foreground">{t.noSandbox}</p>
        )}
      </div>
      <div className="flex justify-end px-4 py-3">
        <button type="button" disabled={saving} onClick={() => onSave(rows)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90">
          {t.save}
        </button>
      </div>
    </MnSectionCard>
  );
}
