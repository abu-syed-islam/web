-- Migration: Create team table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on display_order and is_active for sorting
CREATE INDEX IF NOT EXISTS idx_team_display_order ON team(display_order);
CREATE INDEX IF NOT EXISTS idx_team_is_active ON team(is_active);

-- Enable Row Level Security
ALTER TABLE team ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active team members
CREATE POLICY "Allow public read access to active team"
  ON team
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated admin users to manage team
CREATE POLICY "Allow authenticated admin to insert team"
  ON team
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update team"
  ON team
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete team"
  ON team
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample data (optional - you can remove this after testing)
INSERT INTO team (name, role, bio, email, github_url, linkedin_url, display_order, is_active) VALUES
(
  'Alex Morgan',
  'Lead Developer',
  'Full-stack engineer with 10+ years of experience building scalable web applications. Passionate about clean code and modern technologies.',
  'alex@example.com',
  '#',
  '#',
  1,
  true
),
(
  'Sarah Chen',
  'UX Designer',
  'Creative designer focused on creating intuitive user experiences. Specializes in design systems and accessibility.',
  'sarah@example.com',
  '#',
  '#',
  2,
  true
),
(
  'Mike Johnson',
  'DevOps Engineer',
  'Cloud infrastructure expert with deep knowledge in AWS, containerization, and CI/CD pipelines. Ensures reliable and scalable deployments.',
  'mike@example.com',
  '#',
  '#',
  3,
  true
),
(
  'Emily Davis',
  'Project Manager',
  'Experienced project manager who ensures smooth delivery and communication. Bridges the gap between technical teams and clients.',
  'emily@example.com',
  NULL,
  '#',
  4,
  true
);
