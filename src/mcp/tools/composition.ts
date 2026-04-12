/**
 * MCP tools: get_composition, get_theme_tokens
 */
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface Composition {
  name: string;
  components: string[];
  description: string;
  example: string;
}

const COMPOSITIONS: Composition[] = [
  {
    name: 'Ops Cockpit',
    components: ['MnGauge', 'MnDashboardStrip', 'MnSystemStatus', 'MnHeatmap', 'MnActivityFeed'],
    description: 'Operations monitoring cockpit with Ferrari Luce-inspired gauges, dashboard strip, service health, resource heatmap, and live activity.',
    example: 'See /showcase/cockpit for a full working example with all gauge complications (arcBar, subDials, crosshair, multigraph).',
  },
  {
    name: 'Executive Dashboard',
    components: ['MnDashboardStrip', 'MnChart', 'MnDataTable', 'MnBadge', 'MnSectionCard'],
    description: 'C-suite view with KPI strip, trend charts, and decision board.',
    example: 'Use MnDashboardStrip for metrics, MnChart type="area" for trends, MnDataTable for tabular summaries.',
  },
  {
    name: 'Agent Mesh',
    components: ['MnBrain3D', 'MnInstrumentBinnacle', 'MnChat', 'MnActiveMissions', 'MnAgentTrace'],
    description: 'Agentic AI orchestration view with 3D neural topology, mission tracking, and agent chat.',
    example: 'MnBrain3D for topology, MnInstrumentBinnacle for operational binnacle, MnChat for agent interaction.',
  },
  {
    name: 'CRUD Page',
    components: ['MnDataTable', 'MnDetailPanel', 'MnBadge', 'MnEmptyState', 'MnSectionCard'],
    description: 'Standard list-detail page with searchable table, detail slide-over, and empty state.',
    example: 'MnDataTable with onRowClick → MnDetailPanel. Wrap in MnSectionCard.',
  },
  {
    name: 'Financial Overview',
    components: ['MnDashboardStrip', 'MnWaterfall', 'MnFunnel', 'MnChart', 'MnTreemap'],
    description: 'FinOps dashboard with cost waterfall, funnel, and breakdown treemap.',
    example: 'MnWaterfall for cost flow, MnFunnel for conversion, MnTreemap for allocation.',
  },
  {
    name: 'Strategy Board',
    components: ['MnBcgMatrix', 'MnSwotAnalysis', 'MnPorterForces', 'MnOkrTree', 'MnBusinessModelCanvas'],
    description: 'Strategic analysis suite with BCG matrix, SWOT, Porter forces, OKRs, and canvas.',
    example: 'Each component is self-contained. Combine in a grid layout within MnSectionCard.',
  },
];

const THEMES = [
  { key: 'navy', accent: '#FFC72C', surface: '#0d2045', text: '#fafafa', desc: 'Deep blue background with gold accent' },
  { key: 'dark', accent: '#FFC72C', surface: '#111111', text: '#fafafa', desc: 'Near-black background with gold accent' },
  { key: 'light', accent: '#DC0000', surface: '#FAF3E6', text: '#1a1a1a', desc: 'Warm ivory background with red accent' },
  { key: 'colorblind', accent: '#0072B2', surface: '#111111', text: '#fafafa', desc: 'Okabe-Ito safe palette with blue accent' },
];

export function registerCompositionTools(server: McpServer) {
  server.tool(
    'get_composition',
    'Get a recommended component composition for a use-case. Returns which Maranello components to combine and how.',
    { useCase: z.string().describe('Use-case description, e.g. "ops cockpit", "CRUD page", "executive dashboard"') },
    async ({ useCase }) => {
      const q = useCase.toLowerCase();
      const match = COMPOSITIONS.find((c) =>
        q.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().split(' ').every((w) => q.includes(w)),
      ) ?? COMPOSITIONS.find((c) =>
        c.components.some((comp) => q.includes(comp.toLowerCase().replace('mn', ''))) ||
        c.description.toLowerCase().split(' ').some((w) => w.length > 4 && q.includes(w)),
      );

      if (!match) {
        const names = COMPOSITIONS.map((c) => c.name).join(', ');
        return { content: [{ type: 'text', text: `No exact match for "${useCase}". Available compositions: ${names}.\n\nTry search_components for individual component lookup.` }] };
      }

      const text = [
        `# ${match.name}`,
        '', match.description, '',
        '## Components', match.components.map((c) => `- \`${c}\``).join('\n'),
        '', '## How to use', match.example,
      ].join('\n');
      return { content: [{ type: 'text', text }] };
    },
  );

  server.tool(
    'get_theme_tokens',
    'List available Maranello themes with their key color tokens.',
    {},
    async () => {
      const lines = THEMES.map((t) =>
        `**${t.key}**: accent \`${t.accent}\`, surface \`${t.surface}\`, text \`${t.text}\` — ${t.desc}`,
      );
      const text = [
        `4 themes available (set via \`data-theme\` on \`<html>\`):`,
        '', ...lines, '',
        'Use CSS custom properties: `var(--mn-accent)`, `var(--mn-surface)`, `var(--mn-text)`, etc.',
        'Canvas components: use `readPalette(el)` to resolve theme colors at render time.',
        'Never hardcode hex values in components.',
      ].join('\n');
      return { content: [{ type: 'text', text }] };
    },
  );
}
