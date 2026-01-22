import { TestimonialForm } from '@/components/admin/testimonial-form';

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create New Testimonial</h1>
        <p className="text-muted-foreground mt-1">
          Add a new client testimonial.
        </p>
      </div>
      <TestimonialForm />
    </div>
  );
}
