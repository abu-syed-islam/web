import { ResourceCard } from '@/components/resources/resource-card';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Resource } from '@/types/content';
import type { Metadata } from 'next';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Resources & Downloads',
  description: 'Download our free resources, templates, and documents.',
};

async function getResources() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('resources')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function ResourcesPage() {
  const resources = await getResources();

  const featuredResources = resources.filter((r) => r.is_featured);
  const regularResources = resources.filter((r) => !r.is_featured);

  // Group by category
  const categories = Array.from(
    new Set(resources.map((r) => r.category).filter((c): c is string => !!c))
  );

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold text-primary">Resources</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Downloads & Resources
          </h1>
          <p className="text-lg text-muted-foreground">
            Download our free resources, templates, guides, and documents.
          </p>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-12 space-y-4">
            <h2 className="text-2xl font-semibold">Featured Resources</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource as Resource} />
              ))}
            </div>
          </div>
        )}

        {/* Resources by Category */}
        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryResources = regularResources.filter(
                (r) => r.category === category
              );
              if (categoryResources.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold">{category}</h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource as Resource} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource as Resource} />
            ))}
          </div>
        )}

        {resources.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No resources available yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
