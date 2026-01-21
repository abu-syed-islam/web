"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if we've already tracked a view for this post in this session
    const storageKey = `blog_view_${slug}`;
    let hasTrackedView = false;
    
    try {
      hasTrackedView = !!sessionStorage.getItem(storageKey);
    } catch (error) {
      // sessionStorage might not be available (e.g., in private browsing)
      console.error('Failed to access sessionStorage:', error);
      return;
    }

    if (hasTrackedView) {
      // Already tracked in this session, skip
      return;
    }

    // Track the view
    const trackView = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}/views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Mark as tracked in session storage
          try {
            sessionStorage.setItem(storageKey, "true");
          } catch (error) {
            // Ignore sessionStorage errors
            console.error('Failed to set sessionStorage:', error);
          }
        }
      } catch (error) {
        // Silently fail - we don't want to break the page if tracking fails
        console.error("Failed to track view:", error);
      }
    };

    // Small delay to ensure page is loaded and user is actually viewing
    const timer = setTimeout(trackView, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [slug]);

  // This component doesn't render anything
  return null;
}
