-- Migration: Add gif_url column to projects table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS gif_url TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_gif_url ON projects(gif_url) WHERE gif_url IS NOT NULL;
