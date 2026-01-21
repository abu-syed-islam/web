import HeroSection from "@/components/sections/hero";
import StatsSection from "@/components/sections/stats";
import ServicesPreview from "@/components/sections/services-preview";
import TechStackSection from "@/components/sections/tech-stack";
import ProjectsPreview from "@/components/sections/projects-preview";
import ClientLogosSection from "@/components/sections/client-logos";
import TestimonialsSection from "@/components/sections/testimonials";
import CTASection from "@/components/sections/cta";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Project, Service } from "@/types/content";

export const revalidate = 120;

async function getHomeData() {
  const supabase = getSupabaseClient();

  const [{ data: services }, { data: projects }] = await Promise.all([
    supabase
      .from("services")
      .select("id,title,description,icon,created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("projects")
      .select("id,title,description,image_url,created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    services: services ?? [],
    projects: projects ?? [],
  };
}

export default async function HomePage() {
  const { services, projects } = await getHomeData();

  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesPreview services={services as Service[]} showViewAll />
      <TechStackSection />
      <ProjectsPreview projects={projects as Project[]} showViewAll />
      <ClientLogosSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
