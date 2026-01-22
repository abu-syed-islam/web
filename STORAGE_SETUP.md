# Supabase Storage Setup Guide

## Problem
The SQL migration for storage policies cannot be run directly because it requires superuser privileges to create policies on `storage.objects`.

## Solution: Manual Setup via Supabase Dashboard

### Step 1: Create the Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** (left sidebar)
3. Click **"New bucket"**
4. Fill in the details:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ **Yes** (check this box)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

After creating the bucket, go to the **Policies** tab for the `blog-images` bucket.

#### Policy 1: Public Read Access
- Click **"New Policy"**
- **Policy name**: `Public read access for blog images`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'blog-images'`
- Click **"Save policy"**

#### Policy 2: Authenticated Upload
- Click **"New Policy"**
- **Policy name**: `Authenticated users can upload blog images`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `bucket_id = 'blog-images'`
- Click **"Save policy"**

#### Policy 3: Authenticated Update
- Click **"New Policy"**
- **Policy name**: `Authenticated users can update blog images`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'blog-images'`
- Click **"Save policy"**

#### Policy 4: Authenticated Delete
- Click **"New Policy"**
- **Policy name**: `Authenticated users can delete blog images`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'blog-images'`
- Click **"Save policy"**

### Alternative: Use SQL (If You Have Superuser Access)

If you have superuser access to your Supabase database, you can run this SQL:

```sql
-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
```

Then set up policies via the Dashboard as described above.

## Verification

After setup, test by:
1. Logging into admin panel
2. Creating a new blog post
3. Uploading an image
4. Verifying the image appears in the Storage bucket
5. Checking that the image URL works on the frontend

## Troubleshooting

**Error: "Bucket not found"**
- Make sure the bucket name is exactly `blog-images`
- Check that the bucket was created successfully

**Error: "Permission denied"**
- Verify all 4 policies are created
- Check that you're logged in as an authenticated user
- Ensure policies target the correct roles (`public` for read, `authenticated` for write)

**Error: "File too large"**
- Check file size is under 5MB
- Verify bucket file size limit is set to 5242880

**Images not showing on frontend**
- Check that the bucket is set to **Public**
- Verify the image URL is correct
- Check Next.js image configuration in `next.config.ts`
