# Admin Blog Management System - Setup Guide

## Overview
A complete admin dashboard for managing blog posts with Supabase Storage integration for image uploads. All routes are protected with Supabase Authentication.

## 🚀 Quick Start

### 1. Run Database Migrations

Run these SQL files in your Supabase SQL Editor **in order**:

1. **`supabase-migrations/blog_images_storage.sql`**
   - Creates the `blog-images` storage bucket
   - Sets up storage policies (public read, authenticated write)

2. **`supabase-migrations/admin_policies.sql`**
   - Adds RLS policies for authenticated admin users
   - Allows admins to create, read, update, and delete posts

### 2. Create Admin User

In your Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Enter admin email and password
4. Click **"Create User"**

### 3. Access Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You'll be redirected to: `/admin/blog`

## 📁 File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Protected admin layout
│   ├── login/page.tsx          # Login page
│   └── blog/
│       ├── page.tsx            # Blog list dashboard
│       ├── new/page.tsx        # Create new post
│       └── edit/[id]/page.tsx  # Edit existing post
├── api/admin/blog/
│   ├── route.ts                # POST: Create post
│   └── [id]/route.ts           # PUT: Update, DELETE: Delete
components/admin/
├── admin-logout-button.tsx     # Logout button component
├── blog-form.tsx               # Reusable blog post form
├── blog-list-item.tsx          # Blog list item card
└── image-upload.tsx            # Image upload with drag & drop
lib/supabase/
├── auth.ts                     # Auth utilities
├── client.ts                   # Supabase clients
└── storage.ts                  # Image upload/delete functions
middleware.ts                   # Route protection
```

## 🎯 Features

### Admin Dashboard (`/admin/blog`)
- View all blog posts (including drafts)
- Status badges (Draft, Published, Archived)
- View count display
- Quick actions: Edit, Delete, View
- Create new post button

### Create/Edit Post Form
- **Title** - Auto-generates slug
- **Slug** - URL-friendly identifier
- **Excerpt** - Post summary
- **Content** - HTML editor
- **Image Upload** - Drag & drop or browse
  - Automatic upload to Supabase Storage
  - Image preview
  - Replace or remove image
  - Max size: 5MB
  - Formats: JPG, PNG, WebP, GIF
- **Author** - Author name
- **Category** - Optional category
- **Status** - Draft/Published/Archived
- **Published Date** - Auto-set for published posts

### Image Upload Features
- Drag and drop support
- Click to browse files
- Real-time upload progress
- Image preview with thumbnail
- Replace or remove uploaded images
- Automatic URL generation
- File validation (type & size)

## 🔒 Security

### Authentication
- All `/admin/*` routes protected by middleware
- Redirects to `/admin/login` if not authenticated
- Session persisted in localStorage
- Auto-refresh tokens

### Authorization
- RLS policies ensure only authenticated users can:
  - Create blog posts
  - Update blog posts
  - Delete blog posts
  - View draft posts
- Public users can only view published posts

### Storage Security
- Public read access (anyone can view images)
- Authenticated write access (only admins can upload)
- File type validation on client and server
- File size limit: 5MB

## 📝 Usage Examples

### Creating a Post
1. Go to `/admin/blog`
2. Click **"Create New Post"**
3. Fill in the form fields
4. Upload featured image (optional)
5. Select status (Draft/Published)
6. Click **"Create Post"**

### Uploading Images
1. In the form, find the "Featured Image" section
2. **Option 1**: Drag and drop an image
3. **Option 2**: Click "Choose File" to browse
4. Wait for upload to complete
5. Image URL is automatically set

### Editing a Post
1. Go to `/admin/blog`
2. Click **"Edit"** on any post
3. Make your changes
4. Click **"Update Post"**

### Deleting a Post
1. Go to `/admin/blog`
2. Click **"Delete"** on any post
3. Confirm deletion
4. Post and its views are removed

## 🔧 Configuration

### Environment Variables
Already configured in your project:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Storage Bucket
- **Name**: `blog-images`
- **Public**: Yes (for public URL access)
- **File size limit**: 5MB
- **Allowed types**: JPEG, JPG, PNG, WebP, GIF

## 🐛 Troubleshooting

### "Unauthorized" Error
- Ensure you're logged in
- Check if admin user exists in Supabase Auth
- Clear browser cache and try again

### Image Upload Fails
- Check file size (must be < 5MB)
- Verify file format (JPEG, PNG, WebP, GIF only)
- Ensure storage bucket migration was run
- Check Supabase Storage policies

### Cannot Create/Edit Posts
- Verify `admin_policies.sql` migration was run
- Check if RLS is enabled on `blog_posts` table
- Ensure you're authenticated

### Middleware Redirect Loop
- Clear browser cookies
- Check middleware.ts configuration
- Verify Supabase Auth is working

## 📊 Database Schema

### blog_posts Table
- `id` - UUID (Primary Key)
- `slug` - TEXT (Unique)
- `title` - TEXT
- `excerpt` - TEXT
- `content` - TEXT
- `author` - TEXT
- `published_at` - TIMESTAMPTZ
- `category` - TEXT
- `image_url` - TEXT (Supabase Storage URL)
- `status` - TEXT (draft/published/archived)
- `view_count` - INTEGER
- `created_at` - TIMESTAMPTZ
- `updated_at` - TIMESTAMPTZ

## 🎨 Customization

### Change Upload Limits
Edit `lib/supabase/storage.ts`:
```typescript
const maxSize = 10 * 1024 * 1024; // 10MB
```

### Add More File Types
Edit `lib/supabase/storage.ts`:
```typescript
const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
```

### Customize Form Fields
Edit `components/admin/blog-form.tsx` to add/remove fields.

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify all migrations were run
4. Ensure admin user is created

## ✅ Testing Checklist

- [ ] Run all SQL migrations
- [ ] Create admin user in Supabase
- [ ] Login at `/admin/login`
- [ ] Create a new post
- [ ] Upload an image
- [ ] Edit the post
- [ ] Change post status
- [ ] Delete the post
- [ ] Verify RLS policies work
- [ ] Test on mobile/tablet
- [ ] View published post on frontend

---

**Admin Dashboard URL**: `http://localhost:3000/admin/blog`
**Login URL**: `http://localhost:3000/admin/login`
