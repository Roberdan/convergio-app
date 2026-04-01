import { Badge } from "@/components/ui/badge";
import type { StatListBlock } from "@/types";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  error: "destructive",
  warning: "secondary",
  info: "outline",
};

/**
 * Stat List block component.
 *
 * Renders a vertical list of label-value pairs with optional status badges.
 * Use for: system health, security policy status, feature flags, config summary.
 *
 * Themed: bg-card, divide-border. Works in all 4 themes.
 */
export function StatList({ items }: StatListBlock) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground divide-y divide-border">
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <p className="text-sm">{item.label}</p>
          {item.status ? (
            <Badge variant={STATUS_VARIANT[item.status] ?? "outline"}>{item.value}</Badge>
          ) : (
            <span className="text-sm font-mono text-muted-foreground">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
