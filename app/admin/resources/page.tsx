import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2, FileText, Download } from 'lucide-react';
import type { Resource } from '@/types/content';

export const revalidate = 0;

async function getAllResources() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data as Resource[];
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminResourcesPage() {
  const resources = await getAllResources();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage downloadable resources, create new ones, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Resource
          </Link>
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No resources yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first resource. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    {resource.is_featured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {resource.file_type && (
                      <span className="uppercase">{resource.file_type}</span>
                    )}
                    {resource.file_size && (
                      <>
                        {resource.file_type && ' • '}
                        {formatFileSize(resource.file_size)}
                      </>
                    )}
                    {resource.download_count !== null && resource.download_count > 0 && (
                      <>
                        {' • '}
                        <Download className="h-3 w-3" />
                        {resource.download_count}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/resources/edit/${resource.id}`} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <form action={`/api/admin/resources/${resource.id}`} method="DELETE" className="inline">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
