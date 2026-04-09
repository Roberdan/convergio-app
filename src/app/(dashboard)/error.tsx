"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n";

/**
 * Dashboard-level error boundary.
 * Catches errors within dashboard routes and renders an inline
 * error panel with retry and navigation options.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useLocale("errorPage");

  useEffect(() => {
    console.error("[dashboard] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold">{t.somethingWentWrong}</h2>
      <p className="text-caption mt-1 max-w-sm text-center">
        {error.message || t.sectionError}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mt-2">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3 mt-6">
        <Button onClick={reset}>{t.tryAgain}</Button>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t.goToDashboard}
        </Link>
      </div>
    </div>
  );
}
