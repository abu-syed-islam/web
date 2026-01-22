import { notFound } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { VideoForm } from '@/components/admin/video-form';
import type { Video } from '@/types/content';

async function getVideo(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Video;
}

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideo(id);

  if (!video) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Video</h1>
        <p className="text-muted-foreground mt-1">
          Update video details.
        </p>
      </div>

      <VideoForm video={video} />
    </div>
  );
}
