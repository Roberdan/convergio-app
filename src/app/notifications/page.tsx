import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const NOTIFICATIONS = [
  { title: "Plan 10035 wave W2 completed", time: "8m ago", read: false },
  { title: "Agent foxtrot-01 entered error state", time: "12m ago", read: false },
  { title: "PR #30 CI passed on ConvergioPlatform", time: "1h ago", read: false },
  { title: "Budget threshold reached (80%)", time: "2h ago", read: true },
  { title: "Workspace ws-44bf created successfully", time: "3h ago", read: true },
  { title: "Mesh peer convergio-web disconnected", time: "5h ago", read: true },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1>Notifications</h1>
          <p className="text-caption mt-1">System alerts and updates.</p>
        </div>
      </div>

      <div className="space-y-2">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-md border p-3 text-sm transition-colors ${n.read ? "bg-card text-card-foreground" : "bg-muted text-foreground"}`}>
            {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            {n.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
            <div className="flex-1">
              <p className={n.read ? "text-muted-foreground" : "font-medium"}>{n.title}</p>
              <p className="text-micro mt-0.5">{n.time}</p>
            </div>
            {!n.read && <Badge variant="secondary" className="text-[10px]">New</Badge>}
          </div>
        ))}
      </div>
    </div>
  );
}
