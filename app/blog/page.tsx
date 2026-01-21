import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
}

// Sample blog posts - in a real app, this would come from Supabase or CMS
const blogPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 14: A Complete Guide',
    excerpt:
      'Learn how to build modern web applications with Next.js 14, including App Router, Server Components, and best practices.',
    date: '2024-01-15',
    author: 'Alex Morgan',
    category: 'Development',
  },
  {
    slug: 'web-design-trends-2024',
    title: 'Web Design Trends to Watch in 2024',
    excerpt:
      'Explore the latest web design trends including dark mode, micro-interactions, and AI-powered user experiences.',
    date: '2024-01-10',
    author: 'Sarah Chen',
    category: 'Design',
  },
  {
    slug: 'optimizing-react-performance',
    title: 'Optimizing React Performance: Tips and Tricks',
    excerpt:
      'Discover proven strategies to improve your React application performance, from code splitting to memoization.',
    date: '2024-01-05',
    author: 'Mike Johnson',
    category: 'Development',
  },
  {
    slug: 'building-accessible-websites',
    title: 'Building Accessible Websites: A Developer\'s Guide',
    excerpt:
      'Learn how to create websites that are accessible to everyone, following WCAG guidelines and best practices.',
    date: '2023-12-28',
    author: 'Emily Davis',
    category: 'Accessibility',
  },
  {
    slug: 'cloud-deployment-strategies',
    title: 'Cloud Deployment Strategies for Modern Apps',
    excerpt:
      'Compare different cloud deployment strategies and learn when to use serverless, containers, or traditional hosting.',
    date: '2023-12-20',
    author: 'Mike Johnson',
    category: 'DevOps',
  },
  {
    slug: 'css-modern-features',
    title: 'Modern CSS Features You Should Know',
    excerpt:
      'Explore cutting-edge CSS features including container queries, :has() selector, and native nesting.',
    date: '2023-12-15',
    author: 'Sarah Chen',
    category: 'Development',
  },
];

export default function BlogPage() {
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
              {post.image ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image}
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
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
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
