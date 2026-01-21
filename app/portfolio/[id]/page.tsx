import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSupabaseClient } from '@/lib/supabase/client';

export const revalidate = 120;

async function getProject(id: string) {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  return data;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  // In a real app, you might have additional fields like:
  // tech_stack, challenges, solutions, gallery_images, live_url, etc.
  // For now, we'll work with the existing structure

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/portfolio" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>

        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-xl text-muted-foreground">
                {project.description}
              </p>
            )}
            {project.created_at && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time dateTime={project.created_at}>
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
          </header>

          {/* Featured Image */}
          {project.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Project Details */}
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    This project showcases our expertise in building modern,
                    scalable web applications. Through careful planning, iterative
                    development, and close collaboration, we delivered a solution
                    that exceeded expectations.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    The project involved comprehensive design work, full-stack
                    development, and deployment to production. We maintained high
                    code quality standards throughout the development process and
                    ensured optimal performance and accessibility.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Responsive design optimized for all devices',
                      'Fast page load times and optimized performance',
                      'Accessible user interface meeting WCAG standards',
                      'Scalable architecture for future growth',
                      'Modern tech stack for maintainability',
                    ].map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.created_at && (
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Launch Date
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Category
                    </p>
                    <p className="text-sm text-muted-foreground">Web Development</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Status
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/80">
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(
                      (tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full" size="lg">
                <Link href="/contact">
                  Start Your Project
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
