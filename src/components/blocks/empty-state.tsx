import { Button } from "@/components/ui/button";
import { FolderKanban } from "lucide-react";
import Link from "next/link";
import type { EmptyStateBlock } from "@/types";

/**
 * Empty State block component.
 *
 * Placeholder shown when a section has no data yet.
 * Use for: first-time user experience, empty lists, no search results.
 *
 * Renders a centered icon, title, description, and optional CTA button.
 * Themed: border-dashed, bg-card. Works in all 4 themes.
 */
export function EmptyState({ icon: Icon = FolderKanban, title, description, actionLabel, actionHref }: EmptyStateBlock) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-16 text-card-foreground">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-center">{title}</h3>
      <p className="text-caption text-center mt-1 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="mt-6">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
