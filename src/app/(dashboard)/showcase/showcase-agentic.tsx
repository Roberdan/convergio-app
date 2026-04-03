'use client';

import {
  MnAugmentedBrain,
  MnBinnacle,
  MnChat,
  MnDashboardStrip,
  MnInstrumentBinnacle,
  MnOrgChart,
} from '@/components/maranello';
import {
  brainNodes,
  brainConnections,
  binnacleEntries,
  stripMetrics,
  orgTree,
} from './showcase-data';

/** Section: W4 Agentic & Intelligence components. */
export function ShowcaseAgentic() {
  return (
    <section aria-labelledby="section-agentic">
      <h2 id="section-agentic" className="text-lg font-semibold mb-4">
        W4 — Agentic & Intelligence
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard Strip */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnDashboardStrip</h3>
          <MnDashboardStrip metrics={stripMetrics} ariaLabel="Platform health metrics" />
        </div>

        {/* Augmented Brain */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnAugmentedBrain</h3>
          <MnAugmentedBrain
            nodes={brainNodes}
            connections={brainConnections}
            ariaLabel="Agent cognitive architecture"
          />
        </div>

        {/* Org Chart */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnOrgChart</h3>
          <MnOrgChart tree={orgTree} ariaLabel="Platform agent hierarchy" />
        </div>

        {/* Binnacle */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnBinnacle</h3>
          <MnBinnacle entries={binnacleEntries} ariaLabel="System event log" />
        </div>

        {/* Instrument Binnacle */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnInstrumentBinnacle</h3>
          <MnInstrumentBinnacle
            entries={binnacleEntries}
            metrics={stripMetrics.slice(0, 3)}
            ariaLabel="Combined instrument panel"
          />
        </div>

        {/* Chat */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnChat</h3>
          <div className="h-80">
            <MnChat
              messages={[
                { id: '1', role: 'user', content: 'Summarize the Q2 agent performance metrics.' },
                { id: '2', role: 'assistant', content: 'Here\'s the Q2 summary:\n\n**Total tasks completed:** 12,847\n**Average latency:** 230ms\n**Success rate:** 98.4%\n\nThe orchestrator routed 67% of requests to the primary model and 33% to the fallback.' },
                { id: '3', role: 'user', content: 'Which agents had the highest error rates?' },
              ]}
              quickActions={[
                { label: 'Show details', action: 'details' },
                { label: 'Export report', action: 'export' },
              ]}
              placeholder="Ask about agent performance..."
              onSend={() => {}}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
