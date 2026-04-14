import { Suspense, createElement } from "react";
import type { PageConfig, PageBlock } from "@/types";
import { loadAIConfig } from "@/lib/config-loader";
import { getBlock } from "@/lib/block-registry";
import { KpiCard, DataTable, ActivityFeed, StatList, EmptyState, AIChatPanel } from "@/components/blocks";

/**
 * Page Renderer — transforms a PageConfig into rendered UI.
 *
 * Maranello block components are loaded from the dynamic block registry
 * (see src/lib/block-registry.ts). Built-in blocks (kpi-card, data-table,
 * activity-feed, stat-list, empty-state, ai-chat) are always available.
 *
 * To register Maranello blocks, import block-registrations.ts in your layout:
 * ```ts
 * import "@/lib/block-registrations";
 * ```
 */

/** Map column count to responsive Tailwind grid classes (mobile-first) */
function gridClasses(columns: number): string {
  const base = "grid grid-cols-1 gap-4";
  if (columns <= 1) return base;
  if (columns === 2) return `${base} md:grid-cols-2`;
  if (columns === 3) return `${base} sm:grid-cols-2 lg:grid-cols-3`;
  return `${base} sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`;
}

export function PageRenderer({ config }: { config: PageConfig }) {
  return (
    <div className="space-y-6">
      <div>
        <h1>{config.title}</h1>
        {config.description && (
          <p className="text-caption mt-1">{config.description}</p>
        )}
      </div>
      {config.rows.map((row, ri) => (
        <div key={ri} className={gridClasses(row.columns)}>
          {row.blocks.map((block, bi) => (
            <BlockRenderer key={bi} block={block} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Fallback shown while a lazy block component is loading. */
function BlockFallback() {
  return (
    <div className="animate-pulse rounded-lg bg-[var(--mn-surface-sunken)] h-32" />
  );
}

function BlockRenderer({ block }: { block: PageBlock }) {
  /* Built-in blocks — always available, no registry needed */
  switch (block.type) {
    case "kpi-card":
      return <KpiCard {...block} />;
    case "data-table":
      return <DataTable {...block} />;
    case "activity-feed":
      return <ActivityFeed {...block} />;
    case "stat-list":
      return <StatList {...block} />;
    case "empty-state":
      return <EmptyState {...block} />;
    case "ai-chat":
      return <AIChatPanel defaultAgentId={block.agentId} aiConfig={loadAIConfig()} />;
    default:
      break;
  }

  /* Registry blocks — Maranello components registered via block-registry */
  return <RegistryBlock block={block} />;
}

function RegistryBlock({ block }: { block: PageBlock }) {
  const Component = getBlock(block.type);
  if (!Component) {
    console.warn(`[PageRenderer] Unknown block type: "${block.type}". Is the component installed and registered?`);
    return null;
  }
  /* chart-block needs type remapping: block.chartType → component's type prop */
  const props = block.type === "chart-block"
    ? (() => { const { type: _t, chartType, ...rest } = block; return { type: chartType, ...rest }; })() // eslint-disable-line @typescript-eslint/no-unused-vars
    : block;
  return (
    <Suspense fallback={<BlockFallback />}>
      {createElement(Component, props)}
    </Suspense>
  );
}
