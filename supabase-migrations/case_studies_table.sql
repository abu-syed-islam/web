-- Migration: Create case_studies table for detailed project case studies
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_name TEXT,
  client_logo_url TEXT,
  image_url TEXT,
  gallery_images TEXT[],
  challenges TEXT[],
  solutions TEXT[],
  results TEXT[],
  metrics JSONB,
  tech_stack TEXT[],
  category TEXT,
  duration TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_project_id ON case_studies(project_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_published_at ON case_studies(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at ON case_studies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published case studies
CREATE POLICY "Allow public read access to published case studies"
  ON case_studies
  FOR SELECT
  USING (status = 'published');

-- Policy: Allow authenticated admin users to manage all case studies
CREATE POLICY "Allow authenticated admin to read all case studies"
  ON case_studies
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to insert case studies"
  ON case_studies
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update case studies"
  ON case_studies
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete case studies"
  ON case_studies
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_case_studies_updated_at();
