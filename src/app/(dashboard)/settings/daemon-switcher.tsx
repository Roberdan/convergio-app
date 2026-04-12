'use client';

import { useCallback, useState } from 'react';
import { Plus, Trash2, Zap, Check, Loader2, Server } from 'lucide-react';
import { MnSectionCard } from '@/components/maranello/layout';
import { MnBadge } from '@/components/maranello/data-display';
import { useDaemonSwitcherLocale } from './daemon-switcher-i18n';

/* ---------- Types ---------- */

interface DaemonEntry {
  id: string;
  label: string;
  url: string;
}

interface ConnectionState {
  [id: string]: 'idle' | 'testing' | 'ok' | 'error';
}

/* ---------- localStorage helpers ---------- */

const STORAGE_KEY = 'cvg-daemon-connections';
const ACTIVE_KEY = 'cvg-active-daemon';

function loadDaemons(): DaemonEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DaemonEntry[]) : [];
  } catch {
    return [];
  }
}

function saveDaemons(list: DaemonEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function loadActive(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActive(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

/* ---------- Test connection ---------- */

async function testConnection(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------- Component ---------- */

export function DaemonSwitcher() {
  const t = useDaemonSwitcherLocale();
  const [daemons, setDaemons] = useState<DaemonEntry[]>(loadDaemons);
  const [activeId, setActiveId] = useState<string | null>(loadActive);
  const [connState, setConnState] = useState<ConnectionState>({});
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addError, setAddError] = useState('');

  const handleAdd = useCallback(async () => {
    setAddError('');
    const label = newLabel.trim();
    const url = newUrl.trim().replace(/\/$/, '');
    if (!label || !url) {
      setAddError(t.fillBoth);
      return;
    }
    const id = crypto.randomUUID();
    setConnState((p) => ({ ...p, [id]: 'testing' }));

    const ok = await testConnection(url);
    setConnState((p) => ({ ...p, [id]: ok ? 'ok' : 'error' }));
    if (!ok) {
      setAddError(t.connectionFailed);
      return;
    }

    const entry: DaemonEntry = { id, label, url };
    const next = [...daemons, entry];
    setDaemons(next);
    saveDaemons(next);
    setNewLabel('');
    setNewUrl('');
  }, [newLabel, newUrl, daemons, t]);

  const handleRemove = useCallback((id: string) => {
    const next = daemons.filter((d) => d.id !== id);
    setDaemons(next);
    saveDaemons(next);
    if (activeId === id) {
      setActiveId(null);
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, [daemons, activeId]);

  const handleActivate = useCallback((id: string) => {
    setActiveId(id);
    saveActive(id);
  }, []);

  const statusIcon = (id: string) => {
    const s = connState[id];
    if (s === 'testing') return <Loader2 size={14} className="animate-spin" style={{ color: 'var(--mn-info)' }} />;
    if (s === 'ok') return <Check size={14} style={{ color: 'var(--mn-success)' }} />;
    if (s === 'error') return <Zap size={14} style={{ color: 'var(--mn-error)' }} />;
    return null;
  };

  return (
    <MnSectionCard title={t.title} collapsible defaultOpen>
      <div className="space-y-4 p-4">
        {/* Existing daemons */}
        {daemons.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--mn-text-muted)' }}>{t.noDaemons}</p>
        )}
        {daemons.map((d) => (
          <div key={d.id} className="flex items-center justify-between gap-3 py-2"
            style={{ borderBottom: '1px solid var(--mn-border-subtle)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <Server size={14} style={{ color: 'var(--mn-text-muted)', flexShrink: 0 }} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--mn-text)' }}>{d.label}</p>
                <p className="text-xs font-mono truncate" style={{ color: 'var(--mn-text-muted)' }}>{d.url}</p>
              </div>
              {statusIcon(d.id)}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeId === d.id ? (
                <MnBadge tone="success">{t.active}</MnBadge>
              ) : (
                <button onClick={() => handleActivate(d.id)}
                  className="rounded px-2 py-1 text-xs font-medium transition-colors"
                  style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
                  {t.switchTo}
                </button>
              )}
              <button onClick={() => handleRemove(d.id)}
                className="rounded p-1 transition-colors"
                style={{ color: 'var(--mn-error)' }}
                aria-label={t.remove}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Add form */}
        <div className="pt-2 space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--mn-text)' }}>{t.addNew}</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t.labelPlaceholder}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 rounded-md px-2 py-1.5 text-sm"
              style={{
                background: 'var(--mn-surface-input)',
                border: '1px solid var(--mn-border)',
                color: 'var(--mn-text)',
              }}
            />
            <input
              type="url"
              placeholder={t.urlPlaceholder}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-[2] rounded-md px-2 py-1.5 text-sm font-mono"
              style={{
                background: 'var(--mn-surface-input)',
                border: '1px solid var(--mn-border)',
                color: 'var(--mn-text)',
              }}
            />
            <button onClick={handleAdd}
              className="rounded-md px-3 py-1.5 text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
              <Plus size={14} /> {t.add}
            </button>
          </div>
          {addError && (
            <p className="text-xs" style={{ color: 'var(--mn-error)' }}>{addError}</p>
          )}
        </div>
      </div>
    </MnSectionCard>
  );
}
