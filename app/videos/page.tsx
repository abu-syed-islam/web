import { VideoGallery } from '@/components/videos/video-gallery';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Video } from '@/types/content';
import type { Metadata } from 'next';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Video Gallery',
  description: 'Watch our latest videos, tutorials, and project showcases.',
};

async function getVideos() {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  return data ?? [];
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold text-primary">Video Gallery</p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Our Videos
          </h1>
          <p className="text-lg text-muted-foreground">
            Watch our latest videos, tutorials, project showcases, and more.
          </p>
        </div>

        <VideoGallery videos={videos as Video[]} />
      </div>
    </div>
  );
}
