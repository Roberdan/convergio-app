import Link from 'next/link';
import {
  CATEGORIES,
  TOTAL_COMPONENTS,
  TOTAL_CATEGORIES,
  TOTAL_THEMES,
} from './category-registry';
import { ShowcaseLandingClient } from './showcase-landing-client';

const STATS = [
  { label: 'Components', value: TOTAL_COMPONENTS },
  { label: 'Categories', value: TOTAL_CATEGORIES },
  { label: 'Themes', value: TOTAL_THEMES },
] as const;

export default function ShowcasePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Maranello <span className="text-primary">Design System</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A comprehensive React component library for building agentic AI platforms.
          Explore {TOTAL_COMPONENTS}+ production-ready components across {TOTAL_CATEGORIES} categories.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-card p-4 text-center"
          >
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/showcase/${cat.slug}`}
                className="group rounded-lg border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat.count} components
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Quick Preview</h2>
          <Link
            href="/showcase/themes"
            className="text-sm text-primary hover:underline"
          >
            Theme Playground →
          </Link>
        </div>
        <ShowcaseLandingClient />
      </section>
    </div>
  );
}
