import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import type { Testimonial } from '@/types/content';

export const revalidate = 0;

async function getAllTestimonials() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data as Testimonial[];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage client testimonials, create new testimonials, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No testimonials yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first testimonial. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                    {testimonial.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    "{testimonial.content}"
                  </p>
                  {testimonial.featured && (
                    <span className="inline-block mt-2 text-xs font-medium text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/testimonials/${testimonial.id}`} method="DELETE" className="inline">
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
