-- Migration: Create testimonials table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on featured and display_order for sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to all testimonials
CREATE POLICY "Allow public read access to testimonials"
  ON testimonials
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated admin users to manage testimonials
CREATE POLICY "Allow authenticated admin to insert testimonials"
  ON testimonials
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update testimonials"
  ON testimonials
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete testimonials"
  ON testimonials
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample data (optional - you can remove this after testing)
INSERT INTO testimonials (name, role, company, content, rating, featured, display_order) VALUES
(
  'Sarah Johnson',
  'CEO',
  'TechStart Inc.',
  'Working with Flinkeo transformed our online presence. Their team delivered a beautiful, performant website that exceeded our expectations. The attention to detail and communication throughout the project was exceptional.',
  5,
  true,
  1
),
(
  'Michael Chen',
  'Product Manager',
  'InnovateLabs',
  'The development team at Flinkeo is incredibly skilled. They built our web application quickly without compromising on quality. The codebase is clean, well-documented, and maintainable.',
  5,
  true,
  2
),
(
  'Emily Rodriguez',
  'Founder',
  'GreenTech Solutions',
  'Flinkeo helped us launch our e-commerce platform ahead of schedule. Their expertise in modern web technologies and user experience design is evident in every aspect of the final product.',
  5,
  true,
  3
),
(
  'David Park',
  'CTO',
  'DataFlow Systems',
  'We needed a complex dashboard with real-time data visualization. Flinkeo delivered a robust solution that our team and clients love. Their ongoing support has been invaluable.',
  5,
  true,
  4
);
