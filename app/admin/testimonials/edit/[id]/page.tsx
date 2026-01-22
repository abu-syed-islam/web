import { notFound } from 'next/navigation';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/types/content';

async function getTestimonial(id: string): Promise<Testimonial | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Testimonial;
}

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const testimonial = await getTestimonial(resolvedParams.id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Testimonial</h1>
        <p className="text-muted-foreground mt-1">
          Update the testimonial details.
        </p>
      </div>
      <TestimonialForm testimonial={testimonial} isEdit />
    </div>
  );
}
