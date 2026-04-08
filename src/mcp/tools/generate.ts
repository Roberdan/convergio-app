/**
 * MCP tools: generate_yaml_page, validate_yaml
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const BLOCK_TYPES = [
  'kpi-card', 'data-table', 'data-table-maranello', 'activity-feed',
  'stat-list', 'empty-state', 'ai-chat', 'gauge-block', 'chart-block',
  'gantt-block', 'kanban-block', 'funnel-block', 'hbar-block',
  'speedometer-block', 'map-block', 'okr-block', 'system-status-block',
] as const;

const CHART_TYPES = ['area', 'bar', 'line', 'sparkline', 'radar', 'donut', 'bubble'] as const;

export function registerGenerateTools(server: McpServer) {
  server.tool(
    'generate_yaml_page',
    'Generate a valid maranello.yaml page config from a natural-language description. Returns YAML you can paste into the pages: section.',
    { description: z.string().describe('Page description, e.g. "KPI dashboard with 3 metrics, a chart, and an activity feed"') },
    async ({ description }) => {
      const yaml = generatePage(description);
      return { content: [{ type: 'text', text: `\`\`\`yaml\n${yaml}\n\`\`\`\n\nPaste this under \`pages:\` in your \`maranello.yaml\`. Available block types: ${BLOCK_TYPES.join(', ')}` }] };
    },
  );

  server.tool(
    'list_block_types',
    'List all available YAML block types for page configuration.',
    {},
    async () => {
      const lines = BLOCK_TYPES.map((t) => `- \`${t}\`${blockDescription(t)}`);
      return { content: [{ type: 'text', text: `Available block types:\n\n${lines.join('\n')}\n\nChart subtypes: ${CHART_TYPES.join(', ')}` }] };
    },
  );
}

function blockDescription(type: string): string {
  const map: Record<string, string> = {
    'kpi-card': ' — single metric with label, value, change, trend',
    'data-table': ' — basic HTML table with columns and rows',
    'data-table-maranello': ' — rich MnDataTable with sorting, avatars, status badges',
    'activity-feed': ' — real-time event timeline',
    'stat-list': ' — vertical list of key-value stats',
    'empty-state': ' — placeholder with icon and message',
    'ai-chat': ' — AI chat panel with agent config',
    'gauge-block': ' — circular gauge with value/min/max',
    'chart-block': ' — recharts wrapper (area/bar/line/sparkline/radar/donut/bubble)',
    'gantt-block': ' — Gantt chart with tasks and dependencies',
    'kanban-block': ' — Kanban board with columns and cards',
    'funnel-block': ' — funnel visualization with stages',
    'hbar-block': ' — horizontal bar chart',
    'speedometer-block': ' — speedometer dial with ranges',
    'map-block': ' — geographic map with markers',
    'okr-block': ' — OKR tree with objectives and key results',
    'system-status-block': ' — service health dashboard',
  };
  return map[type] ?? '';
}

function generatePage(desc: string): string {
  const d = desc.toLowerCase();
  const blocks: string[] = [];
  let cols = 1;

  if (d.includes('kpi') || d.includes('metric')) {
    const n = parseInt(d.match(/(\d+)\s*(?:kpi|metric)/)?.[1] ?? '3', 10);
    cols = Math.min(n, 4);
    for (let i = 0; i < n; i++) {
      blocks.push(`          - { type: kpi-card, label: "Metric ${i + 1}", value: "—", trend: flat }`);
    }
  }

  const row1 = blocks.length ? `    rows:\n      - columns: ${cols}\n        blocks:\n${blocks.join('\n')}` : '    rows:';

  const extraRows: string[] = [];
  if (d.includes('chart') || d.includes('graph')) {
    const ct = CHART_TYPES.find((t) => d.includes(t)) ?? 'area';
    extraRows.push(`      - columns: 1\n        blocks:\n          - type: chart-block\n            chartType: ${ct}\n            labels: [Jan, Feb, Mar, Apr, May]\n            series:\n              - { label: Series 1, data: [10, 20, 15, 25, 30] }`);
  }
  if (d.includes('table')) extraRows.push(`      - columns: 1\n        blocks:\n          - type: data-table-maranello\n            endpoint: /api/data`);
  if (d.includes('activity') || d.includes('feed')) extraRows.push(`      - columns: 1\n        blocks:\n          - type: activity-feed\n            endpoint: /api/activity`);
  if (d.includes('gauge')) extraRows.push(`      - columns: 3\n        blocks:\n          - { type: gauge-block, label: Score, value: 78, min: 0, max: 100, unit: "%" }`);
  if (d.includes('status') || d.includes('health')) extraRows.push(`      - columns: 1\n        blocks:\n          - type: system-status-block\n            services: []`);
  if (d.includes('gantt')) extraRows.push(`      - columns: 1\n        blocks:\n          - type: gantt-block\n            tasks: []`);
  if (d.includes('kanban')) extraRows.push(`      - columns: 1\n        blocks:\n          - type: kanban-block\n            columns: [{ id: todo, title: To Do }, { id: doing, title: Doing }, { id: done, title: Done }]`);

  const title = desc.split(/[.!?]/)[0].trim().slice(0, 40);

  return `  /my-page:\n    title: "${title}"\n${row1}\n${extraRows.join('\n')}`;
}
