import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project, CaseStudy } from "@/types/content";

type Props = {
  projects: Project[];
  showViewAll?: boolean;
  caseStudies?: CaseStudy[];
};

export default function ProjectsPreview({ projects, showViewAll, caseStudies = [] }: Props) {
  // Create a map of project_id to case study for quick lookup
  const caseStudyMap = new Map<string, CaseStudy>();
  caseStudies.forEach((cs) => {
    if (cs.project_id) {
      caseStudyMap.set(cs.project_id, cs);
    }
  });

  return (
    <section className="w-full px-6 py-12 md:py-16" id="projects">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary">Recent work</p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Projects we&apos;ve delivered
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Production-grade software shipped with reliable performance,
              accessible design systems, and cloud-native architectures.
            </p>
          </div>
          {showViewAll && (
            <Button asChild variant="outline">
              <Link href="/portfolio" className="flex items-center gap-2">
                View portfolio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No projects are published yet. Add rows to the{" "}
              <code className="mx-1 rounded bg-muted px-1 py-0.5">projects</code>{" "}
              table in Supabase to showcase your work.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => {
              const linkedCaseStudy = caseStudyMap.get(project.id);
              const displayUrl = project.gif_url || project.image_url;
              
              return (
                <Card key={project.id} className="group overflow-hidden border-border/70 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-premium h-full">
                  <Link href={`/portfolio/${project.id}`} className="block">
                    <div className="relative h-52 w-full overflow-hidden bg-muted">
                      {displayUrl ? (
                        project.gif_url ? (
                          <img
                            src={project.gif_url}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Image
                            src={project.image_url!}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                          />
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center gap-2 text-muted-foreground">
                          <ImageOff className="h-5 w-5" />
                          <span className="text-sm">Image coming soon</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {linkedCaseStudy && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                            <BookOpen className="h-3 w-3" />
                            Case Study
                          </span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors duration-200">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      {linkedCaseStudy ? (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                          <Link
                            href={`/case-studies/${linkedCaseStudy.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/case-studies/${linkedCaseStudy.slug}`;
                            }}
                            className="flex items-center gap-2"
                          >
                            View case study <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                          View project <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
