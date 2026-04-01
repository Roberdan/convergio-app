import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KpiCardBlock } from "@/types";

/**
 * KPI Card block component.
 *
 * Renders a single headline metric with label, value, and optional trend.
 * Use at the top of dashboard pages in rows of 3-4 to show key numbers.
 *
 * Themed: bg-card, text-card-foreground. Works in all 4 themes.
 */
export function KpiCard({ label, value, change, trend }: KpiCardBlock) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground">
      <p className="text-label text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="font-heading text-2xl font-bold">{value}</span>
        {change && (
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            {change}
          </Badge>
        )}
      </div>
    </div>
  );
}
