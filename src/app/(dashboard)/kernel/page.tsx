'use client';

import { useMemo } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import { health } from '@/lib/api';
import type { HealthResponse } from '@/lib/types';
import {
  MnSectionCard,
  MnDashboardStrip,
  MnBadge,
} from '@/components/maranello';
import type { StripMetric } from '@/components/maranello';
import { Cpu } from 'lucide-react';

export default function KernelPage() {
  const { data, loading } = useApiQuery<HealthResponse>(health, { pollInterval: 10_000 });

  const daemonOnline = Boolean(data);

  const version = (data as unknown as Record<string, unknown>)?.version as string | undefined;

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Daemon', value: daemonOnline ? 'Online' : 'Offline' },
    { label: 'Version', value: version ?? '\u2014' },
  ], [daemonOnline, version]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Cpu className="h-5 w-5" /> Kernel (Jarvis)
        </h1>
        <MnBadge tone={daemonOnline ? 'success' : loading ? 'info' : 'danger'}>
          {loading ? 'Loading' : daemonOnline ? 'Online' : 'Offline'}
        </MnBadge>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Kernel status" />

      <MnSectionCard title="Kernel Details">
        <div className="space-y-2 p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
          <p>Local AI kernel manages inference routing, voice pipeline, and chat.</p>
          <p>Manage via CLI: <code style={{ color: 'var(--mn-accent)' }}>cvg kernel status</code>, <code style={{ color: 'var(--mn-accent)' }}>cvg chat</code></p>
          {!daemonOnline && !loading && (
            <p style={{ color: 'var(--mn-warning)' }}>
              Daemon not reachable on :8420. Kernel status requires a running daemon.
            </p>
          )}
        </div>
      </MnSectionCard>

      <MnSectionCard title="Capabilities">
        <div className="space-y-1 p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
          <p>A dedicated kernel REST API is not yet exposed by the daemon.</p>
          <p>Use the CLI for kernel operations: <code style={{ color: 'var(--mn-accent)' }}>cvg kernel status</code>, <code style={{ color: 'var(--mn-accent)' }}>cvg voice start</code></p>
        </div>
      </MnSectionCard>
    </div>
  );
}
