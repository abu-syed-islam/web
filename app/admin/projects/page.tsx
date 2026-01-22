import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Project } from '@/types/content';

export const revalidate = 0;

async function getAllProjects() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data as Project[];
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects, create new projects, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first project. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>
                  {project.category && (
                    <span className="inline-block mt-2 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/projects/edit/${project.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/projects/${project.id}`} method="DELETE" className="inline">
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
