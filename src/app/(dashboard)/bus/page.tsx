'use client';

import { useMemo, useState, useCallback } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import { useSse } from '@/hooks/use-sse';
import * as api from '@/lib/api';
import {
  MnSectionCard,
  MnDashboardStrip,
  MnActivityFeed,
} from '@/components/maranello';
import type { StripMetric, ActivityItem } from '@/components/maranello';
import { Radio } from 'lucide-react';
import type { IpcEvent } from '@/lib/types';

interface BusStats {
  messages_total: number;
  messages_per_minute: number;
  active_channels: number;
  subscribers: number;
}

export default function BusPage() {
  const [events, setEvents] = useState<IpcEvent[]>([]);

  const onMessage = useCallback((event: IpcEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 100));
  }, []);

  const { connected } = useSse({ onMessage });
  const { data } = useApiQuery<BusStats>(api.busStats as () => Promise<BusStats>, { pollInterval: 10_000 });

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Total Messages', value: data?.messages_total ?? events.length },
    { label: 'Msg/min', value: data?.messages_per_minute ?? 0, trend: 'up' as const },
    { label: 'Channels', value: data?.active_channels ?? 0 },
    { label: 'Subscribers', value: data?.subscribers ?? 0 },
  ], [data, events.length]);

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
          <Radio className="h-5 w-5" /> Message Bus
        </h1>
        <span className="text-sm" style={{ color: connected ? 'var(--mn-success)' : 'var(--mn-error)' }}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Message bus stats" />

      <MnSectionCard title="Live Messages" collapsible defaultOpen>
        <div className="max-h-96 overflow-y-auto">
          <MnActivityFeed items={activityItems} ariaLabel="Bus message stream" />
        </div>
        {events.length === 0 && (
          <div className="p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
            No messages yet. Events will appear here in real-time when the daemon is running.
          </div>
        )}
      </MnSectionCard>
    </div>
  );
}
