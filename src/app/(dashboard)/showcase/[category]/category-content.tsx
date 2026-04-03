'use client';

import { ShowcaseAgentic } from '../showcase-agentic';
import { ShowcaseDataViz } from '../showcase-dataviz';
import { ShowcaseNetwork } from '../showcase-network';
import { ShowcaseStrategy } from '../showcase-strategy';
import { ShowcaseFinancial } from '../showcase-financial';
import { ShowcaseUtilities } from '../showcase-utilities';
import { ShowcaseInteractive } from '../showcase-interactive';
import { ShowcaseAdvanced } from '../showcase-advanced';

const SECTION_MAP: Record<string, React.ComponentType> = {
  agentic: ShowcaseAgentic,
  'data-display': ShowcaseInteractive,
  'data-viz': ShowcaseDataViz,
  feedback: ShowcaseInteractive,
  financial: ShowcaseFinancial,
  forms: ShowcaseUtilities,
  layout: ShowcaseAdvanced,
  navigation: ShowcaseUtilities,
  network: ShowcaseNetwork,
  ops: ShowcaseAdvanced,
  strategy: ShowcaseStrategy,
  theme: ShowcaseAdvanced,
};

/** Renders the appropriate showcase section for a given category slug. */
export function CategoryContent({ slug }: { slug: string }) {
  const Section = SECTION_MAP[slug];
  if (!Section) return null;
  return <Section />;
}
