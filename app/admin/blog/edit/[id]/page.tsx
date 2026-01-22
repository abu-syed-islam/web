import { notFound } from 'next/navigation';
import { BlogForm } from '@/components/admin/blog-form';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types/content';

export const revalidate = 0; // Disable caching

async function getBlogPost(id: string): Promise<BlogPost | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BlogPost;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground mt-1">
          Update the details of your blog post.
        </p>
      </div>

      <BlogForm post={post} isEdit />
    </div>
  );
}
