"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Calendar } from 'lucide-react';
import type { BlogPost } from '@/types/content';

interface BlogListItemProps {
  post: BlogPost;
}

export function BlogListItem({ post }: BlogListItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post. Please try again.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the post.');
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {post.image_url ? (
              <div className="relative h-24 w-40 overflow-hidden rounded-md bg-muted">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-40 rounded-md bg-gradient-to-br from-primary/10 to-secondary/10" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/admin/blog/edit/${post.id}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {post.excerpt}
                </p>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap ${getStatusColor(post.status)}`}>
                {post.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {post.category && (
                <span className="font-medium text-primary">{post.category}</span>
              )}
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.published_at).toLocaleDateString()}
                </div>
              )}
              {post.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.view_count.toLocaleString()} views
                </div>
              )}
              <span>by {post.author}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/blog/edit/${post.id}`} className="gap-2">
                  <Edit className="h-3 w-3" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              {post.status === 'published' && (
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/blog/${post.slug}`} target="_blank" className="gap-2">
                    <Eye className="h-3 w-3" />
                    View
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
