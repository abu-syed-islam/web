import { notFound } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { ResourceForm } from '@/components/admin/resource-form';
import type { Resource } from '@/types/content';

async function getResource(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Resource;
}

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getResource(id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Resource</h1>
        <p className="text-muted-foreground mt-1">
          Update resource details.
        </p>
      </div>

      <ResourceForm resource={resource} />
    </div>
  );
}
