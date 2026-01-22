import { notFound } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { CaseStudyForm } from '@/components/admin/case-study-form';
import type { CaseStudy } from '@/types/content';

async function getCaseStudy(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CaseStudy;
}

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseStudy = await getCaseStudy(id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Case Study</h1>
        <p className="text-muted-foreground mt-1">
          Update case study details.
        </p>
      </div>

      <CaseStudyForm caseStudy={caseStudy} />
    </div>
  );
}
