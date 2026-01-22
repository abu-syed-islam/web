import { TeamForm } from '@/components/admin/team-form';

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add Team Member</h1>
        <p className="text-muted-foreground mt-1">
          Add a new team member to your website.
        </p>
      </div>
      <TeamForm />
    </div>
  );
}
