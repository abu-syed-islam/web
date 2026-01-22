import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { TeamMember } from '@/types/content';

export const revalidate = 0;

async function getAllTeamMembers() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data as TeamMember[];
}

export default async function AdminTeamPage() {
  const teamMembers = await getAllTeamMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members, create new members, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/team/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No team members yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first team member. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {member.bio}
                  </p>
                  {!member.is_active && (
                    <span className="inline-block mt-2 text-xs font-medium text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/team/edit/${member.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/team/${member.id}`} method="DELETE" className="inline">
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
