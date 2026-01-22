"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Wait for content to be rendered, then extract headings
    const extractHeadings = () => {
      const contentContainer = document.querySelector('[data-blog-content]');
      if (!contentContainer) {
        // Retry after a short delay if content isn't ready
        setTimeout(extractHeadings, 100);
        return;
      }

      const headingElements = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const extractedHeadings: Heading[] = [];
      headingElements.forEach((heading) => {
        const text = heading.textContent?.trim() || '';
        if (!text) return;
        
        const level = parseInt(heading.tagName.charAt(1));
        let id = heading.id;
        
        // Generate ID if heading doesn't have one
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          heading.id = id;
        }
        
        extractedHeadings.push({ id, text, level });
      });

      setHeadings(extractedHeadings);
    };

    extractHeadings();
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-sm font-semibold text-foreground mb-4">On This Page</h2>
      <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {headings.map((heading) => {
          const indent = heading.level > 2 ? (heading.level - 2) * 16 : 0;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  const offset = 100;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                  });
                  setActiveId(heading.id);
                }
              }}
              className={cn(
                "block text-sm transition-colors py-1.5 rounded-md px-2 -mx-2",
                activeId === heading.id
                  ? "text-foreground font-medium bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                heading.level > 2 && "text-xs"
              )}
              style={{ paddingLeft: `${indent + 8}px` }}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
