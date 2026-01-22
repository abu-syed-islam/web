import { ServiceForm } from '@/components/admin/service-form';

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create New Service</h1>
        <p className="text-muted-foreground mt-1">
          Add a new service to your website.
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
