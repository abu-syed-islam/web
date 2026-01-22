-- Migration: Create storage bucket for resources
-- Run this SQL in your Supabase SQL Editor

-- Create the resources storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources',
  'resources',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/zip']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to resources
CREATE POLICY "Allow public read access to resources"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resources');

-- Policy: Allow authenticated admin users to upload resources
CREATE POLICY "Allow authenticated admin to upload resources"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'resources' AND
    auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated admin users to update resources
CREATE POLICY "Allow authenticated admin to update resources"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'resources' AND
    auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated admin users to delete resources
CREATE POLICY "Allow authenticated admin to delete resources"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'resources' AND
    auth.role() = 'authenticated'
  );
