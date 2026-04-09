import type {
  AdminShellLabels, DashboardRendererLabels, DashboardLabels,
  DashboardStripLabels, HeaderShellLabels,
} from "../types";

export const adminShellDefaults: AdminShellLabels = {
  skipToContent: "Skip to content",
  adminNavigation: "Admin navigation",
};

export const dashboardRendererDefaults: DashboardRendererLabels = {
  loadingWidget: "Loading widget",
  noData: "No data available",
  retry: "Retry",
};

export const dashboardDefaults: DashboardLabels = {
  loading: "Loading\u2026",
  widgetFailed: "Widget failed to load.",
};

export const dashboardStripDefaults: DashboardStripLabels = {
  trendingUp: "trending up",
  trendingDown: "trending down",
  stable: "stable",
  pipeline: "Pipeline",
  trends: "Trends",
  board: "Board",
  dashboardMetrics: "Dashboard metrics",
};

export const headerShellDefaults: HeaderShellLabels = {
  search: "Search",
  header: "Header",
};
