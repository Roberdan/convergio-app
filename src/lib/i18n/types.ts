/**
 * i18n type definitions — one interface per component namespace.
 * Each interface maps string keys to their English default values.
 * Apps override via MnLocaleProvider or YAML locale: section.
 *
 * Split into four files for the 300-line limit:
 *   types.ts              — Shell, Theme, Data Display, Data Viz (core types)
 *   types-navigation.ts   — Feedback, Forms, Layout, Navigation
 *   types-pages.ts        — Agentic, Network, Ops, Strategy, Financial, Pages, Primitives
 *   types-umbrella.ts     — LocaleMessages + PartialLocaleMessages umbrella
 */

/* ── Re-exports from split files ── */

export type {
  ActivityFeedLabels,
  ModalLabels,
  NotificationCenterLabels,
  StateScaffoldLabels,
  StreamingTextLabels,
  ToastLabels,
  AsyncSelectLabels,
  CalendarRangeLabels,
  DatePickerLabels,
  DateRangePickerLabels,
  FilterPanelLabels,
  LoginLabels,
  ProfileLabels,
  SearchDrawerLabels,
  VoiceInputLabels,
  AdminShellLabels,
  DashboardRendererLabels,
  DashboardLabels,
  DashboardStripLabels,
  HeaderShellLabels,
  BreadcrumbLabels,
  CommandPaletteLabels,
  SectionNavLabels,
  StepperLabels,
} from './types-navigation';

export type {
  ActiveMissionsLabels,
  AgentTraceLabels,
  ApprovalChainLabels,
  AugmentedBrainLabels,
  AugmentedBrainV2Labels,
  ChatLabels,
  HubSpokeLabels,
  NeuralNodesLabels,
  ProcessTimelineLabels,
  DeploymentTableLabels,
  MapLabels,
  MeshNetworkCanvasLabels,
  MeshNetworkCardLabels,
  MeshNetworkToolbarLabels,
  MeshNetworkLabels,
  NetworkMessagesLabels,
  OrgChartLabels,
  SocialGraphLabels,
  SystemStatusLabels,
  AuditLogLabels,
  BinnacleLabels,
  EntityWorkbenchLabels,
  FacetWorkbenchLabels,
  GanttLabels,
  KanbanBoardLabels,
  NightJobsLabels,
  InstrumentBinnacleLabels,
  BusinessModelCanvasLabels,
  CustomerJourneyMapLabels,
  CustomerJourneyLabels,
  DecisionMatrixLabels,
  OkrLabels,
  RiskMatrixLabels,
  StrategyCanvasLabels,
  SwotLabels,
  NineBoxMatrixLabels,
  PorterFiveForcesLabels,
  AgentCostBreakdownLabels,
  FinOpsLabels,
  ErrorPageLabels,
  NotFoundLabels,
  LoginPageLabels,
  DialogLabels,
  SheetLabels,
} from './types-pages';

export type { LocaleMessages, PartialLocaleMessages } from './types-umbrella';

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
  openAiChat: string;
}

export interface AiChatPanelLabels {
  title: string;
  placeholder: string;
  close: string;
  errorSending: string;
}

export interface NotificationBellLabels {
  bell: string;
  dismiss: string;
  noNotifications: string;
  loading: string;
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
  quickActions: string;
  agents: string;
  plans: string;
  organizations: string;
  spawnAgent: string;
  createPlan: string;
  runDoctor: string;
  switchTheme: string;
  switchLanguage: string;
}

export interface SidebarLabels {
  support: string;
  expandSidebar: string;
  collapseSidebar: string;
  brandFallback: string;
  tabHome: string;
  tabAgents: string;
  tabPlans: string;
  tabChat: string;
  tabMore: string;
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
