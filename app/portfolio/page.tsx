import { PortfolioClient } from "@/app/portfolio/portfolio-client";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Project, CaseStudy } from "@/types/content";

export const revalidate = 120;

async function getProjects() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("projects")
    .select("id,title,description,image_url,gif_url,created_at,category,tech_stack,live_url,github_url")
    .order("created_at", { ascending: false });

  return data ?? [];
}

async function getCaseStudies() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("case_studies")
    .select("id,title,slug,excerpt,image_url,client_name,tech_stack,category,project_id,created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  return data ?? [];
}

async function getCategories() {
  const supabase = getSupabaseClient();
  
  // Get categories from both projects and case studies
  const [projectsData, caseStudiesData] = await Promise.all([
    supabase.from("projects").select("category"),
    supabase.from("case_studies").select("category").eq("status", "published"),
  ]);

  const categories = new Set<string>();
  
  projectsData.data?.forEach((project) => {
    if (project.category) {
      categories.add(project.category);
    }
  });

  caseStudiesData.data?.forEach((caseStudy) => {
    if (caseStudy.category) {
      categories.add(caseStudy.category);
    }
  });

  return Array.from(categories).sort();
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  const caseStudies = await getCaseStudies();
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

      <PortfolioClient 
        projects={projects as Project[]} 
        caseStudies={caseStudies as CaseStudy[]}
        categories={categories} 
      />
    </div>
  );
}
