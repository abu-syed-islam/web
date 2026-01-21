import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/content";

type Props = {
  projects: Project[];
  showViewAll?: boolean;
};

export default function ProjectsPreview({ projects, showViewAll }: Props) {
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
            {projects.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.id}`}>
                <Card className="group overflow-hidden border-border/70 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg cursor-pointer h-full">
                  <div className="relative h-52 w-full overflow-hidden bg-muted">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center gap-2 text-muted-foreground">
                        <ImageOff className="h-5 w-5" />
                        <span className="text-sm">Image coming soon</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      View case study <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
