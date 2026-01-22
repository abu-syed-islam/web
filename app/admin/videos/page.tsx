import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import type { Video } from '@/types/content';

export const revalidate = 0;

async function getAllVideos() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data as Video[];
}

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Videos</h1>
          <p className="text-muted-foreground mt-1">
            Manage video gallery, create new videos, and update existing ones.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Video
          </Link>
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No videos yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first video. Click the button above to begin.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              {video.thumbnail_url ? (
                <div className="relative h-48 w-full">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-12 w-12 text-white" fill="currentColor" />
                  </div>
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-muted">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    {video.is_featured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase">{video.video_type}</span>
                    {video.category && (
                      <>
                        <span>•</span>
                        <span>{video.category}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/videos/edit/${video.id}`} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={`/api/admin/videos/${video.id}`} method="DELETE" className="inline">
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
