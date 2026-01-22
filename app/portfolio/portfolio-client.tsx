"use client";

import { useState, useMemo } from "react";
import ProjectsPreview from "@/components/sections/projects-preview";
import { CaseStudyCard } from "@/components/case-studies/case-study-card";
import { ClientFilters } from "@/app/portfolio/client-filters";
import type { Project, CaseStudy } from "@/types/content";

interface PortfolioClientProps {
  projects: Project[];
  caseStudies?: CaseStudy[];
  categories: string[];
}

export function PortfolioClient({ projects, caseStudies = [], categories }: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Combine projects and case studies for unified display
  const allItems = useMemo(() => {
    const projectItems = projects.map((p) => ({
      type: 'project' as const,
      id: p.id,
      title: p.title,
      description: p.description,
      image_url: p.image_url,
      gif_url: p.gif_url,
      category: p.category,
      tech_stack: p.tech_stack,
      created_at: p.created_at,
      data: p,
    }));

    const caseStudyItems = caseStudies.map((cs) => ({
      type: 'case_study' as const,
      id: cs.id,
      title: cs.title,
      description: cs.excerpt || cs.title,
      image_url: cs.image_url,
      category: cs.category || null,
      tech_stack: cs.tech_stack,
      created_at: cs.created_at,
      data: cs,
    }));

    return [...projectItems, ...caseStudyItems].sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return dateB - dateA;
    });
  }, [projects, caseStudies]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory;

      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tech_stack &&
          item.tech_stack.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });
  }, [allItems, selectedCategory, searchQuery]);

  const filteredProjects = filteredItems
    .filter((item) => item.type === 'project')
    .map((item) => item.data as Project);

  const filteredCaseStudies = filteredItems
    .filter((item) => item.type === 'case_study')
    .map((item) => item.data as CaseStudy);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6">
      <ClientFilters
        categories={categories}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {filteredItems.length > 0 ? (
        <div className="space-y-8">
          {/* Show projects if any */}
          {filteredProjects.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Projects</h2>
              <ProjectsPreview projects={filteredProjects} caseStudies={caseStudies} />
            </div>
          )}

          {/* Show case studies if any */}
          {filteredCaseStudies.length > 0 && (
            <div>
              <h2 className="mb-4 text-2xl font-semibold">Case Studies</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCaseStudies.map((caseStudy) => (
                  <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            No items found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
