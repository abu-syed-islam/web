import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { Project } from '@/types/content';

async function getProject(id: string): Promise<Project | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Project;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground mt-1">
          Update the project details.
        </p>
      </div>
      <ProjectForm project={project} isEdit />
    </div>
  );
}
