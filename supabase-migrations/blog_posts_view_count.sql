-- Migration: Add view_count column to blog_posts table
-- Run this SQL in your Supabase SQL Editor

-- Add view_count column with default value of 0
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- Update existing posts to have view_count = 0 (if any exist without the default)
UPDATE blog_posts 
SET view_count = 0 
WHERE view_count IS NULL;

-- Create index on view_count for faster sorting/filtering of popular posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.view_count IS 'Number of times this blog post has been viewed';

-- Create RPC function for atomic increment of view_count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug AND status = 'published'
  RETURNING view_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$;
