-- Migration: Create projects table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  tech_stack TEXT[],
  live_url TEXT,
  github_url TEXT,
  gallery_images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all projects
CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin users to manage projects
CREATE POLICY "Allow authenticated admin to insert projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update projects"
  ON projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete projects"
  ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample data (optional - you can remove this after testing)
INSERT INTO projects (title, description, category, tech_stack, live_url, github_url) VALUES
(
  'E-Commerce Platform',
  'A modern e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built for scalability and performance.',
  'Web App',
  ARRAY['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
  'https://example.com',
  'https://github.com/example/ecommerce'
),
(
  'SaaS Dashboard',
  'A comprehensive SaaS dashboard with analytics, user management, and subscription handling. Features real-time data visualization and reporting.',
  'Web App',
  ARRAY['React', 'Node.js', 'MongoDB', 'Chart.js'],
  'https://example.com',
  'https://github.com/example/saas-dashboard'
),
(
  'Mobile App Backend',
  'RESTful API backend for a mobile application with authentication, file uploads, and real-time notifications. Built with Node.js and PostgreSQL.',
  'Backend',
  ARRAY['Node.js', 'Express', 'PostgreSQL', 'Redis', 'AWS S3'],
  NULL,
  'https://github.com/example/mobile-backend'
);
