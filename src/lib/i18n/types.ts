/**
 * i18n type definitions — one interface per component namespace.
 * Each interface maps string keys to their English default values.
 * Apps override via MnLocaleProvider or YAML locale: section.
 */

/* ── Shell ── */

export interface ShellLabels {
  skipToContent: string;
  dashboard: string;
  brandFallback: string;
}

export interface HeaderLabels {
  toggleMenu: string;
  breadcrumb: string;
  notifications: string;
}

export interface SearchComboboxLabels {
  placeholder: string;
  searchPlaceholder: string;
  searchResults: string;
  components: string;
  navigation: string;
  categories: string;
  theme: string;
  noResults: string;
  home: string;
  light: string;
  dark: string;
  navy: string;
  colorblind: string;
}

export interface SidebarLabels {
  support: string;
  expandSidebar: string;
  collapseSidebar: string;
  brandFallback: string;
}

/* ── Theme ── */

export interface A11yFabLabels {
  accessibilitySettings: string;
  accessibility: string;
  textSize: string;
  lineSpacing: string;
  dyslexicFont: string;
  reducedMotion: string;
  highContrast: string;
  focusIndicators: string;
  resetToDefaults: string;
  fontSizeLabels: Record<string, string>;
  lineSpacingLabels: Record<string, string>;
}

export interface A11yLabels {
  displaySettings: string;
  accessibilitySettings: string;
  display: string;
  textSize: string;
  reducedMotion: string;
  highContrast: string;
  focusIndicators: string;
  resetToDefaults: string;
}

export interface ThemeToggleLabels {
  light: string;
  dark: string;
  navy: string;
  colorblind: string;
  switchTheme: string;
}

export interface ThemeRotaryLabels {
  themeSelector: string;
}

export interface FerrariControlLabels {
  manettinoSelector: string;
  cruiseLever: string;
  toggleLever: string;
  steppedRotary: string;
  on: string;
  off: string;
}

/* ── Data Display ── */

export interface DataTableLabels {
  loading: string;
  dataTable: string;
  selectAllRows: string;
  filterPlaceholder: string;
  tablePagination: string;
  previousPage: string;
  nextPage: string;
  rows: string;
}

export interface DetailPanelLabels {
  selectPlaceholder: string;
  edit: string;
  cancel: string;
  save: string;
  close: string;
}

export interface UserTableLabels {
  loading: string;
  searchPlaceholder: string;
  userTable: string;
  selectAllUsers: string;
  user: string;
  status: string;
  role: string;
  teams: string;
  lastActive: string;
  actions: string;
  users: string;
}

export interface SourceCardsLabels {
  noSources: string;
  show: string;
  more: string;
}

export interface TokenMeterLabels {
  tokenBreakdown: string;
}

export interface KpiScorecardLabels {
  kpiScorecard: string;
}

export interface AvatarLabels {
  avatar: string;
}

/* ── Data Viz ── */

export interface ChartLabels {
  segment: string;
  value: string;
  x: string;
  y: string;
  size: string;
}

export interface CohortGridLabels {
  cohortRetentionGrid: string;
  cohort: string;
}

export interface CostTimelineLabels {
  costTimeline: string;
  period: string;
}

export interface FunnelLabels {
  pipelineFunnel: string;
  noStages: string;
  onHold: string;
  withdrawn: string;
}

export interface HbarLabels {
  horizontalBarChart: string;
}

export interface PipelineRankingLabels {
  conversion: string;
}

export interface WaterfallLabels {
  waterfallChart: string;
}

/* ── Feedback ── */

export interface ActivityFeedLabels {
  noActivity: string;
  refreshFeed: string;
  refresh: string;
}

export interface ModalLabels {
  close: string;
}

export interface NotificationCenterLabels {
  notifications: string;
  markAllAsRead: string;
  clearAllNotifications: string;
  clear: string;
  closeNotifications: string;
  loading: string;
  loadingNotifications: string;
  noNotifications: string;
}

export interface StateScaffoldLabels {
  loading: string;
}

export interface StreamingTextLabels {
  streamingResponse: string;
}

export interface ToastLabels {
  close: string;
  notifications: string;
}

/* ── Forms ── */

export interface AsyncSelectLabels {
  loading: string;
  noResults: string;
}

export interface CalendarRangeLabels {
  dateRange: string;
}

export interface DatePickerLabels {
  datePicker: string;
  previousMonth: string;
  nextMonth: string;
  today: string;
}

export interface DateRangePickerLabels {
  dateRangePicker: string;
  previousMonth: string;
  nextMonth: string;
  cancel: string;
  apply: string;
}

export interface FilterPanelLabels {
  filterPlaceholder: string;
  searchPlaceholder: string;
  clear: string;
  clearAll: string;
  filters: string;
  activeFilter: string;
  activeFilters: string;
}

export interface LoginLabels {
  signIn: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  hidePassword: string;
  showPassword: string;
  forgotPassword: string;
  serviceStatus: string;
}

export interface ProfileLabels {
  profileMenu: string;
}

export interface SearchDrawerLabels {
  close: string;
  searchResults: string;
}

export interface VoiceInputLabels {
  stopListening: string;
  processingSpeech: string;
  voiceError: string;
  startVoiceInput: string;
}

/* ── Layout ── */

export interface AdminShellLabels {
  skipToContent: string;
  adminNavigation: string;
}

export interface DashboardRendererLabels {
  loadingWidget: string;
  noData: string;
  retry: string;
}

export interface DashboardLabels {
  loading: string;
  widgetFailed: string;
}

export interface DashboardStripLabels {
  trendingUp: string;
  trendingDown: string;
  stable: string;
  pipeline: string;
  trends: string;
  board: string;
  dashboardMetrics: string;
}

export interface HeaderShellLabels {
  search: string;
  header: string;
}

/* ── Navigation ── */

export interface BreadcrumbLabels {
  breadcrumb: string;
}

export interface CommandPaletteLabels {
  noCommandsFound: string;
}

export interface SectionNavLabels {
  sectionNavigation: string;
}

export interface StepperLabels {
  progress: string;
}

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

/* ── Umbrella type ── */

export interface LocaleMessages {
  shell: ShellLabels;
  header: HeaderLabels;
  searchCombobox: SearchComboboxLabels;
  sidebar: SidebarLabels;
  a11yFab: A11yFabLabels;
  a11y: A11yLabels;
  themeToggle: ThemeToggleLabels;
  themeRotary: ThemeRotaryLabels;
  ferrariControl: FerrariControlLabels;
  dataTable: DataTableLabels;
  detailPanel: DetailPanelLabels;
  userTable: UserTableLabels;
  sourceCards: SourceCardsLabels;
  tokenMeter: TokenMeterLabels;
  kpiScorecard: KpiScorecardLabels;
  avatar: AvatarLabels;
  chart: ChartLabels;
  cohortGrid: CohortGridLabels;
  costTimeline: CostTimelineLabels;
  funnel: FunnelLabels;
  hbar: HbarLabels;
  pipelineRanking: PipelineRankingLabels;
  waterfall: WaterfallLabels;
  activityFeed: ActivityFeedLabels;
  modal: ModalLabels;
  notificationCenter: NotificationCenterLabels;
  stateScaffold: StateScaffoldLabels;
  streamingText: StreamingTextLabels;
  toast: ToastLabels;
  asyncSelect: AsyncSelectLabels;
  calendarRange: CalendarRangeLabels;
  datePicker: DatePickerLabels;
  dateRangePicker: DateRangePickerLabels;
  filterPanel: FilterPanelLabels;
  login: LoginLabels;
  profile: ProfileLabels;
  searchDrawer: SearchDrawerLabels;
  voiceInput: VoiceInputLabels;
  adminShell: AdminShellLabels;
  dashboardRenderer: DashboardRendererLabels;
  dashboard: DashboardLabels;
  dashboardStrip: DashboardStripLabels;
  headerShell: HeaderShellLabels;
  breadcrumb: BreadcrumbLabels;
  commandPalette: CommandPaletteLabels;
  sectionNav: SectionNavLabels;
  stepper: StepperLabels;
  activeMissions: ActiveMissionsLabels;
  agentTrace: AgentTraceLabels;
  approvalChain: ApprovalChainLabels;
  augmentedBrain: AugmentedBrainLabels;
  augmentedBrainV2: AugmentedBrainV2Labels;
  chat: ChatLabels;
  hubSpoke: HubSpokeLabels;
  neuralNodes: NeuralNodesLabels;
  processTimeline: ProcessTimelineLabels;
  deploymentTable: DeploymentTableLabels;
  map: MapLabels;
  meshNetworkCanvas: MeshNetworkCanvasLabels;
  meshNetworkCard: MeshNetworkCardLabels;
  meshNetworkToolbar: MeshNetworkToolbarLabels;
  meshNetwork: MeshNetworkLabels;
  networkMessages: NetworkMessagesLabels;
  orgChart: OrgChartLabels;
  socialGraph: SocialGraphLabels;
  systemStatus: SystemStatusLabels;
  auditLog: AuditLogLabels;
  binnacle: BinnacleLabels;
  entityWorkbench: EntityWorkbenchLabels;
  facetWorkbench: FacetWorkbenchLabels;
  gantt: GanttLabels;
  kanbanBoard: KanbanBoardLabels;
  nightJobs: NightJobsLabels;
  instrumentBinnacle: InstrumentBinnacleLabels;
  businessModelCanvas: BusinessModelCanvasLabels;
  customerJourneyMap: CustomerJourneyMapLabels;
  customerJourney: CustomerJourneyLabels;
  decisionMatrix: DecisionMatrixLabels;
  okr: OkrLabels;
  riskMatrix: RiskMatrixLabels;
  strategyCanvas: StrategyCanvasLabels;
  swot: SwotLabels;
  nineBoxMatrix: NineBoxMatrixLabels;
  porterFiveForces: PorterFiveForcesLabels;
  agentCostBreakdown: AgentCostBreakdownLabels;
  finOps: FinOpsLabels;
  errorPage: ErrorPageLabels;
  notFound: NotFoundLabels;
  loginPage: LoginPageLabels;
  dialog: DialogLabels;
  sheet: SheetLabels;
}

/** Deep-partial version: override only the keys you need. */
export type PartialLocaleMessages = {
  [K in keyof LocaleMessages]?: Partial<LocaleMessages[K]>;
};
