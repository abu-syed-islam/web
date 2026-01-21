import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/content";

interface RelatedPostsProps {
  currentPostSlug: string;
  currentCategory: string | null;
  posts: BlogPost[];
  limit?: number;
}

export function RelatedPosts({
  currentPostSlug,
  currentCategory,
  posts,
  limit = 3,
}: RelatedPostsProps) {
  const relatedPosts = posts
    .filter(
      (post) =>
        post.slug !== currentPostSlug &&
        post.status === "published" &&
        (currentCategory ? post.category === currentCategory : true)
    )
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold">Related Posts</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Card
            key={post.id}
            className="group border-border/70 bg-card/80 transition hover:border-primary/40 hover:shadow-lg"
          >
            <CardHeader>
              {post.category && (
                <span className="mb-2 inline-block text-xs font-semibold text-primary">
                  {post.category}
                </span>
              )}
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Read more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
