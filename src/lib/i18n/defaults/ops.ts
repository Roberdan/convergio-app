import type {
  AuditLogLabels, BinnacleLabels, EntityWorkbenchLabels,
  FacetWorkbenchLabels, GanttLabels, KanbanBoardLabels,
  NightJobsLabels, InstrumentBinnacleLabels,
} from "../types";

export const auditLogDefaults: AuditLogLabels = {
  noAuditEntries: "No audit entries.",
  filterAuditLog: "Filter audit log",
  filterPlaceholder: "Filter by actor, action, or target...",
  entries: "entries",
  loadMore: "Load more",
};

export const binnacleDefaults: BinnacleLabels = {
  noLogEntries: "No log entries.",
  entries: "entries",
  filter: "Filter:",
  filterBySeverity: "Filter by severity",
};

export const entityWorkbenchDefaults: EntityWorkbenchLabels = {
  unsavedChanges: "Unsaved changes",
  newTab: "New tab",
  noEntitiesOpen: "No entities open",
  save: "Save",
};

export const facetWorkbenchDefaults: FacetWorkbenchLabels = {
  clear: "Clear",
  clearAll: "Clear all",
  activeFilter: "active filter",
  activeFilters: "active filters",
};

export const ganttDefaults: GanttLabels = {
  today: "TODAY",
  zoomIn: "Zoom in (more detail)",
  zoomOut: "Zoom out (overview)",
  fitTimeline: "Fit timeline to view",
  ganttTimeline: "Gantt timeline",
  todayMarker: "Today",
  task: "Task",
  expand: "Expand",
  collapse: "Collapse",
};

export const kanbanBoardDefaults: KanbanBoardLabels = {
  kanbanBoard: "Kanban board",
  addCard: "Add card",
};

export const nightJobsDefaults: NightJobsLabels = {
  noScheduledJobs: "No scheduled jobs.",
  schedule: "Schedule",
  lastRun: "Last run",
  nextRun: "Next run",
};

export const instrumentBinnacleDefaults: InstrumentBinnacleLabels = {
  instrumentPanel: "Instrument panel",
  keyMetrics: "Key metrics",
  eventLog: "Event log",
};
