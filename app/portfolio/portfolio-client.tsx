"use client";

import { useState, useMemo } from "react";
import ProjectsPreview from "@/components/sections/projects-preview";
import { ClientFilters } from "@/app/portfolio/client-filters";
import type { Project } from "@/types/content";

interface PortfolioClientProps {
  projects: Project[];
  categories: string[];
}

export function PortfolioClient({ projects, categories }: PortfolioClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === null || project.category === selectedCategory;

      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tech_stack &&
          project.tech_stack.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6">
      <ClientFilters
        categories={categories}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {filteredProjects.length > 0 ? (
        <ProjectsPreview projects={filteredProjects} />
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            No projects found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
