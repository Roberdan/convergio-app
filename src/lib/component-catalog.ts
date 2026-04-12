// Maranello component catalog — public API
// Data is split into component-catalog-data.ts to keep this file lean.

import { CATALOG } from "./component-catalog-data";

export type { CatalogEntry } from "./component-catalog-data";
export { CATALOG } from "./component-catalog-data";

// ---------------------------------------------------------------------------
// Search helpers
// ---------------------------------------------------------------------------

/** Returns true when every character of `query` appears in `text` in order. */
function fuzzyMatch(text: string, query: string): boolean {
  let qi = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

/**
 * Search the catalog with combined substring + fuzzy matching.
 * Results are sorted by relevance (highest first).
 */
export function searchCatalog(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [...CATALOG];

  const terms = q.split(/\s+/);

  return CATALOG
    .map((entry) => {
      const fields = [
        entry.name, entry.slug, entry.category,
        entry.description, entry.whenToUse, ...entry.keywords,
      ].join(" ").toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (entry.name.toLowerCase().includes(term)) score += 4;
        else if (entry.slug.includes(term)) score += 3;
        else if (entry.keywords.some((k) => k.toLowerCase() === term)) score += 3;
        else if (entry.keywords.some((k) => k.toLowerCase().includes(term))) score += 2;
        else if (fields.includes(term)) score += 1;
        else if (fuzzyMatch(fields, term)) score += 0.5;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);
}
