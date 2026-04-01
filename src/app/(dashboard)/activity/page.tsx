import { Badge } from "@/components/ui/badge";
import { Activity as ActivityIcon } from "lucide-react";

const EVENTS = [
  { time: "2m ago", agent: "alfa-01", action: "completed task T3-04 in plan 10035", type: "success" },
  { time: "8m ago", agent: "system", action: "wave W2 validated by Thor", type: "info" },
  { time: "14m ago", agent: "bravo-03", action: "workspace ws-44bf created", type: "info" },
  { time: "22m ago", agent: "charlie-07", action: "started task T4-01", type: "default" },
  { time: "35m ago", agent: "delta-02", action: "escalated task T2-03 to claude", type: "warning" },
  { time: "1h ago", agent: "system", action: "build failed on fix/header-shell", type: "error" },
  { time: "1h ago", agent: "alfa-01", action: "submitted PR #31 for review", type: "success" },
  { time: "2h ago", agent: "echo-05", action: "mesh peer convergio-web joined", type: "info" },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ActivityIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1>Activity</h1>
          <p className="text-caption mt-1">Real-time event stream across all agents and plans.</p>
        </div>
      </div>

      <div className="space-y-2">
        {EVENTS.map((event, i) => (
          <div key={i} className="flex items-start gap-3 rounded-md border bg-card p-3 text-card-foreground text-sm">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
              event.type === "success" ? "bg-green-500" :
              event.type === "error" ? "bg-destructive" :
              event.type === "warning" ? "bg-yellow-500" : "bg-primary"
            }`} />
            <div className="flex-1 min-w-0">
              <p><Badge variant="outline" className="mr-2 font-mono text-[10px]">{event.agent}</Badge>{event.action}</p>
              <p className="text-micro mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
