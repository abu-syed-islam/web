import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types/content';

export const revalidate = 120;

async function getBlogPosts() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('id,slug,title,excerpt,author,published_at,category,image_url')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return data ?? [];
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-12 space-y-3">
          <p className="text-sm font-semibold text-primary">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Latest Articles
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Insights, tutorials, and updates on web development, design, and
            technology.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden border-border/70 bg-card/80 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {post.image_url ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-secondary/10" />
              )}
              <CardHeader>
                {post.category && (
                  <span className="mb-2 inline-block text-xs font-semibold text-primary">
                    {post.category}
                  </span>
                )}
                <h2 className="text-xl font-semibold leading-tight">
                  {post.title}
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{post.author}</span>
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.published_at}>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    )}
                  </div>
                </div>
                <Button asChild variant="ghost" className="w-full group/btn">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center justify-center gap-2"
                  >
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-12 text-center">
            <p className="text-muted-foreground">
              No blog posts available yet. Check back soon for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
