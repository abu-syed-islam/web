import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { CaseStudy } from '@/types/content';
import type { Metadata } from 'next';
import { CaseStudyCard } from '@/components/case-studies/case-study-card';

export const revalidate = 120;

async function getCaseStudy(slug: string) {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data;
}

async function getRelatedCaseStudies(currentId: string, limit: number = 3) {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: caseStudy.title,
    description: caseStudy.excerpt || caseStudy.title,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const related = await getRelatedCaseStudies(caseStudy.id);

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <article className="mx-auto w-full max-w-4xl px-6">
        {/* Hero Section */}
        <div className="mb-12">
          {caseStudy.client_name && (
            <p className="text-sm font-semibold text-primary">{caseStudy.client_name}</p>
          )}
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {caseStudy.title}
          </h1>
          {caseStudy.excerpt && (
            <p className="mt-4 text-xl text-muted-foreground">{caseStudy.excerpt}</p>
          )}
        </div>

        {/* Featured Image */}
        {caseStudy.image_url && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={caseStudy.image_url}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Client Logo */}
        {caseStudy.client_logo_url && (
          <div className="mb-8 flex items-center gap-4">
            <div className="relative h-16 w-16">
              <Image
                src={caseStudy.client_logo_url}
                alt={caseStudy.client_name || 'Client logo'}
                fill
                className="object-contain"
              />
            </div>
            {caseStudy.client_name && (
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{caseStudy.client_name}</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {caseStudy.content && (
          <div
            className="prose prose-lg dark:prose-invert mb-12 max-w-none"
            dangerouslySetInnerHTML={{ __html: caseStudy.content }}
          />
        )}

        {/* Challenges */}
        {caseStudy.challenges && caseStudy.challenges.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Challenges</h2>
            <ul className="space-y-2">
              {caseStudy.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Solutions */}
        {caseStudy.solutions && caseStudy.solutions.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Solutions</h2>
            <ul className="space-y-2">
              {caseStudy.solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">•</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Results */}
        {caseStudy.results && caseStudy.results.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Results</h2>
            <ul className="space-y-2">
              {caseStudy.results.map((result, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">•</span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Metrics */}
        {caseStudy.metrics && Object.keys(caseStudy.metrics).length > 0 && (
          <section className="mb-12 rounded-lg border bg-muted/40 p-6">
            <h2 className="mb-4 text-2xl font-semibold">Key Metrics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(caseStudy.metrics).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-muted-foreground">{key}</p>
                  <p className="text-2xl font-semibold">{String(value)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack */}
        {caseStudy.tech_stack && caseStudy.tech_stack.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {caseStudy.gallery_images && caseStudy.gallery_images.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {caseStudy.gallery_images.map((imageUrl, index) => (
                <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={`${caseStudy.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Case Studies */}
        {related.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <h2 className="mb-8 text-2xl font-semibold">Related Case Studies</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedCaseStudy) => (
                <CaseStudyCard key={relatedCaseStudy.id} caseStudy={relatedCaseStudy as CaseStudy} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
