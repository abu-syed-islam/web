-- Migration: Create leads table for contact form submissions
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget_range TEXT,
  file_urls TEXT[],
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  source TEXT DEFAULT 'contact_form',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on status and created_at for filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert (for contact form submissions)
CREATE POLICY "Allow public to submit leads"
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Don't allow public reads (privacy)
-- Only authenticated admin users should be able to read leads
CREATE POLICY "Allow authenticated admin to read leads"
  ON leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to update leads"
  ON leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated admin to delete leads"
  ON leads
  FOR DELETE
  USING (auth.role() = 'authenticated');
