/**
 * i18n type definitions — Agentic, Network, Ops, Strategy, Financial, Pages namespaces.
 * Split from types.ts to stay under 300 lines.
 */

/* ── Agentic ── */

export interface ActiveMissionsLabels {
  noActiveMissions: string;
}

export interface AgentTraceLabels {
  input: string;
  output: string;
  noTraceSteps: string;
  actorLabel: string;
  handoff: string;
  legend: string;
}

export interface ApprovalChainLabels {
  approvalChain: string;
}

export interface AugmentedBrainLabels {
  nodeTypeLegend: string;
}

export interface AugmentedBrainV2Labels {
  pauseAnimation: string;
  playAnimation: string;
}

export interface ChatLabels {
  code: string;
  copied: string;
  copy: string;
  stopListening: string;
  processingSpeech: string;
  voiceError: string;
  startVoiceInput: string;
  thinking: string;
  voiceInput: string;
  sendMessage: string;
}

export interface HubSpokeLabels {
  networkNodes: string;
  hub: string;
  active: string;
}

export interface NeuralNodesLabels {
  neuralNodesVisualization: string;
}

export interface ProcessTimelineLabels {
  defaultAriaLabel: string;
  stepStatus: string;
  duration: string;
  noSteps: string;
}

/* ── Network ── */

export interface DeploymentTableLabels {
  noDeployments: string;
  hash: string;
}

export interface MapLabels {
  marker: string;
  interactiveMap: string;
}

export interface MeshNetworkCanvasLabels {
  meshNodes: string;
}

export interface MeshNetworkCardLabels {
  sync: string;
  push: string;
  toggle: string;
}

export interface MeshNetworkToolbarLabels {
  meshNetwork: string;
  syncLabel: string;
  drift: string;
  addPeer: string;
  discover: string;
  fullSync: string;
  pushLabel: string;
  online: string;
}

export interface MeshNetworkLabels {
  noMeshNodes: string;
  meshNodes: string;
}

export interface NetworkMessagesLabels {
  networkMessageFlow: string;
}

export interface OrgChartLabels {
  active: string;
  inactive: string;
  busy: string;
  error: string;
  collapse: string;
  expand: string;
  organizationChart: string;
}

export interface SocialGraphLabels {
  graphNodes: string;
}

export interface SystemStatusLabels {
  systemStatus: string;
  refreshStatus: string;
  noServices: string;
  recentIncidents: string;
}

/* ── Ops ── */

export interface AuditLogLabels {
  noAuditEntries: string;
  filterAuditLog: string;
  filterPlaceholder: string;
  entries: string;
  loadMore: string;
}

export interface BinnacleLabels {
  noLogEntries: string;
  entries: string;
  filter: string;
  filterBySeverity: string;
}

export interface EntityWorkbenchLabels {
  unsavedChanges: string;
  newTab: string;
  noEntitiesOpen: string;
  save: string;
}

export interface FacetWorkbenchLabels {
  clear: string;
  clearAll: string;
  activeFilter: string;
  activeFilters: string;
}

export interface GanttLabels {
  today: string;
  zoomIn: string;
  zoomOut: string;
  fitTimeline: string;
  ganttTimeline: string;
  todayMarker: string;
  task: string;
  expand: string;
  collapse: string;
}

export interface KanbanBoardLabels {
  kanbanBoard: string;
  addCard: string;
}

export interface NightJobsLabels {
  noScheduledJobs: string;
  schedule: string;
  lastRun: string;
  nextRun: string;
}

export interface InstrumentBinnacleLabels {
  instrumentPanel: string;
  keyMetrics: string;
  eventLog: string;
}

/* ── Strategy ── */

export interface BusinessModelCanvasLabels {
  enterItem: string;
  confirm: string;
  businessModelCanvas: string;
}

export interface CustomerJourneyMapLabels {
  noTouchpoints: string;
}

export interface CustomerJourneyLabels {
  customerJourney: string;
}

export interface DecisionMatrixLabels {
  option: string;
  total: string;
  winner: string;
  best: string;
}

export interface OkrLabels {
  noObjectives: string;
}

export interface RiskMatrixLabels {
  impact: string;
  probability: string;
  critical: string;
}

export interface StrategyCanvasLabels {
  newItem: string;
  cancel: string;
  add: string;
}

export interface SwotLabels {
  noItems: string;
}

export interface NineBoxMatrixLabels {
  performance: string;
  potential: string;
  low: string;
  medium: string;
  high: string;
}

export interface PorterFiveForcesLabels {
  low: string;
  medium: string;
  high: string;
  porterFiveForces: string;
}

/* ── Financial ── */

export interface AgentCostBreakdownLabels {
  agentCostBreakdown: string;
  agentCostBreakdownAria: string;
  total: string;
  agentsTotalCost: string;
}

export interface FinOpsLabels {
  actual: string;
  budget: string;
}

/* ── Error Pages ── */

export interface ErrorPageLabels {
  somethingWentWrong: string;
  unexpectedError: string;
  sectionError: string;
  tryAgain: string;
  goToDashboard: string;
}

export interface NotFoundLabels {
  pageNotFound: string;
  pageNotFoundDescription: string;
  backToDashboard: string;
}

/* ── Login Page ── */

export interface LoginPageLabels {
  signIn: string;
  enterCredentials: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signInButton: string;
  noAccount: string;
}

/* ── UI Primitives ── */

export interface DialogLabels {
  close: string;
}

export interface SheetLabels {
  close: string;
}
