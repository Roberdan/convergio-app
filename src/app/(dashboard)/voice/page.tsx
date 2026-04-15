'use client';

import { useApiQuery } from '@/hooks/use-api-query';
import { health } from '@/lib/api';
import type { HealthResponse } from '@/lib/types';
import {
  MnSectionCard,
  MnBadge,
} from '@/components/maranello';
import { Mic } from 'lucide-react';

export default function VoicePage() {
  const { data, loading } = useApiQuery<HealthResponse>(health, { pollInterval: 10_000 });
  const daemonOnline = Boolean(data);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Mic className="h-5 w-5" /> Voice Pipeline
        </h1>
        <MnBadge tone={daemonOnline ? 'info' : loading ? 'info' : 'danger'}>
          {loading ? 'Loading' : daemonOnline ? 'Daemon Online' : 'Offline'}
        </MnBadge>
      </div>

      <MnSectionCard title="Voice Pipeline">
        <div className="space-y-2 p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
          <p>Voice input/output with TTS (Voxtral 4B) and STT for hands-free daemon interaction.</p>
          <p>Manage via CLI: <code style={{ color: 'var(--mn-accent)' }}>cvg voice start</code></p>
          <p className="mt-4" style={{ color: 'var(--mn-warning)' }}>
            A dedicated voice REST API is not yet exposed by the daemon.
            Voice management is currently CLI-only.
          </p>
        </div>
      </MnSectionCard>
    </div>
  );
}
