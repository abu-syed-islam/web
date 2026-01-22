import { BlogForm } from '@/components/admin/blog-form';

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to create a new blog post.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
