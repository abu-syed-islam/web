"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { parseVideoUrl } from '@/lib/video-utils';
import type { Video } from '@/types/content';

interface VideoFormProps {
  video?: Video;
}

export function VideoForm({ video }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<{ type: string | null; id: string | null } | null>(null);

  const [formData, setFormData] = useState({
    title: video?.title || '',
    video_url: video?.video_url || '',
    description: video?.description || '',
    category: video?.category || '',
    duration: video?.duration?.toString() || '',
    display_order: video?.display_order?.toString() || '0',
    is_featured: video?.is_featured || false,
  });

  const handleVideoUrlChange = (url: string) => {
    setFormData({ ...formData, video_url: url });
    const info = parseVideoUrl(url);
    setVideoInfo(info);
    if (!info.type || !info.id) {
      setError('Invalid video URL. Please provide a valid YouTube or Vimeo URL.');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseAdminClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You are not logged in. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      if (!videoInfo?.type || !videoInfo?.id) {
        setError('Please provide a valid YouTube or Vimeo URL.');
        setIsSubmitting(false);
        return;
      }

      const url = video ? `/api/admin/videos/${video.id}` : '/api/admin/videos';
      const method = video ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          display_order: parseInt(formData.display_order) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save video');
      }

      router.push('/admin/videos');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" type="button">
          <Link href="/admin/videos" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Videos
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : video ? 'Update Video' : 'Add Video'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {videoInfo && videoInfo.type && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-800 dark:text-green-400">
          ✓ Detected {videoInfo.type} video (ID: {videoInfo.id})
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Video title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">Video URL (YouTube or Vimeo) *</Label>
            <Input
              id="video_url"
              type="url"
              value={formData.video_url}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              required
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
            />
            <p className="text-xs text-muted-foreground">
              Enter a YouTube or Vimeo URL. The video ID and thumbnail will be extracted automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Video description"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Tutorial, Showcase, Demo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 300"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_featured">Featured</Label>
              <div className="flex items-center gap-2">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Mark as featured video
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
