import { ResourceForm } from '@/components/admin/resource-form';

export default function NewResourcePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Resource</h1>
        <p className="text-muted-foreground mt-1">
          Add a new downloadable resource to the resources page.
        </p>
      </div>

      <ResourceForm />
    </div>
  );
}
