import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const POLICIES = [
  { name: "File lock enforcement", status: "active", last: "2m ago" },
  { name: "Budget gate (daily)", status: "active", last: "14m ago" },
  { name: "Egress firewall", status: "active", last: "1h ago" },
  { name: "ACL role check", status: "active", last: "3m ago" },
  { name: "Audit chain integrity", status: "warning", last: "45m ago" },
  { name: "Kill switch", status: "standby", last: "never triggered" },
];

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  warning: "destructive",
  standby: "secondary",
};

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <div>
          <h1>Security</h1>
          <p className="text-caption mt-1">Platform security policies and audit status.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground divide-y divide-border">
        {POLICIES.map((policy) => (
          <div key={policy.name} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">{policy.name}</p>
              <p className="text-micro mt-0.5">Last checked: {policy.last}</p>
            </div>
            <Badge variant={STATUS_BADGE[policy.status]}>{policy.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
