import type {
  ShellLabels, HeaderLabels, SearchComboboxLabels, SidebarLabels,
  AiChatPanelLabels, NotificationBellLabels,
} from "../types";

export const shellDefaults: ShellLabels = {
  skipToContent: "Skip to main content",
  dashboard: "Dashboard",
  brandFallback: "Maranello",
};

export const headerDefaults: HeaderLabels = {
  toggleMenu: "Toggle menu",
  breadcrumb: "Breadcrumb",
  notifications: "Notifications",
  openAiChat: "Open AI Chat",
};

export const aiChatPanelDefaults: AiChatPanelLabels = {
  title: "AI Chat",
  placeholder: "Ask anything\u2026",
  close: "Close chat",
  errorSending: "Failed to send message. Please try again.",
};

export const notificationBellDefaults: NotificationBellLabels = {
  bell: "Notifications",
  dismiss: "Dismiss",
  noNotifications: "No new notifications",
  loading: "Loading notifications\u2026",
};

export const searchComboboxDefaults: SearchComboboxLabels = {
  placeholder: "Search agents, plans, components, or navigate",
  searchPlaceholder: "Search...",
  searchResults: "Search results",
  components: "Components",
  navigation: "Navigation",
  categories: "Categories",
  theme: "Theme",
  noResults: "No results found.",
  home: "Home",
  light: "Light",
  dark: "Dark",
  navy: "Navy",
  colorblind: "Colorblind",
  quickActions: "Quick Actions",
  agents: "Agents",
  plans: "Plans",
  organizations: "Organizations",
  spawnAgent: "Spawn Agent",
  createPlan: "Create Plan",
  runDoctor: "Run Doctor",
  switchTheme: "Switch Theme",
  switchLanguage: "Switch Language",
};

export const sidebarDefaults: SidebarLabels = {
  support: "Support",
  expandSidebar: "Expand sidebar",
  collapseSidebar: "Collapse sidebar",
  brandFallback: "Convergio",
  tabHome: "Home",
  tabAgents: "Agents",
  tabPlans: "Plans",
  tabChat: "Chat",
  tabMore: "More",
};
