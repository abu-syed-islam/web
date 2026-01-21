"use client";

import { useEffect, useRef, useState } from "react";

interface ViewTrackerProps {
  slug: string;
}

// Engagement thresholds (reduced for faster/realtime tracking)
const MIN_TIME_ON_PAGE = 3000; // 3 seconds (reduced from 30s for testing)
const MIN_SCROLL_DEPTH = 0.2; // 20% of article (reduced from 50% for testing)
const MIN_VISIBILITY_TIME = 2000; // 2 seconds visible (reduced from 5s)

export function ViewTracker({ slug }: ViewTrackerProps) {
  const [hasTracked, setHasTracked] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const maxScrollRef = useRef<number>(0);
  const visibilityStartRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const hasTrackedViewRef = useRef<boolean>(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if we've already tracked a view for this post in this session
    const storageKey = `blog_view_${slug}`;
    
    try {
      hasTrackedViewRef.current = !!sessionStorage.getItem(storageKey);
    } catch (error) {
      // sessionStorage might not be available (e.g., in private browsing)
      console.error('Failed to access sessionStorage:', error);
      return;
    }

    if (hasTrackedViewRef.current) {
      // Already tracked in this session, skip
      setHasTracked(true);
      return;
    }

    // Find the article element
    const article = document.querySelector('article');
    if (!article) {
      // Fallback: track after delay if article not found
      const timer = setTimeout(() => {
        trackView();
      }, 5000); // Track after 5 seconds if no article found
      return () => clearTimeout(timer);
    }

    articleRef.current = article;
    startTimeRef.current = Date.now();

    // Intersection Observer to detect when article is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (!isVisibleRef.current) {
              isVisibleRef.current = true;
              visibilityStartRef.current = Date.now();
            }
          } else {
            isVisibleRef.current = false;
            visibilityStartRef.current = null;
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px',
      }
    );

    observer.observe(article);

    // Track scroll depth
    const handleScroll = () => {
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const scrollPosition = scrollTop + windowHeight;
      const articleBottom = articleTop + articleHeight;
      
      if (scrollPosition >= articleTop) {
        const scrolled = Math.min(
          (scrollPosition - articleTop) / articleHeight,
          1
        );
        maxScrollRef.current = Math.max(maxScrollRef.current, scrolled);
      }

      // Check if engagement threshold is met
      checkEngagement();
    };

    // Track time spent
    const timeCheckInterval = setInterval(() => {
      checkEngagement();
    }, 1000); // Check every 1 second (faster response)

    window.addEventListener('scroll', handleScroll, { passive: true });

    const checkEngagement = () => {
      if (hasTracked || hasTrackedViewRef.current) return;

      const timeOnPage = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;
      
      const visibilityTime = isVisibleRef.current && visibilityStartRef.current
        ? Date.now() - visibilityStartRef.current
        : 0;

      const scrollDepth = maxScrollRef.current;

      // Track view if engagement thresholds are met
      const hasMinTime = timeOnPage >= MIN_TIME_ON_PAGE;
      const hasMinScroll = scrollDepth >= MIN_SCROLL_DEPTH;
      const hasMinVisibility = visibilityTime >= MIN_VISIBILITY_TIME;

      // Debug logging
      console.log('📊 Engagement Check:', {
        timeOnPage: `${(timeOnPage / 1000).toFixed(1)}s`,
        scrollDepth: `${(scrollDepth * 100).toFixed(0)}%`,
        visibilityTime: `${(visibilityTime / 1000).toFixed(1)}s`,
        hasMinTime,
        hasMinScroll,
        hasMinVisibility,
        willTrack: hasMinTime || (hasMinScroll && hasMinVisibility)
      });

      if (hasMinTime || (hasMinScroll && hasMinVisibility)) {
        console.log('✅ Tracking view now!');
        trackView();
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
        clearInterval(timeCheckInterval);
      }
    };

    // Fallback: track after reasonable delay even if thresholds not met
    const fallbackTimer = setTimeout(() => {
      if (!hasTracked && !hasTrackedViewRef.current) {
        trackView();
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
        clearInterval(timeCheckInterval);
      }
    }, 10000); // 10 seconds max (reduced from 60s for testing)

    const trackView = async () => {
      if (hasTracked || hasTrackedViewRef.current) return;
      
      console.log('🚀 Tracking view for:', slug);
      setHasTracked(true);

      try {
        const response = await fetch(`/api/blog/${slug}/views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ View tracked successfully:', data);
          
          // Mark as tracked in session storage
          try {
            sessionStorage.setItem(storageKey, "true");
            hasTrackedViewRef.current = true;
          } catch (error) {
            // Ignore sessionStorage errors
            console.error('Failed to set sessionStorage:', error);
          }

          // Dispatch custom event with updated view count
          if (data.view_count !== undefined) {
            console.log('📢 Dispatching view update event:', data.view_count);
            window.dispatchEvent(
              new CustomEvent("blog-view-updated", {
                detail: {
                  slug,
                  count: data.view_count,
                },
              })
            );
          }
        } else {
          console.error('❌ Failed to track view:', response.status, await response.text());
        }
      } catch (error) {
        // Silently fail - we don't want to break the page if tracking fails
        console.error("❌ Failed to track view:", error);
        setHasTracked(false); // Allow retry on error
      }
    };

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeCheckInterval);
      clearTimeout(fallbackTimer);
    };
  }, [slug, hasTracked]);

  // This component doesn't render anything
  return null;
}
