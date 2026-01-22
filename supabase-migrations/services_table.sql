-- Migration: Create services table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all services
CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin users to manage services
CREATE POLICY "Allow authenticated admin to insert services"
  ON services
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update services"
  ON services
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete services"
  ON services
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample data (optional - you can remove this after testing)
INSERT INTO services (title, description, icon) VALUES
(
  'Web Development',
  'Custom web applications built with modern technologies like React, Next.js, and TypeScript. We create scalable, performant solutions tailored to your business needs.',
  'Code'
),
(
  'UI/UX Design',
  'User-centered design that combines aesthetics with functionality. We create intuitive interfaces that enhance user experience and drive engagement.',
  'Design'
),
(
  'Cloud Deployment',
  'Reliable cloud infrastructure setup and deployment. We ensure your applications are scalable, secure, and performant on platforms like AWS, Vercel, and more.',
  'Cloud'
);
