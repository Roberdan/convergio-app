'use client';

import {
  MnHeatmap,
  MnBudgetTreemap,
  MnWaterfall,
  MnDecisionMatrix,
  MnPipelineRanking,
  MnActivityFeed,
  MnChart,
  MnFunnel,
  MnHbar,
  MnSpeedometer,
} from '@/components/maranello';
import {
  heatmapData,
  treemapItems,
  waterfallSteps,
  decisionCriteria,
  decisionOptions,
  pipelineStages,
  activityItems,
} from './showcase-data';

/** Section: W0 + W2 Data Visualization components. */
export function ShowcaseDataViz() {
  return (
    <section aria-labelledby="section-dataviz">
      <h2 id="section-dataviz" className="text-lg font-semibold mb-4">
        W0 + W2 — Data Visualization
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart — Area */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnChart (area)</h3>
          <MnChart
            type="area"
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            series={[
              { label: 'Requests', data: [1200, 1900, 1500, 2100, 2400, 2800] },
              { label: 'Completions', data: [1100, 1700, 1400, 1950, 2300, 2650] },
            ]}
            showLegend
          />
        </div>

        {/* Chart — Donut */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnChart (donut)</h3>
          <MnChart
            type="donut"
            segments={[
              { label: 'GPT-4o', value: 42 },
              { label: 'Claude 3.5', value: 31 },
              { label: 'Gemini Pro', value: 18 },
              { label: 'Local LLM', value: 9 },
            ]}
            showLegend
          />
        </div>

        {/* Funnel */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnFunnel</h3>
          <MnFunnel
            data={{
              pipeline: [
                { label: 'Leads', count: 2400, color: '#4EA8DE' },
                { label: 'Qualified', count: 1680, color: '#48BFE3' },
                { label: 'Proposal', count: 840, color: '#56CFE1' },
                { label: 'Negotiation', count: 420, color: '#64DFDF' },
                { label: 'Closed Won', count: 252, color: '#72EFDD' },
              ],
            }}
          />
        </div>

        {/* Horizontal Bar */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnHbar</h3>
          <MnHbar
            title="Model latency (p95)"
            unit="ms"
            maxValue={500}
            bars={[
              { label: 'GPT-4o', value: 320, color: '#4EA8DE' },
              { label: 'Claude 3.5', value: 280, color: '#48BFE3' },
              { label: 'Gemini', value: 410, color: '#56CFE1' },
              { label: 'Llama 3', value: 180, color: '#64DFDF' },
              { label: 'Mistral', value: 150, color: '#72EFDD' },
            ]}
          />
        </div>

        {/* Speedometer */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnSpeedometer</h3>
          <div className="flex justify-center">
            <MnSpeedometer value={187} min={0} max={300} unit="req/s" size="md" />
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnHeatmap</h3>
          <MnHeatmap data={heatmapData} showValues ariaLabel="Weekly agent activity heatmap" />
        </div>

        {/* Budget Treemap */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnBudgetTreemap</h3>
          <MnBudgetTreemap items={treemapItems} ariaLabel="Department budget allocation" />
        </div>

        {/* Waterfall */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnWaterfall</h3>
          <MnWaterfall steps={waterfallSteps} ariaLabel="Quarterly financial waterfall" />
        </div>

        {/* Pipeline Ranking */}
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">MnPipelineRanking</h3>
          <MnPipelineRanking stages={pipelineStages} ariaLabel="Client acquisition funnel" />
        </div>

        {/* Decision Matrix */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnDecisionMatrix</h3>
          <MnDecisionMatrix
            criteria={decisionCriteria}
            options={decisionOptions}
            ariaLabel="LLM provider evaluation"
          />
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg border p-4 space-y-3 md:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground">MnActivityFeed</h3>
          <MnActivityFeed items={activityItems} refreshInterval={0} ariaLabel="Platform activity log" />
        </div>
      </div>
    </section>
  );
}
