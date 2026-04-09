'use client';

import { cn } from '@/lib/utils';
import { useLocale } from '@/lib/i18n';
import { MnBinnacle } from './mn-binnacle';
import { MnDashboardStrip } from '../layout/mn-dashboard-strip';

import type { BinnacleEntry } from './mn-binnacle';
import type { StripMetric } from '../layout/mn-dashboard-strip';

export interface MnInstrumentBinnacleProps {
  entries: BinnacleEntry[];
  metrics: StripMetric[];
  /** Max log entries to display. Default: 50 */
  maxVisible?: number;
  ariaLabel?: string;
  className?: string;
}

/**
 * Combined instrument panel: metrics strip + event log.
 *
 * Composes MnDashboardStrip (top) and MnBinnacle (bottom)
 * in a unified view for operational dashboards.
 */
export function MnInstrumentBinnacle({
  entries,
  metrics,
  maxVisible = 50,
  ariaLabel = 'Instrument panel',
  className,
}: MnInstrumentBinnacleProps) {
  const t = useLocale("instrumentBinnacle");

  return (
    <div
      className={cn('space-y-3', className)}
      role="region"
      aria-label={ariaLabel}
    >
      <MnDashboardStrip
        metrics={metrics}
        ariaLabel={t.keyMetrics}
      />
      <MnBinnacle
        entries={entries}
        maxVisible={maxVisible}
        ariaLabel={t.eventLog}
      />
    </div>
  );
}
