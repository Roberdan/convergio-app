'use client';

import { useMemo, useState, useCallback } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import { useSse } from '@/hooks/use-sse';
import { ipcChannels, ipcMessages } from '@/lib/api-ext';
import {
  MnSectionCard,
  MnDashboardStrip,
  MnDataTable,
  MnActivityFeed,
  MnBadge,
} from '@/components/maranello';
import type { StripMetric, ActivityItem, DataTableColumn } from '@/components/maranello';
import { Radio } from 'lucide-react';
import type { IpcEvent } from '@/lib/types';

interface IpcChannel {
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface IpcMessage {
  id: number;
  channel: string;
  sender: string;
  content: string;
  ts: string;
}

const CHANNEL_COLS: DataTableColumn[] = [
  { key: 'name', label: 'Channel', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'created_by', label: 'Created By' },
];

export default function BusPage() {
  const [events, setEvents] = useState<IpcEvent[]>([]);

  const onMessage = useCallback((event: IpcEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 100));
  }, []);

  const { connected } = useSse({ onMessage });
  const { data: channels, loading: lCh } = useApiQuery<IpcChannel[]>(ipcChannels as () => Promise<IpcChannel[]>, { pollInterval: 30_000 });
  const { data: messages } = useApiQuery<IpcMessage[]>(ipcMessages as () => Promise<IpcMessage[]>, { pollInterval: 10_000 });

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Channels', value: channels?.length ?? 0 },
    { label: 'Stored Messages', value: messages?.length ?? 0 },
    { label: 'Live Events', value: events.length },
  ], [channels?.length, messages?.length, events.length]);

  const activityItems = useMemo<ActivityItem[]>(() =>
    events.map((e) => ({
      agent: e.from,
      action: e.event_type,
      target: e.to ?? '',
      timestamp: e.ts,
      priority: 'normal' as const,
    })),
  [events]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Radio className="h-5 w-5" /> Message Bus (IPC)
        </h1>
        <MnBadge tone={connected ? 'success' : 'danger'}>
          {connected ? 'SSE Connected' : 'Disconnected'}
        </MnBadge>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Message bus stats" />

      <MnSectionCard title={`Channels (${channels?.length ?? 0})`} collapsible defaultOpen>
        <MnDataTable
          columns={CHANNEL_COLS}
          data={(channels ?? []) as unknown as Record<string, unknown>[]}
          loading={lCh}
          emptyMessage="No channels"
        />
      </MnSectionCard>

      <MnSectionCard title="Live Events" collapsible defaultOpen>
        <div className="max-h-96 overflow-y-auto">
          <MnActivityFeed items={activityItems} ariaLabel="Bus message stream" />
        </div>
        {events.length === 0 && (
          <div className="p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
            No live events yet. Events appear here in real-time via SSE.
          </div>
        )}
      </MnSectionCard>
    </div>
  );
}
