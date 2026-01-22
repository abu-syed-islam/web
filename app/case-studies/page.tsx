import { CaseStudyCard } from '@/components/case-studies/case-study-card';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { CaseStudy } from '@/types/content';
import type { Metadata } from 'next';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Explore our detailed case studies showcasing successful projects and client collaborations.',
};

async function getCaseStudies() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold text-primary">Case Studies</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Our Work
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore detailed case studies of our successful projects and client collaborations.
          </p>
        </div>

        {caseStudies.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No case studies available yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy as CaseStudy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
