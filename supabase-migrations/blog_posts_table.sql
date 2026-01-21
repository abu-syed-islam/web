-- Migration: Create blog_posts table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  category TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Insert sample data (optional - you can remove this after testing)
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_at, category, status) VALUES
(
  'getting-started-with-nextjs',
  'Getting Started with Next.js 14: A Complete Guide',
  'Learn how to build modern web applications with Next.js 14, including App Router, Server Components, and best practices.',
  '<p>Next.js 14 represents a significant leap forward in React framework capabilities, introducing the App Router, Server Components, and numerous performance improvements. This guide will help you get started with the latest version.</p><h2>Why Next.js 14?</h2><p>Next.js 14 brings several key improvements including better performance, improved developer experience, and enhanced TypeScript support. The new App Router provides a more intuitive file-based routing system.</p><h2>Installation</h2><p>To create a new Next.js project, run:</p><pre><code>npx create-next-app@latest my-app</code></pre><h2>Key Features</h2><ul><li>Server Components by default</li><li>Improved App Router</li><li>Enhanced TypeScript support</li><li>Better performance optimizations</li></ul><h2>Getting Started</h2><p>Once your project is set up, you can start building your application using the new App Router structure. The pages directory is replaced with the app directory for better organization and routing capabilities.</p>',
  'Alex Morgan',
  '2024-01-15',
  'Development',
  'published'
),
(
  'web-design-trends-2024',
  'Web Design Trends to Watch in 2024',
  'Explore the latest web design trends including dark mode, micro-interactions, and AI-powered user experiences.',
  '<p>The web design landscape continues to evolve rapidly. Here are the key trends shaping the industry in 2024.</p><h2>Dark Mode Everywhere</h2><p>Dark mode has become a standard expectation. Modern websites offer seamless theme switching with system preference detection.</p><h2>Micro-interactions</h2><p>Subtle animations and interactions enhance user experience and provide feedback for user actions.</p><h2>AI-Powered Experiences</h2><p>Artificial intelligence is being integrated into user interfaces, providing personalized experiences and intelligent automation.</p>',
  'Sarah Chen',
  '2024-01-10',
  'Design',
  'published'
),
(
  'optimizing-react-performance',
  'Optimizing React Performance: Tips and Tricks',
  'Discover proven strategies to improve your React application performance, from code splitting to memoization.',
  '<p>Performance optimization is crucial for creating smooth user experiences. Here are proven strategies for React applications.</p><h2>Code Splitting</h2><p>Implement code splitting to load only the necessary code for each route, reducing initial bundle size.</p><h2>Memoization</h2><p>Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.</p><h2>Lazy Loading</h2><p>Lazy load components and images to improve initial page load times.</p>',
  'Mike Johnson',
  '2024-01-05',
  'Development',
  'published'
),
(
  'building-accessible-websites',
  'Building Accessible Websites: A Developer''s Guide',
  'Learn how to create websites that are accessible to everyone, following WCAG guidelines and best practices.',
  '<p>Accessibility is a fundamental aspect of modern web development. This guide will help you create websites that everyone can use.</p><h2>Why Accessibility Matters</h2><p>Web accessibility ensures that people with disabilities can perceive, understand, navigate, and interact with the web.</p><h2>WCAG Guidelines</h2><p>Follow the Web Content Accessibility Guidelines (WCAG) to ensure your site meets accessibility standards.</p>',
  'Emily Davis',
  '2023-12-28',
  'Accessibility',
  'published'
),
(
  'cloud-deployment-strategies',
  'Cloud Deployment Strategies for Modern Apps',
  'Compare different cloud deployment strategies and learn when to use serverless, containers, or traditional hosting.',
  '<p>Choosing the right deployment strategy is crucial for your application''s success. Let''s explore different approaches.</p><h2>Serverless Architecture</h2><p>Serverless functions offer automatic scaling and pay-per-use pricing models.</p><h2>Container Deployment</h2><p>Containers provide consistency across environments and easier scaling.</p>',
  'Mike Johnson',
  '2023-12-20',
  'DevOps',
  'published'
),
(
  'css-modern-features',
  'Modern CSS Features You Should Know',
  'Explore cutting-edge CSS features including container queries, :has() selector, and native nesting.',
  '<p>Modern CSS brings powerful new features that simplify layout and styling challenges.</p><h2>Container Queries</h2><p>Container queries allow you to style elements based on their container''s size, not just the viewport.</p><h2>The :has() Selector</h2><p>The :has() selector enables powerful parent selection based on child elements.</p>',
  'Sarah Chen',
  '2023-12-15',
  'Development',
  'published'
);
