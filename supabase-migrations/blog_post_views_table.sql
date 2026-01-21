-- Migration: Create blog_post_views table for tracking individual views and rate limiting
-- Run this SQL in your Supabase SQL Editor

-- Create table to track individual views for analytics and rate limiting
CREATE TABLE IF NOT EXISTS blog_post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL REFERENCES blog_posts(slug) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_date DATE GENERATED ALWAYS AS ((viewed_at AT TIME ZONE 'UTC')::date) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate views from same IP per day
-- This enforces rate limiting: one view per IP per post per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_post_views_unique_daily 
ON blog_post_views(post_slug, ip_address, viewed_date);

-- Index for faster lookups by post_slug
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_slug 
ON blog_post_views(post_slug);

-- Index for faster lookups by viewed_at (for analytics)
CREATE INDEX IF NOT EXISTS idx_blog_post_views_viewed_at 
ON blog_post_views(viewed_at DESC);

-- Index for faster lookups by ip_address (for rate limiting checks)
CREATE INDEX IF NOT EXISTS idx_blog_post_views_ip_address 
ON blog_post_views(ip_address, viewed_at DESC);

-- Add comment for documentation
COMMENT ON TABLE blog_post_views IS 'Tracks individual blog post views for analytics and rate limiting';
COMMENT ON COLUMN blog_post_views.post_slug IS 'Slug of the blog post that was viewed';
COMMENT ON COLUMN blog_post_views.ip_address IS 'IP address of the viewer (for rate limiting)';
COMMENT ON COLUMN blog_post_views.user_agent IS 'User agent string of the viewer';
COMMENT ON COLUMN blog_post_views.viewed_at IS 'Timestamp when the view was recorded';
COMMENT ON COLUMN blog_post_views.viewed_date IS 'Date portion of viewed_at (UTC) for efficient rate limiting queries';

-- Drop existing functions if they exist (to handle signature changes)
DROP FUNCTION IF EXISTS has_viewed_today(TEXT, INET);
DROP FUNCTION IF EXISTS increment_blog_post_views(TEXT, INET, TEXT);
DROP FUNCTION IF EXISTS increment_blog_post_views(TEXT);

-- Function to check if a view from an IP already exists today
CREATE OR REPLACE FUNCTION has_viewed_today(post_slug_param TEXT, ip_address_param INET)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  view_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 
    FROM blog_post_views 
    WHERE post_slug = post_slug_param 
      AND ip_address = ip_address_param 
      AND viewed_date = CURRENT_DATE
  ) INTO view_exists;
  
  RETURN COALESCE(view_exists, FALSE);
END;
$$;

-- Update the increment function to check rate limits and track individual views
CREATE OR REPLACE FUNCTION increment_blog_post_views(
  post_slug_param TEXT,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
  already_viewed BOOLEAN;
BEGIN
  -- Check if this IP has already viewed this post today (rate limiting)
  IF ip_address_param IS NOT NULL THEN
    SELECT has_viewed_today(post_slug_param, ip_address_param) INTO already_viewed;
    
    IF already_viewed THEN
      -- Return current count without incrementing
      SELECT view_count INTO new_count
      FROM blog_posts
      WHERE slug = post_slug_param AND status = 'published';
      
      RETURN COALESCE(new_count, 0);
    END IF;
  END IF;

  -- Increment the view count
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE slug = post_slug_param AND status = 'published'
  RETURNING view_count INTO new_count;
  
  -- If increment was successful, record the individual view
  IF new_count IS NOT NULL AND ip_address_param IS NOT NULL THEN
    INSERT INTO blog_post_views (post_slug, ip_address, user_agent)
    VALUES (post_slug_param, ip_address_param, user_agent_param)
    ON CONFLICT DO NOTHING; -- Ignore if unique constraint violation (shouldn't happen, but safe)
  END IF;
  
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Add comment for the updated function
COMMENT ON FUNCTION increment_blog_post_views IS 'Increments blog post view count with IP-based rate limiting (1 view per IP per day)';
