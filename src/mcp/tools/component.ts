/**
 * MCP tool: get_component — full details for a single component
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CATALOG, type CatalogEntry } from '../../lib/component-catalog-data';

export function registerComponentTool(server: McpServer) {
  server.tool(
    'get_component',
    'Get full details for a Maranello component by name or slug. Returns props interface, when to use, file path, and example usage.',
    { name: z.string().describe('Component name (e.g. "MnGauge") or slug (e.g. "mn-gauge")') },
    async ({ name }) => {
      const q = name.toLowerCase().replace(/^mn-?/, '');
      const entry = CATALOG.find((e) =>
        e.name.toLowerCase() === name.toLowerCase() ||
        e.slug === name.toLowerCase() ||
        e.slug === `mn-${q}` ||
        e.name.toLowerCase() === `mn${q}`,
      );

      if (!entry) {
        const suggestions = CATALOG
          .filter((e) => e.name.toLowerCase().includes(q) || e.slug.includes(q))
          .slice(0, 5)
          .map((e) => e.name);
        return {
          content: [{ type: 'text', text: `Component "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(', ')}?` : ''}` }],
        };
      }

      const example = buildExample(entry);
      const text = [
        `# ${entry.name}`,
        `**Category:** ${entry.category}`,
        `**Slug:** \`${entry.slug}\``,
        `**File:** \`src/components/maranello/${entry.filePath}\``,
        `**Props:** \`${entry.propsInterface}\``,
        '',
        `## Description`,
        entry.description,
        '',
        `## When to Use`,
        entry.whenToUse,
        '',
        `## Keywords`,
        entry.keywords.join(', '),
        '',
        `## Example`,
        '```tsx',
        example,
        '```',
      ].join('\n');

      return { content: [{ type: 'text', text }] };
    },
  );
}

function buildExample(entry: CatalogEntry): string {
  const imp = `import { ${entry.name} } from '@/components/maranello';`;
  switch (entry.slug) {
    case 'mn-gauge': return `${imp}\n\n<${entry.name} value={78} max={100} unit="%" label="Throughput"\n  startAngle={-225} endAngle={45} ticks={10} subticks={5}\n  numbers={[0,25,50,75,100]} color="#FFC72C" size="md" />`;
    case 'mn-dashboard-strip': return `${imp}\n\n<${entry.name}\n  metrics={[{ label: 'OPS', value: 92, trend: 'up' }]}\n  zones={[{ type: 'pipeline', title: 'Flow', rows: [{ label: 'Active', value: 42 }] }]}\n  ariaLabel="Metrics strip" />`;
    case 'mn-heatmap': return `${imp}\n\n<${entry.name}\n  data={[[{ label: 'Mon AM', value: 12 }, { label: 'Mon PM', value: 28 }]]}\n  showValues ariaLabel="Usage heatmap" />`;
    case 'mn-system-status': return `${imp}\n\n<${entry.name}\n  services={[{ id: 'api', name: 'API', status: 'operational', uptime: 99.9, latencyMs: 42 }]}\n  version="v1.0" environment="production" />`;
    default: return `${imp}\n\n<${entry.name} {/* see ${entry.propsInterface} */} />`;
  }
}
