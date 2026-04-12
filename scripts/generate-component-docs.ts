#!/usr/bin/env npx tsx
/**
 * Generate .mdx documentation files for all Maranello components.
 *
 * Reads:
 *   - src/lib/component-catalog-data.ts   (catalog metadata)
 *   - src/components/maranello/<filePath>  (props interface)
 *
 * Writes:
 *   - docs/components/<category>/<slug>.mdx
 *
 * Usage:  npx tsx scripts/generate-component-docs.ts [--force]
 *
 * By default, preserves manually edited files (those with inline code examples
 * containing more than a single JSX tag). Pass --force to overwrite all.
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ── paths ──────────────────────────────────────────────────────────
const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const CATALOG_PATH = path.join(ROOT, "src/lib/component-catalog-data.ts");
export const COMPONENTS_DIR = path.join(ROOT, "src/components/maranello");
export const DOCS_DIR = path.join(ROOT, "docs/components");
export const FORCE = process.argv.includes("--force");

// ── types ──────────────────────────────────────────────────────────
export interface CatalogEntry {
  name: string;
  slug: string;
  category: string;
  description: string;
  keywords: string[];
  whenToUse: string;
  filePath: string;
  propsInterface: string;
}

// ── parse catalog ──────────────────────────────────────────────────
export function parseCatalog(): CatalogEntry[] {
  const src = fs.readFileSync(CATALOG_PATH, "utf-8");
  const entries: CatalogEntry[] = [];

  const cCallRe =
    /c\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*\n?\s*"([^"]+)"\s*,\s*\n?\s*"([^"]+)"\s*,\s*\n?\s*\[([^\]]+)\]\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = cCallRe.exec(src)) !== null) {
    const [, name, slug, category, description, whenToUse, kwRaw] = m;
    const keywords = kwRaw
      .split(",")
      .map((k) => k.trim().replace(/^"|"$/g, ""));
    entries.push({
      name, slug, category, description, keywords, whenToUse,
      filePath: `${category}/${slug}.tsx`,
      propsInterface: `${name}Props`,
    });
  }

  const litRe =
    /\{\s*name:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"\s*,\s*\n?\s*description:\s*"([^"]+)"\s*,\s*\n?\s*whenToUse:\s*"([^"]+)"\s*,\s*\n?\s*filePath:\s*"([^"]+)"\s*,\s*propsInterface:\s*"([^"]+)"\s*,\s*\n?\s*keywords:\s*\[([^\]]+)\]\s*\}/g;
  while ((m = litRe.exec(src)) !== null) {
    const [, name, slug, category, description, whenToUse, filePath, propsInterface, kwRaw] = m;
    const keywords = kwRaw
      .split(",")
      .map((k) => k.trim().replace(/^"|"$/g, ""));
    entries.push({
      name, slug, category, description, keywords, whenToUse,
      filePath, propsInterface,
    });
  }

  return entries;
}

// ── extract props from source ──────────────────────────────────────
export interface PropInfo {
  name: string;
  type: string;
  optional: boolean;
  description: string;
  defaultValue: string;
}

export function extractProps(sourceFile: string, propsInterface: string): PropInfo[] {
  if (!fs.existsSync(sourceFile)) return [];
  const src = fs.readFileSync(sourceFile, "utf-8");

  // Find props interface/type
  const ifaceRe = new RegExp(
    `(?:export\\s+)?(?:interface|type)\\s+${escapeRe(propsInterface)}[^{]*\\{`,
    "s"
  );
  const ifaceStart = ifaceRe.exec(src);
  if (!ifaceStart) return [];

  // Extract balanced braces
  const startIdx = ifaceStart.index + ifaceStart[0].length;
  let depth = 1;
  let endIdx = startIdx;
  for (let i = startIdx; i < src.length && depth > 0; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") depth--;
    endIdx = i;
  }
  const body = src.slice(startIdx, endIdx);
  const props: PropInfo[] = [];

  // Parse props with JSDoc support
  // First, normalize: split lines with multiple props (separated by ;)
  const rawLines = body.split("\n");
  const lines: string[] = [];
  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    // Split on ; but only if followed by a prop declaration (word + optional ? + :)
    const parts = trimmed.split(/;\s*(?=\w+\??\s*:)/);
    for (const part of parts) {
      const p = part.trim();
      if (p) lines.push(p);
    }
  }
  let pendingDoc = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { pendingDoc = ""; continue; }

    // Collect JSDoc: /** ... */
    const jsdocInline = /\/\*\*\s*(.+?)\s*\*\//.exec(trimmed);
    if (jsdocInline && !trimmed.match(/^\w/)) {
      pendingDoc = jsdocInline[1];
      continue;
    }

    // Skip pure comment lines
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      const cmt = trimmed.replace(/^\/\*\*?\s*|\*\/\s*$|\*\s*/g, "").trim();
      if (cmt) pendingDoc = cmt;
      continue;
    }

    // Match prop line
    const propRe = /^(\w+)(\?)?:\s*(.+?)(?:;?\s*(?:\/\/\s*(.+))?$)/;
    const pm = propRe.exec(trimmed);
    if (!pm) { pendingDoc = ""; continue; }

    const [, propName, optMark, rawType, inlineComment] = pm;
    const optional = !!optMark;
    const type = rawType.replace(/\/\/.*$/, "").replace(/;$/, "").trim();

    // Description priority: JSDoc > inline comment > auto-generate
    let description = pendingDoc || inlineComment?.trim() || "";
    if (!description) {
      description = inferPropDescription(propName, type, optional);
    }

    // Try to find default value from destructuring
    const defaultValue = findDefault(src, propName, optional);

    props.push({ name: propName, type, optional, description, defaultValue });
    pendingDoc = "";
  }

  return props;
}

function findDefault(src: string, propName: string, optional: boolean): string {
  if (!optional) return "**required**";
  // Match: propName = value in destructuring
  const re = new RegExp(`${propName}\\s*=\\s*([^,}\\n]+)`);
  const m = re.exec(src);
  if (m) {
    let val = m[1].trim();
    if (val.endsWith(",")) val = val.slice(0, -1).trim();
    if (val.length > 40) return "\u2014"; // too complex
    return `\`${val}\``;
  }
  return "\u2014";
}

function inferPropDescription(name: string, type: string, optional: boolean): string {
  const map: Record<string, string> = {
    className: "Additional CSS classes",
    children: "Child elements",
    ariaLabel: "Accessible label for screen readers",
    "aria-label": "Accessible label for screen readers",
    onClick: "Click event handler",
    onChange: "Change event handler",
    onOpenChange: "Callback when open state changes",
    open: "Whether the component is open/visible",
    loading: "Show loading state",
    disabled: "Disable the component",
    animate: "Enable entry animation",
    showLegend: "Display the legend",
    editable: "Enable inline editing",
    title: "Title text",
    label: "Display label",
    value: "Current value",
    min: "Minimum value",
    max: "Maximum value",
    unit: "Unit suffix (e.g. \"%\", \"$\", \"km/h\")",
    size: "Size variant",
    variant: "Visual variant",
    tone: "Color tone variant",
    compact: "Use compact/dense layout",
    placeholder: "Placeholder text",
    searchable: "Enable search/filter",
    selectable: "Enable row selection",
    sortable: "Enable column sorting",
    refreshInterval: "Auto-refresh interval in milliseconds (0 = disabled)",
    maxVisible: "Maximum number of visible items",
    currency: "Currency symbol or code",
    height: "Component height in pixels",
    showValues: "Display numeric values on items",
    showGrid: "Display grid lines",
    stacked: "Use stacked layout",
    orientation: "Layout orientation",
    defaultOpen: "Whether initially open/expanded",
    collapsible: "Enable collapse/expand behavior",
  };
  if (map[name]) return map[name];

  // Pattern-based inference
  if (name.startsWith("on") && name.length > 2) return `Callback when ${name.slice(2).replace(/([A-Z])/g, " $1").toLowerCase().trim()}`;
  if (name.startsWith("show")) return `Whether to show ${name.slice(4).replace(/([A-Z])/g, " $1").toLowerCase().trim()}`;
  if (name.startsWith("enable")) return `Enable ${name.slice(6).replace(/([A-Z])/g, " $1").toLowerCase().trim()}`;
  if (name.startsWith("default")) return `Default value for ${name.slice(7).replace(/([A-Z])/g, " $1").toLowerCase().trim()}`;

  // Type-based
  if (type.includes("[]") || type.includes("Array")) return `Array of ${name}`;
  if (type === "boolean") return optional ? `Enable ${name.replace(/([A-Z])/g, " $1").toLowerCase().trim()}` : `Whether ${name.replace(/([A-Z])/g, " $1").toLowerCase().trim()} is active`;
  if (type === "string") return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")} text`;
  if (type === "number") return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")} value`;

  return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")}`;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── curated example data ───────────────────────────────────────────
// For components with complex required props, provide realistic sample data.
import { CURATED_EXAMPLES } from "./curated-examples";


// ── accessibility notes ────────────────────────────────────────────

import { a11yNotes, generateExample, propsTable, generateMdx, isManuallyEdited, main } from "./doc-generators";

export { a11yNotes, generateExample, propsTable, generateMdx, isManuallyEdited };

main();
