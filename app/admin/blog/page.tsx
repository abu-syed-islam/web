import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus } from 'lucide-react';
import { BlogListItem } from '@/components/admin/blog-list-item';
import type { BlogPost } from '@/types/content';

export const revalidate = 0; // Disable caching for admin pages

async function getAllBlogPosts() {
  const supabase = getSupabaseAdminClient();
  
  // Get all posts (including drafts) for admin
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return data as BlogPost[];
}

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts, create new content, and update existing posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No blog posts yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first blog post. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
