import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Service } from '@/types/content';

export const revalidate = 0; // Disable caching for admin pages

async function getAllServices() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data as Service[];
}

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage your services, create new services, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Service
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No services yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first service. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/services/edit/${service.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/services/${service.id}`} method="DELETE" className="inline">
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
