import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, ArrowLeft, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { BlogPostStructuredData } from '@/components/structured-data';
import { RelatedPosts } from '@/components/blog/related-posts';
import { SocialShare } from '@/components/blog/social-share';
import { ViewTracker } from '@/components/blog/view-tracker';
import { ViewCount } from '@/components/blog/view-count';
import { TableOfContents } from '@/components/blog/table-of-contents';
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
      <div className="pb-16 pt-12 md:pt-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Button asChild variant="ghost" className="mb-8 -ml-2">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
            {/* Main Content */}
            <article className="min-w-0">
              {/* Header */}
              <header className="mb-8 space-y-4">
                {post.category && (
                  <span className="inline-block text-sm font-semibold text-primary">
                    {post.category}
                  </span>
                )}
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
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

              {/* Featured Image */}
              {post.image_url && (
                <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-p:leading-relaxed prose-p:text-foreground prose-p:my-6 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/50 prose-blockquote:my-6 prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:leading-relaxed prose-img:rounded-lg prose-img:my-8 prose-hr:my-8">
                <div
                  data-blog-content
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Social Share */}
              <div className="mt-12 pt-8">
                <SocialShare title={post.title} slug={post.slug} />
              </div>

              {/* Related Posts */}
              <div className="mt-16">
                <RelatedPosts
                  currentPostSlug={post.slug}
                  currentCategory={post.category}
                  posts={allPosts}
                />
              </div>
            </article>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-120px)]">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
