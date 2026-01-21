import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
}

// Sample blog posts - in a real app, this would come from Supabase or CMS
const blogPosts: Record<string, BlogPost> = {
  'getting-started-with-nextjs': {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 14: A Complete Guide',
    content: `
      <p>Next.js 14 represents a significant leap forward in React framework capabilities, introducing the App Router, Server Components, and numerous performance improvements. This guide will help you get started with the latest version.</p>
      
      <h2>Why Next.js 14?</h2>
      <p>Next.js 14 brings several key improvements including better performance, improved developer experience, and enhanced TypeScript support. The new App Router provides a more intuitive file-based routing system.</p>
      
      <h2>Installation</h2>
      <p>To create a new Next.js project, run:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      
      <h2>Key Features</h2>
      <ul>
        <li>Server Components by default</li>
        <li>Improved App Router</li>
        <li>Enhanced TypeScript support</li>
        <li>Better performance optimizations</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Once your project is set up, you can start building your application using the new App Router structure. The pages directory is replaced with the app directory for better organization and routing capabilities.</p>
    `,
    date: '2024-01-15',
    author: 'Alex Morgan',
    category: 'Development',
  },
  'web-design-trends-2024': {
    slug: 'web-design-trends-2024',
    title: 'Web Design Trends to Watch in 2024',
    content: `
      <p>The web design landscape continues to evolve rapidly. Here are the key trends shaping the industry in 2024.</p>
      
      <h2>Dark Mode Everywhere</h2>
      <p>Dark mode has become a standard expectation. Modern websites offer seamless theme switching with system preference detection.</p>
      
      <h2>Micro-interactions</h2>
      <p>Subtle animations and interactions enhance user experience and provide feedback for user actions.</p>
      
      <h2>AI-Powered Experiences</h2>
      <p>Artificial intelligence is being integrated into user interfaces, providing personalized experiences and intelligent automation.</p>
    `,
    date: '2024-01-10',
    author: 'Sarah Chen',
    category: 'Design',
  },
  'optimizing-react-performance': {
    slug: 'optimizing-react-performance',
    title: 'Optimizing React Performance: Tips and Tricks',
    content: `
      <p>Performance optimization is crucial for creating smooth user experiences. Here are proven strategies for React applications.</p>
      
      <h2>Code Splitting</h2>
      <p>Implement code splitting to load only the necessary code for each route, reducing initial bundle size.</p>
      
      <h2>Memoization</h2>
      <p>Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.</p>
      
      <h2>Lazy Loading</h2>
      <p>Lazy load components and images to improve initial page load times.</p>
    `,
    date: '2024-01-05',
    author: 'Mike Johnson',
    category: 'Development',
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
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
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </header>

          {post.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.image}
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
          </Card>
        </article>
      </div>
    </div>
  );
}
