import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-caption mt-1">Overview of platform activity and health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: "12", change: "+2" },
          { label: "Running Plans", value: "3", change: "0" },
          { label: "Tasks Completed", value: "847", change: "+23" },
          { label: "Uptime", value: "99.7%", change: "+0.1%" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border bg-card p-4 text-card-foreground">
            <p className="text-label text-muted-foreground">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-heading text-2xl font-bold">{kpi.value}</span>
              <Badge variant="secondary" className="text-[10px]">{kpi.change}</Badge>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h3>Recent Activity</h3>
        <div className="mt-3 space-y-2">
          {[
            { time: "2m ago", text: "Agent alfa-01 completed task T3-04", status: "success" },
            { time: "8m ago", text: "Plan 10035 wave W2 validated", status: "info" },
            { time: "14m ago", text: "Workspace ws-44bf created for maranello", status: "info" },
            { time: "1h ago", text: "Build failed on fix/header-shell-followups", status: "error" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border bg-card p-3 text-card-foreground text-sm">
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                item.status === "success" ? "bg-green-500" :
                item.status === "error" ? "bg-destructive" : "bg-primary"
              }`} />
              <div className="flex-1">
                <p>{item.text}</p>
                <p className="text-micro mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
