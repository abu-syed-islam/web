/**
 * Utility functions for parsing and handling video URLs (YouTube/Vimeo)
 */

export type VideoInfo = {
  type: 'youtube' | 'vimeo' | null;
  id: string | null;
  thumbnailUrl: string | null;
};

/**
 * Extract video ID and type from YouTube or Vimeo URL
 */
export function parseVideoUrl(url: string): VideoInfo {
  if (!url) {
    return { type: null, id: null, thumbnailUrl: null };
  }

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        type: 'youtube',
        id: videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /(?:vimeo\.com\/)(\d+)/,
    /(?:player\.vimeo\.com\/video\/)(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        type: 'vimeo',
        id: videoId,
        thumbnailUrl: null, // Vimeo thumbnails require API call
      };
    }
  }

  return { type: null, id: null, thumbnailUrl: null };
}

/**
 * Get YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get Vimeo embed URL
 */
export function getVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}`;
}

/**
 * Get embed URL based on video type
 */
export function getEmbedUrl(videoType: 'youtube' | 'vimeo', videoId: string): string {
  if (videoType === 'youtube') {
    return getYouTubeEmbedUrl(videoId);
  }
  return getVimeoEmbedUrl(videoId);
}
