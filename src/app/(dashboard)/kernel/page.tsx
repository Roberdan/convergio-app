'use client';

import { useMemo } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import {
  MnSectionCard,
  MnDashboardStrip,
  MnBadge,
} from '@/components/maranello';
import type { StripMetric } from '@/components/maranello';
import { Cpu } from 'lucide-react';

interface KernelStatus {
  status: string;
  model: string;
  backend: string;
  uptime_secs: number;
  requests_total: number;
  avg_latency_ms: number;
}

export default function KernelPage() {
  const { data, loading } = useApiQuery<KernelStatus>(api.kernelStatus as () => Promise<KernelStatus>, { pollInterval: 10_000 });

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Status', value: data?.status ?? 'unknown' },
    { label: 'Model', value: data?.model ?? '\u2014' },
    { label: 'Backend', value: data?.backend ?? '\u2014' },
    { label: 'Requests', value: data?.requests_total ?? 0 },
    { label: 'Avg Latency', value: data?.avg_latency_ms ? `${data.avg_latency_ms}ms` : '\u2014' },
  ], [data]);

  const uptimeHours = data?.uptime_secs ? (data.uptime_secs / 3600).toFixed(1) : '\u2014';

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Cpu className="h-5 w-5" /> Kernel (Jarvis)
        </h1>
        <MnBadge tone={data?.status === 'running' ? 'success' : loading ? 'info' : 'danger'}>
          {loading ? 'Loading' : data?.status ?? 'Offline'}
        </MnBadge>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Kernel status" />

      <MnSectionCard title="Details">
        <div className="p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
          <p>Uptime: {uptimeHours} hours</p>
          <p>Local AI kernel manages inference, voice, and chat routing.</p>
          {!data && !loading && (
            <p className="mt-2" style={{ color: 'var(--mn-warning)' }}>
              Kernel not reachable. Start it with <code>cvg kernel start</code>.
            </p>
          )}
        </div>
      </MnSectionCard>
    </div>
  );
}
