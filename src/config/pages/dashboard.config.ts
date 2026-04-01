import type { PageConfig } from "@/types";

/**
 * Dashboard page configuration.
 *
 * Defines the layout and content of the main dashboard.
 * Edit this file to change what appears on the dashboard.
 * All data here is placeholder — replace with API-driven data in production.
 */
export const dashboardConfig: PageConfig = {
  title: "Dashboard",
  description: "Platform overview and recent activity.",

  rows: [
    {
      columns: 4,
      blocks: [
        { type: "kpi-card", label: "Active Agents", value: "12", change: "+2", trend: "up" },
        { type: "kpi-card", label: "Running Plans", value: "3", change: "0", trend: "flat" },
        { type: "kpi-card", label: "Tasks Completed", value: "847", change: "+23", trend: "up" },
        { type: "kpi-card", label: "Uptime", value: "99.7%", change: "+0.1%", trend: "up" },
      ],
    },
    {
      columns: 2,
      blocks: [
        {
          type: "activity-feed",
          items: [
            { time: "2m ago", text: "Agent alfa-01 completed task T3-04 in plan 10035", status: "success" },
            { time: "8m ago", text: "Plan 10035 wave W2 validated by Thor", status: "info" },
            { time: "14m ago", text: "Workspace ws-44bf created for maranello", status: "info" },
            { time: "22m ago", text: "Agent charlie-07 started task T4-01", status: "info" },
            { time: "1h ago", text: "Build failed on fix/header-shell-followups", status: "error" },
          ],
        },
        {
          type: "data-table",
          columns: [
            { key: "agent", label: "Agent", mono: true },
            { key: "status", label: "Status" },
            { key: "model", label: "Model" },
            { key: "tasks", label: "Tasks", align: "right" },
          ],
          rows: [
            { agent: "alfa-01", status: "active", model: "claude-sonnet", tasks: 4 },
            { agent: "bravo-03", status: "active", model: "copilot", tasks: 2 },
            { agent: "charlie-07", status: "active", model: "claude-sonnet", tasks: 1 },
            { agent: "delta-02", status: "idle", model: "copilot", tasks: 0 },
            { agent: "echo-05", status: "active", model: "claude-haiku", tasks: 3 },
          ],
        },
      ],
    },
  ],
};
