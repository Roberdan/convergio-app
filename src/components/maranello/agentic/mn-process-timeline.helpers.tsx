import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { cva } from "class-variance-authority";
import { Check, X, Circle, Clock, SkipForward } from "lucide-react";
import type { ProcessTimelineStep } from "./mn-process-timeline";

/* ── Shared props ── */

export interface StepNodeProps {
  step: ProcessTimelineStep;
  size: "sm" | "md" | "lg";
  animate: boolean;
  showActors: boolean;
  interactive: boolean;
  onClick?: () => void;
}

/* ── CVA variants ── */

export const nodeVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full border-2 transition-colors",
  {
    variants: {
      size: {
        sm: "h-7 w-7",
        md: "h-9 w-9",
        lg: "h-11 w-11",
      },
      status: {
        pending: "border-[var(--mn-border)] bg-[var(--mn-surface)]",
        active: "border-[var(--mn-accent)] bg-[var(--mn-accent-bg)]",
        done: "border-[var(--mn-accent)] bg-[var(--mn-accent)]",
        error: "border-[var(--mn-error)] bg-[var(--mn-error)]",
        skipped: "border-dashed border-[var(--mn-border)] bg-[var(--mn-surface)]",
      },
    },
    defaultVariants: { size: "md", status: "pending" },
  },
);

const iconSize: Record<string, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export const labelVariants = cva("font-medium leading-tight", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    },
  },
  defaultVariants: { size: "md" },
});

/* ── Helper components ── */

export function StatusIcon({ status, size }: { status: ProcessTimelineStep["status"]; size: string }) {
  const cls = cn(iconSize[size] ?? iconSize.md, "shrink-0");
  switch (status) {
    case "done":
      return <Check className={cls} style={{ color: "var(--mn-accent-text)" }} aria-hidden="true" />;
    case "error":
      return <X className={cls} style={{ color: "var(--mn-surface)" }} aria-hidden="true" />;
    case "active":
      return <Circle className={cls} style={{ color: "var(--mn-accent)" }} aria-hidden="true" />;
    case "skipped":
      return <SkipForward className={cls} style={{ color: "var(--mn-text-muted)" }} aria-hidden="true" />;
    case "pending":
      return <Circle className={cls} style={{ color: "var(--mn-text-muted)" }} aria-hidden="true" />;
  }
}

export function ActorBadge({ actor, size }: { actor: ProcessTimelineStep["actor"]; size: string }) {
  if (!actor) return null;
  const dim = size === "sm" ? "h-5 w-5 text-[9px]" : size === "lg" ? "h-7 w-7 text-xs" : "h-6 w-6 text-[10px]";
  const initials = actor.name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  if (actor.avatar) {
    return (
      <img
        src={actor.avatar}
        alt={actor.name}
        className={cn("rounded-full object-cover", dim)}
      />
    );
  }

  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full font-semibold", dim)}
      style={{
        backgroundColor: actor.color ?? "var(--mn-accent-bg)",
        color: actor.color ? "var(--mn-surface)" : "var(--mn-accent)",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function isConnectorDone(status: ProcessTimelineStep["status"]): boolean {
  return status === "done";
}

export function Connector({
  done,
  orientation,
  duration,
  showDuration,
}: {
  done: boolean;
  orientation: "horizontal" | "vertical";
  duration?: string;
  showDuration: boolean;
}) {
  const t = useLocale("processTimeline");
  const isH = orientation === "horizontal";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center",
        isH ? "flex-col mx-0.5 flex-1 min-w-6" : "flex-row my-0.5 min-h-6 self-center",
      )}
    >
      <div
        className={cn(
          "transition-colors",
          isH ? "h-px w-full" : "w-px h-full min-h-6",
          done
            ? "bg-[var(--mn-accent)]"
            : "bg-[var(--mn-border)] border-t border-dashed border-[var(--mn-border)]",
        )}
        style={!done && isH ? { backgroundImage: "none" } : undefined}
      />
      {showDuration && duration && (
        <span
          className="text-[9px] text-[var(--mn-text-muted)] whitespace-nowrap"
          title={`${t.duration}: ${duration}`}
        >
          <Clock className="inline h-2.5 w-2.5 mr-0.5" aria-hidden="true" />
          {duration}
        </span>
      )}
    </div>
  );
}

/* ── Vertical step node ── */

export function VerticalStepNode({ step, size, animate, showActors, interactive, onClick }: StepNodeProps) {
  const t = useLocale("processTimeline");
  const ariaText = `${step.label}: ${t.stepStatus} ${step.status}`;

  const nodeContent = (
    <span className={cn(nodeVariants({ size, status: step.status }), animate && step.status === "active" && "animate-pulse")}>
      <StatusIcon status={step.status} size={size} />
    </span>
  );

  return (
    <div className="flex items-start gap-3" role="listitem">
      <div className="flex flex-col items-center shrink-0">
        {interactive ? (
          <button
            type="button"
            onClick={onClick}
            aria-label={ariaText}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mn-focus-ring)] focus-visible:ring-offset-2"
          >
            {nodeContent}
          </button>
        ) : (
          <span aria-label={ariaText}>{nodeContent}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 pt-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(labelVariants({ size }), "text-[var(--mn-text)]")}>
            {step.label}
          </span>
          {showActors && step.actor && (
            <div className="flex items-center gap-1">
              <ActorBadge actor={step.actor} size="sm" />
              <span className="text-[10px] text-[var(--mn-text-muted)]">{step.actor.name}</span>
            </div>
          )}
        </div>
        {step.description && (
          <span className="text-xs text-[var(--mn-text-muted)] leading-tight">{step.description}</span>
        )}
        {step.timestamp && (
          <time className="text-[10px] text-[var(--mn-text-tertiary)]">{step.timestamp}</time>
        )}
      </div>
    </div>
  );
}
