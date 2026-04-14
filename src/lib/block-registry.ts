import { type ComponentType, lazy, type LazyExoticComponent } from "react";

/**
 * Block Registry — dynamic component registration for PageRenderer.
 *
 * Instead of statically importing every Maranello component, blocks
 * register themselves when installed. This enables consumers to install
 * only the components they need (shadcn-style) while keeping the
 * page-renderer working for any block type declared in YAML config.
 *
 * @example
 * ```ts
 * // In a component's register file (e.g. mn-gauge.register.ts):
 * import { registerBlock } from "@/lib/block-registry";
 * registerBlock("gauge-block", lazy(() => import("@/components/maranello/data-viz/mn-gauge")));
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type BlockComponent = ComponentType<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

const registry = new Map<string, LazyExoticComponent<BlockComponent> | BlockComponent>();

/** Register a block type with its component (eager or lazy). */
export function registerBlock(
  blockType: string,
  component: LazyExoticComponent<BlockComponent> | BlockComponent,
): void {
  registry.set(blockType, component);
}

/** Look up a registered block component by type. Returns undefined if not registered. */
export function getBlock(blockType: string): LazyExoticComponent<BlockComponent> | BlockComponent | undefined {
  return registry.get(blockType);
}

/** Check whether a block type has been registered. */
export function hasBlock(blockType: string): boolean {
  return registry.has(blockType);
}

/** Get all registered block type names. */
export function registeredBlockTypes(): string[] {
  return [...registry.keys()];
}

/**
 * Helper to create a lazy-loaded block registration.
 * Ensures the dynamic import only triggers when the block is actually rendered.
 */
export function lazyBlock(
  blockType: string,
  importFn: () => Promise<{ [key: string]: BlockComponent }>,
  exportName: string,
): void {
  const component = lazy(async () => {
    const mod = await importFn();
    return { default: mod[exportName] };
  });
  registerBlock(blockType, component);
}
