/**
 * MCP tools: search_components, list_categories
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CATALOG, type CatalogEntry } from '../../lib/component-catalog-data';

const CATEGORIES = [...new Set(CATALOG.map((e) => e.category))].sort();

function fuzzyMatch(text: string, query: string): boolean {
  let qi = 0;
  for (let i = 0; i < text.length && qi < query.length; i++) {
    if (text[i] === query[qi]) qi++;
  }
  return qi === query.length;
}

function search(query: string): CatalogEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [...CATALOG];
  const terms = q.split(/\s+/);
  return CATALOG
    .map((entry) => {
      const fields = [entry.name, entry.slug, entry.category, entry.description, entry.whenToUse, ...entry.keywords].join(' ').toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (entry.name.toLowerCase().includes(term)) score += 4;
        else if (entry.slug.includes(term)) score += 3;
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

function formatEntry(e: CatalogEntry): string {
  return `**${e.name}** (\`${e.slug}\`) — ${e.category}\n${e.description}\nWhen to use: ${e.whenToUse}\nProps: \`${e.propsInterface}\` | File: \`src/components/maranello/${e.filePath}\``;
}

export function registerSearchTools(server: McpServer) {
  server.tool(
    'search_components',
    'Search the Maranello component catalog by name, category, or use-case keyword. Returns matching components sorted by relevance.',
    { query: z.string().describe('Search query — component name, category, or use-case description') },
    async ({ query }) => {
      const results = search(query).slice(0, 15);
      if (!results.length) return { content: [{ type: 'text', text: `No components found for "${query}". Try broader terms.` }] };
      const text = `Found ${results.length} components:\n\n${results.map(formatEntry).join('\n\n')}`;
      return { content: [{ type: 'text', text }] };
    },
  );

  server.tool(
    'list_categories',
    'List all component categories with component counts.',
    {},
    async () => {
      const lines = CATEGORIES.map((cat) => {
        const count = CATALOG.filter((e) => e.category === cat).length;
        const names = CATALOG.filter((e) => e.category === cat).map((e) => e.name).join(', ');
        return `**${cat}** (${count}): ${names}`;
      });
      return { content: [{ type: 'text', text: `${CATALOG.length} components in ${CATEGORIES.length} categories:\n\n${lines.join('\n')}` }] };
    },
  );
}
