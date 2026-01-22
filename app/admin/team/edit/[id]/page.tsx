import { notFound } from 'next/navigation';
import { TeamForm } from '@/components/admin/team-form';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { TeamMember } from '@/types/content';

async function getTeamMember(id: string): Promise<TeamMember | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as TeamMember;
}

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const member = await getTeamMember(resolvedParams.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Team Member</h1>
        <p className="text-muted-foreground mt-1">
          Update the team member details.
        </p>
      </div>
      <TeamForm member={member} isEdit />
    </div>
  );
}
