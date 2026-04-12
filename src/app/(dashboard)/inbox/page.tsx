'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as extApi from '@/lib/api-ext';
import type { Notification, NotifySendInput } from '@/lib/types';
import { MnSectionCard } from '@/components/maranello/layout';
import {
  MnDataTable, type DataTableColumn, MnBadge,
} from '@/components/maranello/data-display';
import { MnDashboardStrip, type StripMetric } from '@/components/maranello';
import { MnModal, MnStateScaffold } from '@/components/maranello/feedback';
import { MnFormField } from '@/components/maranello/forms';
import { Bell, Send } from 'lucide-react';
import { useInboxLocale } from './inbox-i18n';

function statusTone(s: string): 'success' | 'warning' | 'danger' {
  switch (s) {
    case 'sent': return 'success';
    case 'pending': return 'warning';
    default: return 'danger';
  }
}

export default function InboxPage() {
  const t = useInboxLocale();
  const [showSend, setShowSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [formData, setFormData] = useState<NotifySendInput>({
    channel: '', subject: '', body: '',
  });

  const { data: queue, loading, error, refetch } = useApiQuery<Notification[]>(
    extApi.notifyQueue,
    { pollInterval: 5_000 },
  );

  const queueCols: DataTableColumn[] = useMemo(() => [
    { key: 'channel', label: t.channel, sortable: true },
    { key: 'subject', label: t.subject, sortable: true },
    { key: 'status', label: t.status, type: 'status' },
    { key: 'created_at', label: t.createdAt, sortable: true },
  ], [t]);

  const metrics: StripMetric[] = useMemo(() => {
    const items = queue ?? [];
    return [
      { label: t.totalPending, value: items.filter((n) => n.status === 'pending').length },
      { label: t.totalSent, value: items.filter((n) => n.status === 'sent').length },
      { label: t.totalFailed, value: items.filter((n) => n.status === 'failed').length },
    ];
  }, [queue, t]);

  const handleSend = useCallback(async () => {
    if (!formData.channel || !formData.subject || !formData.body) return;
    setSending(true);
    try {
      await extApi.notifySend(formData);
      setShowSend(false);
      setFormData({ channel: '', subject: '', body: '' });
      refetch();
    } finally {
      setSending(false);
    }
  }, [formData, refetch]);

  const handleTestTelegram = useCallback(async () => {
    setTesting(true);
    try {
      await extApi.notifyTelegramTest();
      refetch();
    } finally {
      setTesting(false);
    }
  }, [refetch]);

  if (loading) return <MnStateScaffold state="loading" message={t.loading} />;
  if (error) return <MnStateScaffold state="error" message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mn-text)' }}>{t.title}</h1>
          <Bell size={20} style={{ color: 'var(--mn-text-muted)' }} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleTestTelegram} disabled={testing}
            className="rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50"
            style={{ border: '1px solid var(--mn-border)', color: 'var(--mn-text)' }}>
            {testing ? t.testing : t.testTelegram}
          </button>
          <button onClick={() => setShowSend(true)}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
            <Send size={14} />
            {t.sendNotification}
          </button>
        </div>
      </div>

      <MnDashboardStrip metrics={metrics} />

      <MnSectionCard title={t.queue} badge={(queue ?? []).length} collapsible defaultOpen>
        <MnDataTable
          columns={queueCols}
          data={(queue ?? []).map((n) => ({
            ...n,
            status: n.status,
          })) as unknown as Record<string, unknown>[]}
          emptyMessage={t.noNotifications}
        />
      </MnSectionCard>

      <MnModal open={showSend} onOpenChange={setShowSend} title={t.sendNotification}>
        <div className="space-y-4 p-4">
          <MnFormField label={t.channel} required>
            <input type="text" value={formData.channel}
              onChange={(e) => setFormData((f) => ({ ...f, channel: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.channelPlaceholder} />
          </MnFormField>
          <MnFormField label={t.subject} required>
            <input type="text" value={formData.subject}
              onChange={(e) => setFormData((f) => ({ ...f, subject: e.target.value }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.subjectPlaceholder} />
          </MnFormField>
          <MnFormField label={t.body} required>
            <textarea value={formData.body}
              onChange={(e) => setFormData((f) => ({ ...f, body: e.target.value }))}
              className="h-24 w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.bodyPlaceholder} />
          </MnFormField>
          <MnFormField label={t.recipient}>
            <input type="text" value={formData.recipient ?? ''}
              onChange={(e) => setFormData((f) => ({ ...f, recipient: e.target.value || undefined }))}
              className="w-full rounded-md px-3 py-2 text-sm"
              style={{ background: 'var(--mn-surface-input)', border: '1px solid var(--mn-border)' }}
              placeholder={t.recipientPlaceholder} />
          </MnFormField>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowSend(false)}
              className="rounded-md px-4 py-2 text-sm"
              style={{ border: '1px solid var(--mn-border)' }}>
              {t.cancel}
            </button>
            <button onClick={handleSend} disabled={sending}
              className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}>
              {sending ? t.sending : t.send}
            </button>
          </div>
        </div>
      </MnModal>
    </div>
  );
}
