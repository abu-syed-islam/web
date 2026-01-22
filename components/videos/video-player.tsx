"use client";

import { getEmbedUrl } from '@/lib/video-utils';
import type { Video } from '@/types/content';

interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean;
  className?: string;
}

export function VideoPlayer({ video, autoplay = false, className = '' }: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(video.video_type, video.video_id);
  const autoplayParam = autoplay ? '?autoplay=1' : '';

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg ${className}`}>
      <iframe
        src={`${embedUrl}${autoplayParam}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
