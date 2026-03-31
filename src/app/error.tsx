"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2>Something went wrong</h2>
      <p className="text-caption mt-1 max-w-sm text-center">
        An unexpected error occurred. Try again or contact support if the problem persists.
      </p>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
