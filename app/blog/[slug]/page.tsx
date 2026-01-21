import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, ArrowLeft, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseClient } from '@/lib/supabase/client';
import { BlogPostStructuredData } from '@/components/structured-data';
import { RelatedPosts } from '@/components/blog/related-posts';
import { SocialShare } from '@/components/blog/social-share';
import { ViewTracker } from '@/components/blog/view-tracker';
import { ViewCount } from '@/components/blog/view-count';
import { calculateReadingTime } from '@/lib/reading-time';
import { COMPANY_NAME } from '@/constants/company';
import type { BlogPost } from '@/types/content';

export const revalidate = 120;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug) as BlogPost | null;

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author],
      images: post.image_url ? [post.image_url] : [`${siteUrl}/logo.png`],
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [`${siteUrl}/logo.png`],
    },
  };
}

async function getBlogPost(slug: string) {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return data;
}

async function getAllBlogPosts() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return data ?? [];
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPost(resolvedParams.slug),
    getAllBlogPosts(),
  ]) as [BlogPost | null, BlogPost[]];

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <>
      <ViewTracker slug={post.slug} />
      {post.published_at && (
        <BlogPostStructuredData
          title={post.title}
          description={post.excerpt}
          author={post.author}
          publishedAt={post.published_at}
          image={post.image_url || undefined}
          slug={post.slug}
        />
      )}
      <div className="pb-16 pt-12 md:pt-16">
        <div className="mx-auto w-full max-w-4xl px-6">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <article className="space-y-8">
          {post.category && (
            <span className="inline-block text-sm font-semibold text-primary">
              {post.category}
            </span>
          )}

          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {post.title}
            </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              {post.view_count !== undefined && post.view_count !== null && (
                <ViewCount
                  initialCount={post.view_count || 0}
                  slug={post.slug}
                  className="text-sm text-muted-foreground"
                />
              )}
            </div>
          </header>

          {post.image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <Card className="border-border/70 bg-card/80 p-8">
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <SocialShare title={post.title} slug={post.slug} />
          </Card>

          <RelatedPosts
            currentPostSlug={post.slug}
            currentCategory={post.category}
            posts={allPosts}
          />
          </article>
        </div>
      </div>
    </>
  );
}
