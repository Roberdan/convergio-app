'use client';

import { useMemo, useCallback, useState } from 'react';
import { useApiQuery } from '@/hooks/use-api-query';
import * as api from '@/lib/api';
import {
  MnSectionCard,
  MnDashboardStrip,
  MnBadge,
} from '@/components/maranello';
import type { StripMetric } from '@/components/maranello';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceStatus {
  pipeline: string;
  tts_model: string;
  stt_model: string;
  active: boolean;
  sessions_today: number;
}

export default function VoicePage() {
  const [starting, setStarting] = useState(false);
  const { data, loading, refetch } = useApiQuery<VoiceStatus>(api.voiceStatus as () => Promise<VoiceStatus>, { pollInterval: 10_000 });

  const metrics = useMemo<StripMetric[]>(() => [
    { label: 'Pipeline', value: data?.pipeline ?? 'stopped' },
    { label: 'TTS Model', value: data?.tts_model ?? '\u2014' },
    { label: 'STT Model', value: data?.stt_model ?? '\u2014' },
    { label: 'Sessions Today', value: data?.sessions_today ?? 0 },
  ], [data]);

  const startVoice = useCallback(async () => {
    setStarting(true);
    try { await api.voiceStart(); refetch(); } finally { setStarting(false); }
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold" style={{ color: 'var(--mn-text)' }}>
          <Mic className="h-5 w-5" /> Voice
        </h1>
        <div className="flex items-center gap-2">
          {!data?.active && (
            <button
              onClick={startVoice}
              disabled={starting}
              className={cn('rounded-md px-4 py-2 text-sm font-medium transition-colors')}
              style={{ background: 'var(--mn-accent)', color: 'var(--mn-accent-text)' }}
            >
              {starting ? 'Starting\u2026' : 'Start Voice'}
            </button>
          )}
          <MnBadge tone={data?.active ? 'success' : loading ? 'info' : 'warning'}>
            {loading ? 'Loading' : data?.active ? 'Active' : 'Stopped'}
          </MnBadge>
        </div>
      </div>

      <MnDashboardStrip metrics={metrics} ariaLabel="Voice pipeline status" />

      <MnSectionCard title="Voice Pipeline">
        <div className="p-4 text-sm" style={{ color: 'var(--mn-text-muted)' }}>
          <p>Voice input/output pipeline with TTS and STT.</p>
          {!data && !loading && (
            <p className="mt-2" style={{ color: 'var(--mn-warning)' }}>
              Voice pipeline not active. Start it with <code>cvg voice start</code>.
            </p>
          )}
        </div>
      </MnSectionCard>
    </div>
  );
}
