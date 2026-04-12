// MDX generation functions for component documentation.
import * as fs from "node:fs";
import * as path from "node:path";
import type { CatalogEntry, PropInfo } from "./generate-component-docs";
import { CURATED_EXAMPLES } from "./curated-examples";
import { extractProps, FORCE, COMPONENTS_DIR, DOCS_DIR, parseCatalog } from "./generate-component-docs";

export function a11yNotes(entry: CatalogEntry): string {
  const notes: string[] = [];
  const cat = entry.category;
  const slug = entry.slug;

  if (cat === "forms") {
    notes.push("- Form controls are associated with labels via `htmlFor`/`id`");
    notes.push("- Validation errors are announced to screen readers");
    notes.push("- Supports keyboard navigation between fields");
  } else if (cat === "navigation") {
    notes.push("- Implements `aria-current` for active navigation items");
    notes.push("- Full keyboard navigation support with arrow keys");
  } else if (cat === "feedback") {
    notes.push("- Uses `role=\"alert\"` or `aria-live` regions for dynamic content");
    notes.push("- Focus is managed when content appears/disappears");
  } else if (cat === "data-display") {
    notes.push("- Color is not the only indicator \u2014 text or icons provide meaning");
    notes.push("- Interactive elements are keyboard accessible");
  } else if (cat === "data-viz") {
    notes.push("- Charts include `aria-label` describing the data trend");
    notes.push("- Color is supplemented with labels for color-blind users");
  } else if (cat === "layout") {
    notes.push("- Uses semantic landmarks (`<main>`, `<nav>`, `<aside>`)");
    notes.push("- Skip-to-content link is supported");
  } else if (cat === "network") {
    notes.push("- Interactive nodes are keyboard focusable");
    notes.push("- Status information uses `aria-live` for updates");
  } else if (cat === "ops") {
    notes.push("- Data tables include proper `<th>` scope attributes");
    notes.push("- Drag-and-drop has keyboard alternatives");
  } else if (cat === "strategy") {
    notes.push("- Matrix cells are keyboard navigable");
    notes.push("- Visual data is supplemented with text descriptions");
  } else if (cat === "theme") {
    notes.push("- Theme changes are announced via `aria-live`");
    notes.push("- All controls meet WCAG 2.2 AA contrast requirements");
  } else if (cat === "financial") {
    notes.push("- Monetary values use `aria-label` for screen reader clarity");
    notes.push("- Tables include proper header associations");
  } else if (cat === "agentic") {
    notes.push("- Status updates use `aria-live` for real-time announcements");
    notes.push("- Interactive elements support keyboard activation");
  }

  if (slug.includes("modal") || slug.includes("dialog")) {
    notes.push("- Focus is trapped inside the modal while open");
    notes.push("- Escape key closes the modal");
  }
  if (slug.includes("tab")) {
    notes.push("- Follows WAI-ARIA Tabs pattern (`role=\"tablist\"` / `role=\"tab\"`)");
  }
  if (slug.includes("toggle") || slug.includes("switch")) {
    notes.push("- Uses `role=\"switch\"` with `aria-checked` state");
  }

  return notes.join("\n");
}

// ── generate example code ──────────────────────────────────────────
export function generateExample(entry: CatalogEntry, props: PropInfo[]): string {
  // Use curated example if available
  if (CURATED_EXAMPLES[entry.slug]) {
    return CURATED_EXAMPLES[entry.slug];
  }

  // Auto-generate a reasonable example
  const { name } = entry;
  const required = props.filter((p) => !p.optional && p.name !== "className");
  const propsStr: string[] = [];

  for (const p of required) {
    if (p.type.includes("[]")) propsStr.push(`${p.name}={[]}`);
    else if (p.type === "string") propsStr.push(`${p.name}="Example"`);
    else if (p.type === "number") propsStr.push(`${p.name}={0}`);
    else if (p.type === "boolean") propsStr.push(`${p.name}`);
    else if (p.type.startsWith("(")) propsStr.push(`${p.name}={() => {}}`);
    else propsStr.push(`${p.name}={/* ${p.type} */}`);
  }

  // Add a couple optional flavor props
  const sizeProp = props.find((p) => p.name === "size" && p.optional);
  if (sizeProp) propsStr.push(`size="md"`);
  const animProp = props.find((p) => p.name === "animate" && p.optional);
  if (animProp) propsStr.push(`animate`);

  const ps = propsStr.length > 0 ? "\n  " + propsStr.join("\n  ") + "\n" : " ";

  return `import { ${name} } from "@/components/maranello"\n\n<${name}${ps}/>`;
}

// ── format props table ─────────────────────────────────────────────
export function propsTable(props: PropInfo[]): string {
  if (props.length === 0)
    return "_This component extends native HTML attributes. See source for full type details._\n";

  const lines: string[] = [
    "| Prop | Type | Default | Description |",
    "|------|------|---------|-------------|",
  ];

  for (const p of props) {
    const escapedType = p.type
      .replace(/\|/g, "\\|")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    lines.push(`| \`${p.name}\` | \`${escapedType}\` | ${p.defaultValue} | ${p.description} |`);
  }

  return lines.join("\n");
}

// ── generate .mdx content ──────────────────────────────────────────
export function generateMdx(entry: CatalogEntry, props: PropInfo[]): string {
  const kw = entry.keywords.map((k) => `"${k}"`).join(", ");

  return `---
title: ${entry.name}
category: ${entry.category}
description: "${entry.description}"
keywords: [${kw}]
---

# ${entry.name}

${entry.description}.

## When to use

${entry.whenToUse}.

## Props

${propsTable(props)}

## Example

\`\`\`tsx
${generateExample(entry, props)}
\`\`\`

## Accessibility

${a11yNotes(entry)}
`;
}

// ── check if a file was manually edited ────────────────────────────
export function isManuallyEdited(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf-8");
  // Manually edited files have multi-line examples, type annotations, etc.
  const codeBlocks = content.match(/```tsx[\s\S]*?```/g) || [];
  for (const block of codeBlocks) {
    const lines = block.split("\n").filter((l) => l.trim() && !l.startsWith("```"));
    if (lines.length > 5) return true; // More than 5 lines of code = manually edited
  }
  return false;
}

// ── main ───────────────────────────────────────────────────────────
export function main() {
  const entries = parseCatalog();
  console.log(`Parsed ${entries.length} catalog entries`);

  let generated = 0;
  let skipped = 0;
  let preserved = 0;

  for (const entry of entries) {
    const outDir = path.join(DOCS_DIR, entry.category);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${entry.slug}.mdx`);

    // Preserve manually edited files unless --force
    if (!FORCE && isManuallyEdited(outFile)) {
      console.log(`  ✓  Preserved (manually edited): ${entry.slug}.mdx`);
      preserved++;
      continue;
    }

    const sourceFile = path.join(COMPONENTS_DIR, entry.filePath);
    const props = extractProps(sourceFile, entry.propsInterface);

    if (!fs.existsSync(sourceFile)) {
      console.warn(`  ⚠  Source not found: ${entry.filePath}`);
      skipped++;
    }

    const mdx = generateMdx(entry, props);
    fs.writeFileSync(outFile, mdx, "utf-8");
    generated++;
  }

  console.log(`\n✅ Generated ${generated} .mdx files`);
  if (preserved > 0) console.log(`✓  Preserved ${preserved} manually edited files`);
  if (skipped > 0) console.log(`⚠  ${skipped} source files not found`);

  const count = fs
    .readdirSync(DOCS_DIR, { recursive: true })
    .filter((f) => String(f).endsWith(".mdx")).length;
  console.log(`📁 Total .mdx files in docs/components: ${count}`);
}

main();
