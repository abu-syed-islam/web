"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SocialShareProps {
  title: string;
  slug: string;
}

export function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
  const url = `${siteUrl}/blog/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-6">
      <span className="text-sm font-semibold text-muted-foreground">Share:</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8"
        >
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8"
        >
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8"
        >
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-8"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
