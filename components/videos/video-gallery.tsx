"use client";

import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { VideoPlayer } from './video-player';
import { Button } from '@/components/ui/button';
import type { Video } from '@/types/content';

interface VideoGalleryProps {
  videos: Video[];
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const uniqueCategories = Array.from(
    new Set(videos.map((v) => v.category).filter((c): c is string => !!c))
  );

  const filteredVideos = selectedCategory
    ? videos.filter((v) => v.category === selectedCategory)
    : videos;

  const featuredVideos = videos.filter((v) => v.is_featured);
  const regularVideos = filteredVideos.filter((v) => !v.is_featured);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      {uniqueCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured Videos</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Videos */}
      {regularVideos.length > 0 && (
        <div className="space-y-4">
          {featuredVideos.length > 0 && <h2 className="text-2xl font-semibold">All Videos</h2>}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </div>
      )}

      {filteredVideos.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No videos found in this category.
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <VideoPlayer video={selectedVideo} autoplay className="bg-black" />
            <div className="mt-4 rounded-lg bg-white p-4 dark:bg-gray-900">
              <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
              {selectedVideo.description && (
                <p className="mt-2 text-muted-foreground">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
      onClick={onClick}
    >
      {video.thumbnail_url ? (
        <div className="relative aspect-video">
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
            <div className="rounded-full bg-white/90 p-4">
              <Play className="h-8 w-8 text-black" fill="currentColor" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video bg-muted flex items-center justify-center">
          <div className="rounded-full bg-primary/20 p-4">
            <Play className="h-8 w-8 text-primary" fill="currentColor" />
          </div>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold">{video.title}</h3>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {video.description}
          </p>
        )}
        {video.category && (
          <span className="mt-2 inline-block text-xs text-primary">{video.category}</span>
        )}
      </div>
    </div>
  );
}
