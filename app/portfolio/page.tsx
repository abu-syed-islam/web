import { PortfolioClient } from "@/app/portfolio/portfolio-client";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Project } from "@/types/content";

export const revalidate = 120;

async function getProjects() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("id,title,description,image_url,created_at,category,tech_stack,live_url,github_url")
    .order("created_at", { ascending: false });

  return data ?? [];
}

async function getCategories() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("category");

  const categories = new Set<string>();
  data?.forEach((project) => {
    if (project.category) {
      categories.add(project.category);
    }
  });

  return Array.from(categories).sort();
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  const categories = await getCategories();

  return (
    <div className="space-y-6 pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="text-sm font-semibold text-primary">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Recent partnerships & launches
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Product launches, design systems, and platform upgrades delivered for
          SaaS teams and ambitious founders.
        </p>
      </div>

      <PortfolioClient projects={projects as Project[]} categories={categories} />
    </div>
  );
}
