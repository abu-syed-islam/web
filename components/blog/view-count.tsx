"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewCountProps {
  initialCount: number;
  slug: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function ViewCount({
  initialCount,
  slug,
  className,
  iconClassName,
  textClassName,
}: ViewCountProps) {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Listen for view count updates from ViewTracker
    const handleViewUpdate = (event: CustomEvent<{ slug: string; count: number }>) => {
      console.log('🔔 ViewCount received event:', event.detail);
      if (event.detail.slug === slug) {
        const newCount = event.detail.count;
        console.log(`📊 Updating count from ${count} to ${newCount}`);
        if (newCount > count) {
          setIsAnimating(true);
          setCount(newCount);
          console.log('✨ Animation triggered!');
          // Reset animation after animation completes
          setTimeout(() => setIsAnimating(false), 600);
        } else {
          console.log('⚠️ New count not greater than current count, skipping update');
        }
      }
    };

    window.addEventListener("blog-view-updated", handleViewUpdate as EventListener);

    return () => {
      window.removeEventListener("blog-view-updated", handleViewUpdate as EventListener);
    };
  }, [slug, count]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Eye className={cn("h-4 w-4", iconClassName)} />
      <span
        className={cn(
          "transition-all duration-300",
          isAnimating && "scale-110 text-primary font-semibold",
          textClassName
        )}
      >
        {count.toLocaleString()} views
      </span>
    </div>
  );
}
