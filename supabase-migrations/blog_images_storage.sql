-- Migration: Create Supabase Storage bucket for blog images
-- IMPORTANT: This SQL creates the bucket, but you need to set up policies via Supabase Dashboard
-- Run this SQL in your Supabase SQL Editor

-- Create storage bucket for blog images
-- Note: If bucket already exists, this will do nothing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true, -- Public bucket so images can be accessed via URL
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- IMPORTANT: Storage Policies Setup
-- ============================================
-- Due to permission restrictions, you need to set up storage policies manually:
--
-- Go to: Supabase Dashboard → Storage → blog-images → Policies
--
-- Create these 4 policies:
--
-- 1. Public Read Access:
--    Policy Name: "Public read access for blog images"
--    Allowed Operation: SELECT
--    Target Roles: public
--    USING Expression: bucket_id = 'blog-images'
--
-- 2. Authenticated Upload:
--    Policy Name: "Authenticated users can upload blog images"
--    Allowed Operation: INSERT
--    Target Roles: authenticated
--    WITH CHECK Expression: bucket_id = 'blog-images'
--
-- 3. Authenticated Update:
--    Policy Name: "Authenticated users can update blog images"
--    Allowed Operation: UPDATE
--    Target Roles: authenticated
--    USING Expression: bucket_id = 'blog-images'
--
-- 4. Authenticated Delete:
--    Policy Name: "Authenticated users can delete blog images"
--    Allowed Operation: DELETE
--    Target Roles: authenticated
--    USING Expression: bucket_id = 'blog-images'
--
-- ============================================
-- Alternative: Use Supabase Dashboard UI
-- ============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: blog-images
-- 4. Public: Yes
-- 5. File size limit: 5242880 (5MB)
-- 6. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif
-- 7. Click "Create bucket"
-- 8. Then add the 4 policies above via the Policies tab
