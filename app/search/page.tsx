"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, FileText, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getSupabaseClient } from "@/lib/supabase/client";

interface SearchResult {
  type: "blog" | "service" | "project";
  id: string;
  title: string;
  description: string;
  slug?: string;
  image_url?: string;
  url: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  async function performSearch(term: string) {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const supabase = getSupabaseClient();
    const searchLower = term.toLowerCase();

    try {
      const allResults: SearchResult[] = [];

      // Search blog posts
      const { data: blogPosts } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, image_url")
        .eq("status", "published");

      if (blogPosts) {
        blogPosts.forEach((post) => {
          if (
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower)
          ) {
            allResults.push({
              type: "blog",
              id: post.id,
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              image_url: post.image_url || undefined,
              url: `/blog/${post.slug}`,
            });
          }
        });
      }

      // Search services
      const { data: services } = await supabase
        .from("services")
        .select("id, title, description, icon");

      if (services) {
        services.forEach((service) => {
          if (
            service.title.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower)
          ) {
            allResults.push({
              type: "service",
              id: service.id,
              title: service.title,
              description: service.description,
              url: "/services",
            });
          }
        });
      }

      // Search projects
      const { data: projects } = await supabase
        .from("projects")
        .select("id, title, description, image_url");

      if (projects) {
        projects.forEach((project) => {
          if (
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower)
          ) {
            allResults.push({
              type: "project",
              id: project.id,
              title: project.title,
              description: project.description,
              image_url: project.image_url || undefined,
              url: `/portfolio/${project.id}`,
            });
          }
        });
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "blog":
        return FileText;
      case "service":
        return Sparkles;
      case "project":
        return Briefcase;
      default:
        return FileText;
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "blog":
        return "Blog Post";
      case "service":
        return "Service";
      case "project":
        return "Project";
      default:
        return "Result";
    }
  }

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Search</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blog posts, services, and portfolio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {query && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : results.length > 0 ? (
                <>
                  Found <strong>{results.length}</strong> result{results.length !== 1 ? "s" : ""} for{" "}
                  <strong>&quot;{query}&quot;</strong>
                </>
              ) : (
                <>
                  No results found for <strong>&quot;{query}&quot;</strong>
                </>
              )}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => {
            const Icon = getTypeIcon(result.type);
            return (
              <Card
                key={`${result.type}-${result.id}`}
                className="group border-border/70 bg-card/80 transition hover:border-primary/40 hover:shadow-lg"
              >
                <Link href={result.url}>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                      {result.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.image_url && (
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        <Image
                          src={result.image_url}
                          alt={result.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>

        {!query && (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter a search term to find blog posts, services, and portfolio projects.
            </p>
          </div>
        )}

        {query && !isLoading && results.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
            <p className="mb-2 font-semibold">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try different keywords or check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
