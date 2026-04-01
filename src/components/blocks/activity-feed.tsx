import type { ActivityFeedBlock } from "@/types";

const STATUS_DOT: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-destructive",
  warning: "bg-yellow-500",
  info: "bg-primary",
};

/**
 * Activity Feed block component.
 *
 * Renders a chronological event stream with colored status dots.
 * Use for: recent activity, audit trail, deployment log, agent event history.
 *
 * Each item shows a status dot, description text, and relative timestamp.
 * Themed: bg-card borders, works in all 4 themes.
 */
export function ActivityFeed({ items }: ActivityFeedBlock) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-md border bg-card p-3 text-card-foreground text-sm">
          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[item.status ?? "info"]}`} />
          <div className="flex-1 min-w-0">
            <p>{item.text}</p>
            <p className="text-micro mt-0.5">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
