import { notFound } from 'next/navigation';
import { ServiceForm } from '@/components/admin/service-form';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { Service } from '@/types/content';

async function getService(id: string): Promise<Service | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Service;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.id);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground mt-1">
          Update the service details.
        </p>
      </div>
      <ServiceForm service={service} isEdit />
    </div>
  );
}
