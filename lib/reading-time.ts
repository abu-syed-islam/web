export function calculateReadingTime(content: string): number {
  // Average reading speed: 200-250 words per minute
  // Using 200 for a conservative estimate
  const wordsPerMinute = 200;
  
  // Remove HTML tags for accurate word count
  const textContent = content.replace(/<[^>]*>/g, " ");
  
  // Count words
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  
  // Calculate reading time (round up)
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  // Minimum 1 minute
  return Math.max(1, readingTime);
}
