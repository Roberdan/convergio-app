'use client';

import {
  MnBadge,
  MnSpinner,
  MnProgressRing,
  MnGauge,
  MnFlipCounter,
  MnToggleSwitch,
} from '@/components/maranello';
import { useState } from 'react';

/** Quick preview strip showing a few key components on the landing page. */
export function ShowcaseLandingClient() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Badge</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          <MnBadge tone="neutral">Default</MnBadge>
          <MnBadge tone="success">Active</MnBadge>
          <MnBadge tone="danger">Error</MnBadge>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Spinner</p>
        <div className="flex gap-2">
          <MnSpinner size="sm" variant="primary" label="Loading" />
          <MnSpinner size="md" variant="muted" label="Loading" />
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Progress Ring</p>
        <MnProgressRing value={87} size="md" variant="primary" label="Score" />
      </div>

      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Gauge</p>
        <MnGauge value={72} min={0} max={100} label="CPU" size="sm" />
      </div>

      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Flip Counter</p>
        <MnFlipCounter value={1847} digits={5} size="sm" label="Tasks" />
      </div>

      <div className="rounded-lg border bg-card p-4 flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">Toggle</p>
        <MnToggleSwitch
          checked={toggle}
          onCheckedChange={setToggle}
          label="Auto-deploy"
          size="sm"
        />
      </div>
    </div>
  );
}
