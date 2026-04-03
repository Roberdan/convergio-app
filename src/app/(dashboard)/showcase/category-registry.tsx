import {
  Brain,
  Table,
  BarChart3,
  MessageSquare,
  DollarSign,
  FormInput,
  Layout,
  Navigation,
  Network,
  Settings,
  Target,
  Palette,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryMeta {
  slug: string;
  name: string;
  icon: LucideIcon;
  count: number;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'agentic',
    name: 'Agentic AI',
    icon: Brain,
    count: 7,
    description:
      'AI-powered components for agent orchestration, cognitive architectures, and mission tracking.',
  },
  {
    slug: 'data-display',
    name: 'Data Display',
    icon: Table,
    count: 12,
    description:
      'Tables, cards, badges, avatars, and rich data presentation components.',
  },
  {
    slug: 'data-viz',
    name: 'Data Visualization',
    icon: BarChart3,
    count: 14,
    description:
      'Charts, heatmaps, treemaps, gauges, and interactive data visualizations.',
  },
  {
    slug: 'feedback',
    name: 'Feedback',
    icon: MessageSquare,
    count: 6,
    description:
      'Toasts, modals, notifications, streaming text, and user feedback components.',
  },
  {
    slug: 'financial',
    name: 'Financial',
    icon: DollarSign,
    count: 2,
    description:
      'FinOps dashboards, cost breakdowns, timelines, and financial metric tracking.',
  },
  {
    slug: 'forms',
    name: 'Forms & Input',
    icon: FormInput,
    count: 11,
    description:
      'Form fields, date pickers, filters, toggles, voice input, and search components.',
  },
  {
    slug: 'layout',
    name: 'Layout',
    icon: Layout,
    count: 8,
    description:
      'Grid systems, section cards, admin shells, dashboards, and page structure.',
  },
  {
    slug: 'navigation',
    name: 'Navigation',
    icon: Navigation,
    count: 5,
    description:
      'Breadcrumbs, tabs, steppers, section nav, and command palette.',
  },
  {
    slug: 'network',
    name: 'Network',
    icon: Network,
    count: 10,
    description:
      'Mesh topologies, hub-spoke diagrams, deployment tables, and infrastructure views.',
  },
  {
    slug: 'ops',
    name: 'Operations',
    icon: Settings,
    count: 8,
    description:
      'Audit logs, binnacles, night jobs, Gantt charts, Kanban boards, and workbenches.',
  },
  {
    slug: 'strategy',
    name: 'Strategy',
    icon: Target,
    count: 11,
    description:
      'BCG matrices, SWOT analysis, Porter\'s forces, OKRs, and business model canvases.',
  },
  {
    slug: 'theme',
    name: 'Theme Controls',
    icon: Palette,
    count: 6,
    description:
      'Theme toggles, rotary controls, Ferrari-inspired switches, and accessibility tools.',
  },
];

export const TOTAL_COMPONENTS = CATEGORIES.reduce((s, c) => s + c.count, 0);
export const TOTAL_CATEGORIES = CATEGORIES.length;
export const TOTAL_THEMES = 4;

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
