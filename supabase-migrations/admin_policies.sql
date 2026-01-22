-- Migration: Add admin policies for blog_posts table
-- Run this SQL in your Supabase SQL Editor
-- This migration is idempotent - safe to run multiple times

-- Drop existing policies if they exist (to allow re-running this migration)
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read all blog posts" ON blog_posts;

-- Policy: Allow authenticated users (admins) to insert blog posts
CREATE POLICY "Authenticated users can insert blog posts"
ON blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to update blog posts
CREATE POLICY "Authenticated users can update blog posts"
ON blog_posts
FOR UPDATE
TO authenticated
USING (true);

-- Policy: Allow authenticated users (admins) to delete blog posts
CREATE POLICY "Authenticated users can delete blog posts"
ON blog_posts
FOR DELETE
TO authenticated
USING (true);

-- Policy: Allow authenticated users (admins) to read all blog posts (including drafts)
CREATE POLICY "Authenticated users can read all blog posts"
ON blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Note: The existing public read policy for published posts remains in place:
-- CREATE POLICY "Allow public read access to published posts"
-- ON blog_posts FOR SELECT
-- USING (status = 'published');

-- Add comment for documentation
COMMENT ON POLICY "Authenticated users can insert blog posts" ON blog_posts IS 
'Allows authenticated admin users to create new blog posts';

COMMENT ON POLICY "Authenticated users can update blog posts" ON blog_posts IS 
'Allows authenticated admin users to edit blog posts';

COMMENT ON POLICY "Authenticated users can delete blog posts" ON blog_posts IS 
'Allows authenticated admin users to delete blog posts';

COMMENT ON POLICY "Authenticated users can read all blog posts" ON blog_posts IS 
'Allows authenticated admin users to view all posts including drafts';
