"use client";

import { useMemo } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { computeLayout } from "./mn-workflow-orchestrator.layout";
import { EdgesLayer, ParticlesLayer, NodeGroup, PhaseBar } from "./mn-workflow-orchestrator.helpers";
import type {
  MnWorkflowOrchestratorProps,
} from "./mn-workflow-orchestrator.types";

export const workflowWrap = cva("relative w-full overflow-hidden rounded-md", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-xl",
      lg: "max-w-4xl",
      fluid: "w-full",
    },
  },
  defaultVariants: { size: "fluid" },
});

const SVG_W = 600;
const SVG_H = 400;
const NODE_R = 24;

export function MnWorkflowOrchestrator({
  nodes,
  edges,
  layout = "circular",
  phase,
  onNodeClick,
  onEdgeClick,
  selectedNode,
  ariaLabel,
  showParticles = true,
  animationSpeed = 1,
  size,
  className,
  ...rest
}: MnWorkflowOrchestratorProps) {
  const t = useLocale("workflowOrchestrator");

  const positions = useMemo(
    () => computeLayout(layout, nodes, edges, SVG_W, SVG_H),
    [layout, nodes, edges],
  );

  const particleDur = `${1.5 / animationSpeed}s`;

  if (nodes.length === 0) {
    return (
      <div className={cn(workflowWrap({ size }), className)} {...rest}>
        <p className="p-4 text-sm text-[var(--mn-text-muted)]">{t.noNodes}</p>
      </div>
    );
  }

  return (
    <div className={cn(workflowWrap({ size }), className)} {...rest}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={ariaLabel ?? t.workflowVisualization}
      >
        <defs>
          <marker id="wfo-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--mn-text-muted)" />
          </marker>
          <style>{`
            @keyframes wfo-pulse { 0%,100% { r: ${NODE_R + 4}; opacity: .4 } 50% { r: ${NODE_R + 12}; opacity: 0 } }
            @keyframes wfo-think { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
          `}</style>
          {edges.map((e) => {
            const a = positions.get(e.from);
            const b = positions.get(e.to);
            if (!a || !b) return null;
            return <path key={`p-${e.from}-${e.to}`} id={`wfo-path-${e.from}-${e.to}`} d={`M${a.x},${a.y} L${b.x},${b.y}`} />;
          })}
        </defs>

        <EdgesLayer edges={edges} positions={positions} onEdgeClick={onEdgeClick} />

        {showParticles && <ParticlesLayer edges={edges} positions={positions} dur={particleDur} />}

        {nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          return (
            <NodeGroup
              key={node.id}
              node={node}
              pos={pos}
              selected={selectedNode === node.id}
              onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
            />
          );
        })}
      </svg>

      {phase && <PhaseBar phase={phase} label={t.phase} />}
    </div>
  );
}
