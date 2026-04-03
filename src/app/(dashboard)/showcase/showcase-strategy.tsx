'use client';

import {
  MnStrategyCanvas,
  MnSwot,
  MnPorterFiveForces,
  MnCustomerJourneyMap,
  MnBcgMatrix,
  MnBusinessModelCanvas,
  MnNineBoxMatrix,
  MnRiskMatrix,
  MnCustomerJourney,
  MnOkr,
} from '@/components/maranello';
import type { Objective } from '@/components/maranello';
import type { JourneyPhase } from '@/components/maranello/strategy/mn-customer-journey';
import {
  strategyCanvasSegments,
  swotData,
  porterForces,
  journeyStages,
  bcgItems,
  bmcBlocks,
  nineBoxItems,
  riskItems,
} from './showcase-strategy-data';

const customerPhases: JourneyPhase[] = [
  {
    id: 'discover', label: 'Discovery',
    engagements: [
      { id: 'e1', title: 'Inbound demo request', status: 'completed', type: 'opportunity', assignee: 'Sarah Chen', date: '2025-06-01' },
      { id: 'e2', title: 'Technical deep-dive call', status: 'completed', type: 'meeting', assignee: 'Marco Silva', date: '2025-06-05' },
    ],
  },
  {
    id: 'evaluate', label: 'Evaluation',
    engagements: [
      { id: 'e3', title: 'POC environment setup', status: 'active', type: 'task', assignee: 'Arjun Patel', date: '2025-06-12' },
      { id: 'e4', title: 'Security review', status: 'pending', type: 'ticket', date: '2025-06-18' },
    ],
  },
  {
    id: 'close', label: 'Close',
    engagements: [
      { id: 'e5', title: 'Enterprise contract negotiation', status: 'pending', type: 'contract', assignee: 'Elena Vasquez', date: '2025-07-01' },
    ],
  },
];

const okrObjectives: Objective[] = [
  {
    id: 'o1', title: 'Scale mesh network to 50 nodes', status: 'on-track',
    keyResults: [
      { id: 'kr1', title: 'Deploy nodes in 3 new regions', current: 2, target: 3 },
      { id: 'kr2', title: 'Achieve 99.95% uptime SLA', current: 99.92, target: 99.95, unit: '%' },
      { id: 'kr3', title: 'Reduce inter-node latency to <50ms', current: 62, target: 50, unit: 'ms' },
    ],
  },
  {
    id: 'o2', title: 'Improve agent task completion rate',
    keyResults: [
      { id: 'kr4', title: 'Increase success rate', current: 94, target: 98, unit: '%' },
      { id: 'kr5', title: 'Reduce average resolution time', current: 45, target: 30, unit: 's' },
    ],
  },
];

/** Section: W5 Strategy & Business Frameworks. */
export function ShowcaseStrategy() {
  return (
    <section aria-labelledby="section-strategy">
      <h2 id="section-strategy" className="text-lg font-semibold mb-4">
        W5 — Strategy & Business Frameworks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strategy Canvas */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnStrategyCanvas</h3>
          <MnStrategyCanvas segments={strategyCanvasSegments} ariaLabel="Platform strategy canvas" />
        </div>

        {/* SWOT Analysis */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnSwot</h3>
          <MnSwot
            strengths={swotData.strengths}
            weaknesses={swotData.weaknesses}
            opportunities={swotData.opportunities}
            threats={swotData.threats}
            ariaLabel="Convergio SWOT analysis"
          />
        </div>

        {/* Porter's Five Forces */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnPorterFiveForces</h3>
          <MnPorterFiveForces forces={porterForces} ariaLabel="AI ops market forces" />
        </div>

        {/* Customer Journey Map */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnCustomerJourneyMap</h3>
          <MnCustomerJourneyMap stages={journeyStages} ariaLabel="Enterprise client journey" />
        </div>

        {/* BCG Matrix */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnBcgMatrix</h3>
          <MnBcgMatrix items={bcgItems} height={280} />
        </div>

        {/* Nine Box Matrix */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnNineBoxMatrix</h3>
          <MnNineBoxMatrix
            items={nineBoxItems}
            xLabel="Performance"
            yLabel="Potential"
          />
        </div>

        {/* Risk Matrix */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnRiskMatrix</h3>
          <MnRiskMatrix items={riskItems} ariaLabel="Platform risk assessment" />
        </div>

        {/* Business Model Canvas */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnBusinessModelCanvas</h3>
          <MnBusinessModelCanvas blocks={bmcBlocks} editable={false} />
        </div>

        {/* Customer Journey */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnCustomerJourney</h3>
          <MnCustomerJourney phases={customerPhases} orientation="horizontal" />
        </div>

        {/* OKR Dashboard */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnOkr</h3>
          <MnOkr objectives={okrObjectives} title="Q3 2025 Objectives" period="Q3 2025" />
        </div>
      </div>
    </section>
  );
}
