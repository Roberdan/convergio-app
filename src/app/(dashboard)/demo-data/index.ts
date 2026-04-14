/**
 * Demo seed data — used by dashboard when no daemon is connected.
 * Split into domain files for maintainability.
 */
export {
  stepperSteps, heatmapData, treemapItems, waterfallSteps,
  decisionCriteria, decisionOptions, pipelineStages, activityItems,
  meshNodes, meshEdges, hubSpokeHub, hubSpokeSpokes,
  deployments, auditEntries, missions, nightJobs,
} from './viz';

export {
  brainNodes, brainConnections, binnacleEntries, stripMetrics, orgTree,
  brain3DNodes, brain3DEdges,
  brainV2Nodes, brainV2Synapses, brainV2Stats,
} from './agentic';
