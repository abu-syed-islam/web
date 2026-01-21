import { MetadataRoute } from "next";
import { getSupabaseClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic pages from Supabase
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = getSupabaseClient();

    // Blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("slug, published_at, updated_at")
      .eq("status", "published");

    if (blogPosts) {
      blogPosts.forEach((post) => {
        dynamicPages.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at
            ? new Date(post.updated_at)
            : post.published_at
              ? new Date(post.published_at)
              : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    }

    // Portfolio projects
    const { data: projects } = await supabase
      .from("projects")
      .select("id, created_at");

    if (projects) {
      projects.forEach((project) => {
        dynamicPages.push({
          url: `${baseUrl}/portfolio/${project.id}`,
          lastModified: project.created_at
            ? new Date(project.created_at)
            : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return [...staticPages, ...dynamicPages];
}
