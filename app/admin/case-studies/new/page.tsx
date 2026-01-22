import { CaseStudyForm } from '@/components/admin/case-study-form';

export default function NewCaseStudyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create Case Study</h1>
        <p className="text-muted-foreground mt-1">
          Create a new case study to showcase your work.
        </p>
      </div>

      <CaseStudyForm />
    </div>
  );
}
