import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { CaseStudy } from '@/types/content';

export const revalidate = 0;

async function getAllCaseStudies() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }

  return data as CaseStudy[];
}

export default async function AdminCaseStudiesPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground mt-1">
            Manage case studies, create new ones, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/case-studies/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Case Study
          </Link>
        </Button>
      </div>

      {caseStudies.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No case studies yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first case study. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <Card key={caseStudy.id} className="overflow-hidden">
              {caseStudy.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={caseStudy.image_url}
                    alt={caseStudy.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{caseStudy.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      caseStudy.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {caseStudy.status}
                    </span>
                  </div>
                  {caseStudy.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {caseStudy.excerpt}
                    </p>
                  )}
                  {caseStudy.client_name && (
                    <p className="text-xs text-primary mt-2">{caseStudy.client_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/case-studies/edit/${caseStudy.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/case-studies/${caseStudy.id}`} method="DELETE" className="inline">
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
