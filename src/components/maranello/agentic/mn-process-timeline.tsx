"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import {
  nodeVariants, labelVariants,
  StatusIcon, ActorBadge, Connector, VerticalStepNode, isConnectorDone,
  type StepNodeProps,
} from "./mn-process-timeline.helpers";

/* ── Types ── */

export interface ProcessTimelineStep {
  id: string;
  label: string;
  description?: string;
  actor?: { name: string; avatar?: string; color?: string };
  status: "pending" | "active" | "done" | "error" | "skipped";
  duration?: string;
  timestamp?: string;
  metadata?: Record<string, string>;
}

export interface MnProcessTimelineProps {
  steps: ProcessTimelineStep[];
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  showDuration?: boolean;
  showActors?: boolean;
  onStepClick?: (step: ProcessTimelineStep) => void;
  className?: string;
  ariaLabel?: string;
}

/* ── Horizontal step node ── */

function StepNode({ step, size, animate, showActors, interactive, onClick }: StepNodeProps) {
  const t = useLocale("processTimeline");
  const ariaText = `${step.label}: ${t.stepStatus} ${step.status}`;

  const nodeContent = (
    <span className={cn(nodeVariants({ size, status: step.status }), animate && step.status === "active" && "animate-pulse")}>
      <StatusIcon status={step.status} size={size} />
    </span>
  );

  return (
    <div className="flex flex-col items-center gap-1" role="listitem">
      {showActors && (
        <div className="flex flex-col items-center gap-0.5 min-h-[1.5rem]">
          <ActorBadge actor={step.actor} size={size} />
          {step.actor && (
            <span className="text-[10px] leading-tight text-[var(--mn-text-muted)] max-w-[5rem] truncate text-center">
              {step.actor.name}
            </span>
          )}
        </div>
      )}
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
      <span className={cn(labelVariants({ size }), "text-[var(--mn-text)] text-center max-w-[6rem]")}>
        {step.label}
      </span>
      {step.description && (
        <span className="text-[10px] text-[var(--mn-text-muted)] text-center max-w-[6rem] leading-tight">
          {step.description}
        </span>
      )}
      {step.timestamp && (
        <time className="text-[10px] text-[var(--mn-text-tertiary)]">{step.timestamp}</time>
      )}
    </div>
  );
}

/* ── Main component ── */

function MnProcessTimeline({
  steps,
  orientation = "horizontal",
  size = "md",
  animate = true,
  showDuration = false,
  showActors = false,
  onStepClick,
  className,
  ariaLabel,
}: MnProcessTimelineProps) {
  const t = useLocale("processTimeline");
  const isVertical = orientation === "vertical";
  const interactive = typeof onStepClick === "function";

  if (!steps.length) {
    return (
      <div className={cn("rounded-lg border border-[var(--mn-border)] bg-[var(--mn-surface-raised)] p-6 text-center text-sm text-[var(--mn-text-muted)]", className)}>
        {t.noSteps}
      </div>
    );
  }

  const StepComponent = isVertical ? VerticalStepNode : StepNode;
  const dir = isVertical ? "vertical" as const : "horizontal" as const;

  return (
    <div
      role="list"
      aria-label={ariaLabel ?? t.defaultAriaLabel}
      className={cn(isVertical ? "flex flex-col" : "flex items-start", className)}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <StepComponent
            step={step}
            size={size}
            animate={animate}
            showActors={showActors}
            interactive={interactive}
            onClick={interactive ? () => onStepClick(step) : undefined}
          />
          {i < steps.length - 1 && (
            <Connector
              done={isConnectorDone(step.status)}
              orientation={dir}
              duration={steps[i + 1]?.duration}
              showDuration={showDuration}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export { MnProcessTimeline };
