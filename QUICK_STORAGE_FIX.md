# Quick Fix: Storage RLS Policy Error

## Error Message
```
new row violates row-level security policy
```

## Problem
The storage bucket `blog-images` exists but the RLS policies are not set up correctly.

## Quick Fix (5 minutes)

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard** → **Storage** → **blog-images** bucket
2. Click on **"Policies"** tab
3. **Delete all existing policies** (if any)
4. Create these 4 policies:

#### Policy 1: Public Read
- Click **"New Policy"**
- **Name**: `Public read access`
- **Operation**: `SELECT`
- **Roles**: `public`
- **USING**: `bucket_id = 'blog-images'`
- **Save**

#### Policy 2: Authenticated Upload
- Click **"New Policy"**
- **Name**: `Authenticated upload`
- **Operation**: `INSERT`
- **Roles**: `authenticated`
- **WITH CHECK**: `bucket_id = 'blog-images'`
- **Save**

#### Policy 3: Authenticated Update
- Click **"New Policy"**
- **Name**: `Authenticated update`
- **Operation**: `UPDATE`
- **Roles**: `authenticated`
- **USING**: `bucket_id = 'blog-images'`
- **Save**

#### Policy 4: Authenticated Delete
- Click **"New Policy"**
- **Name**: `Authenticated delete`
- **Operation**: `DELETE`
- **Roles**: `authenticated`
- **USING**: `bucket_id = 'blog-images'`
- **Save**

### Option 2: Quick SQL (If you have access)

Run this in Supabase SQL Editor:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create policies (requires superuser or use Dashboard)
-- Note: If this fails, use Dashboard method above
```

## Verify It Works

1. Make sure you're **logged in** to admin panel
2. Go to **Create/Edit Blog Post**
3. Try uploading an image
4. Should work now! ✅

## Still Not Working?

1. **Check you're logged in**: Make sure you see your email in admin navbar
2. **Check bucket exists**: Go to Storage → Should see `blog-images` bucket
3. **Check bucket is public**: Bucket settings → "Public bucket" should be ✅
4. **Check policies**: Should see 4 policies in Policies tab
5. **Try logging out and back in**: Sometimes session needs refresh

## Common Issues

**"Bucket not found"**
- Create the bucket first (see STORAGE_SETUP.md)

**"Not authenticated"**
- Make sure you're logged in
- Check browser console for auth errors
- Try logging out and back in

**"Policy still not working"**
- Make sure policies target `authenticated` role (not `public`)
- Verify bucket name is exactly `blog-images`
- Check that you're using the correct Supabase project
