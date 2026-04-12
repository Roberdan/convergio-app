import type {
  ChartLabels, CohortGridLabels, CostTimelineLabels, FunnelLabels,
  HbarLabels, PipelineRankingLabels, WaterfallLabels,
} from "../types";

export const chartDefaults: ChartLabels = {
  segment: "Segment",
  value: "Value",
  x: "X",
  y: "Y",
  size: "Size",
};

export const cohortGridDefaults: CohortGridLabels = {
  cohortRetentionGrid: "Cohort retention grid",
  cohort: "Cohort",
};

export const costTimelineDefaults: CostTimelineLabels = {
  costTimeline: "Cost timeline",
  period: "Period",
};

export const funnelDefaults: FunnelLabels = {
  pipelineFunnel: "Pipeline funnel",
  noStages: "No pipeline stages available.",
  onHold: "On Hold:",
  withdrawn: "Withdrawn:",
};

export const hbarDefaults: HbarLabels = {
  horizontalBarChart: "Horizontal bar chart",
};

export const pipelineRankingDefaults: PipelineRankingLabels = {
  conversion: "% conversion",
};

export const waterfallDefaults: WaterfallLabels = {
  waterfallChart: "Waterfall chart",
};
