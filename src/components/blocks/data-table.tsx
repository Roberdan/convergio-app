import type { DataTableBlock } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Data Table block component.
 *
 * Renders tabular data with typed columns and rows.
 * Use for: agent lists, task queues, audit logs, user tables, inventory.
 *
 * Supports:
 * - Right-aligned numeric columns (align: "right")
 * - Monospace font for IDs/codes (mono: true)
 * - Hover highlight on rows
 * - Themed: bg-card borders, works in all 4 themes
 */
export function DataTable({ columns, rows }: DataTableBlock) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("p-3 font-medium", col.align === "right" && "text-right", col.align === "center" && "text-center")}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "p-3",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.mono && "font-mono",
                  )}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
