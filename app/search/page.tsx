"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, FileText, Briefcase, Sparkles, ArrowRight, Filter, X } from "lucide-react";
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
  category?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "all";
  const categoryFilter = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      performSearch(query, typeFilter, categoryFilter);
    }
    // Fetch categories
    async function fetchCategories() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published');
      
      const cats = new Set<string>();
      data?.forEach((post) => {
        if (post.category) {
          cats.add(post.category);
        }
      });
      setCategories(Array.from(cats).sort());
    }
    fetchCategories();
  }, [query, typeFilter, categoryFilter]);

  async function performSearch(term: string, type: string = "all", category: string = "all") {
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
      if (type === "all" || type === "blog") {
        let blogQuery = supabase
          .from("blog_posts")
          .select("id, slug, title, excerpt, image_url, category")
          .eq("status", "published");

        if (category !== "all") {
          blogQuery = blogQuery.eq("category", category);
        }

        const { data: blogPosts } = await blogQuery;

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
                category: post.category || undefined,
                url: `/blog/${post.slug}`,
              });
            }
          });
        }
      }

      // Search services
      if (type === "all" || type === "service") {
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
      }

      // Search projects
      if (type === "all" || type === "project") {
        let projectQuery = supabase
          .from("projects")
          .select("id, title, description, image_url, category");

        if (category !== "all") {
          projectQuery = projectQuery.eq("category", category);
        }

        const { data: projects } = await projectQuery;

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
                category: project.category || undefined,
                url: `/portfolio/${project.id}`,
              });
            }
          });
        }
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
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      router.push(`/search?${params.toString()}`);
    }
  }

  function handleFilterChange(filterType: string, value: string) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filterType === 'type') {
      params.set('type', value);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
    } else {
      params.set('category', value);
      if (typeFilter !== 'all') params.set('type', typeFilter);
    }
    router.push(`/search?${params.toString()}`);
  }

  function clearFilters() {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Filters */}
          {showFilters && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="blog">Blog Posts</option>
                      <option value="service">Services</option>
                      <option value="project">Projects</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Active Filters */}
          {(typeFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {typeFilter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('type', 'all')}
                >
                  Type: {typeFilter}
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
              {categoryFilter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('category', 'all')}
                >
                  Category: {categoryFilter}
                  <X className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          )}
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
