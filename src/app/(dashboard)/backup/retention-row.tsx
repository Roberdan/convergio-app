'use client';

import { useState, useCallback } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { toast } from '@/components/maranello/feedback';
import * as extApi from '@/lib/api-ext';
import type { RetentionRule } from '@/lib/types';
import type { BackupLocale } from './backup-i18n';

interface RetentionRowProps {
  rule: RetentionRule;
  t: BackupLocale;
  onUpdated: () => void;
}

export function RetentionRow({ rule, t, onUpdated }: RetentionRowProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keepCount, setKeepCount] = useState(String(rule.keep_count));
  const [maxAgeDays, setMaxAgeDays] = useState(String(rule.max_age_days));
  const [enabled, setEnabled] = useState(rule.enabled);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await extApi.backupRetentionUpdate(rule.id, {
        keep_count: Number(keepCount),
        max_age_days: Number(maxAgeDays),
        enabled,
      });
      toast.success(t.saveOk);
      setEditing(false);
      onUpdated();
    } catch {
      toast.error(t.saveFail);
    } finally {
      setSaving(false);
    }
  }, [rule.id, keepCount, maxAgeDays, enabled, t, onUpdated]);

  const handleCancel = useCallback(() => {
    setKeepCount(String(rule.keep_count));
    setMaxAgeDays(String(rule.max_age_days));
    setEnabled(rule.enabled);
    setEditing(false);
  }, [rule]);

  const inputCls = "w-20 rounded border px-2 py-1 text-sm"
    + " bg-[var(--mn-surface-input)] border-[var(--mn-border)]"
    + " text-[var(--mn-text)] focus:outline-none focus:border-[var(--mn-border-focus)]";

  return (
    <tr style={{ borderBottom: '1px solid var(--mn-border-subtle)' }}>
      <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text)' }}>{rule.name}</td>
      <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text)' }}>
        {editing
          ? <input type="number" min={1} value={keepCount} onChange={(e) => setKeepCount(e.target.value)} className={inputCls} />
          : rule.keep_count}
      </td>
      <td className="px-3 py-2 text-sm" style={{ color: 'var(--mn-text)' }}>
        {editing
          ? <input type="number" min={0} value={maxAgeDays} onChange={(e) => setMaxAgeDays(e.target.value)} className={inputCls} />
          : rule.max_age_days}
      </td>
      <td className="px-3 py-2 text-sm">
        {editing
          ? (
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
          )
          : (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                background: rule.enabled ? 'var(--mn-success-bg)' : 'var(--mn-surface-sunken)',
                color: rule.enabled ? 'var(--mn-success)' : 'var(--mn-text-muted)',
              }}
            >
              {rule.enabled ? 'active' : 'inactive'}
            </span>
          )}
      </td>
      <td className="px-3 py-2">
        {editing ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
              aria-label={t.saveRule}
            >
              <Check size={12} />
              {saving ? t.saving : t.saveRule}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-surface-sunken)', color: 'var(--mn-text-muted)' }}
              aria-label={t.cancel}
            >
              <X size={12} />
              {t.cancel}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium"
            style={{ background: 'var(--mn-surface-sunken)', color: 'var(--mn-text-muted)' }}
            aria-label={t.editRule}
          >
            <Pencil size={12} />
            {t.editRule}
          </button>
        )}
      </td>
    </tr>
  );
}
