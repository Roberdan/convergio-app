import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getAllCategorySlugs } from '../category-registry';
import { CategoryContent } from './category-content';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const Icon = cat.icon;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Categories
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2.5 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{cat.name}</h1>
            <p className="text-muted-foreground mt-0.5">
              {cat.count} components · {cat.description}
            </p>
          </div>
        </div>
      </div>

      {/* Component demos */}
      <CategoryContent slug={category} />
    </div>
  );
}
