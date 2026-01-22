"use client";

import { FileText, Download, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Resource } from '@/types/content';

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getFileIcon = () => {
    switch (resource.file_type) {
      case 'pdf':
        return <FileText className="h-6 w-6" />;
      case 'doc':
        return <File className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex-shrink-0 rounded-lg bg-primary/10 p-3 text-primary">
          {getFileIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{resource.title}</h3>
          {resource.description && (
            <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
          )}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {resource.file_type && (
            <span className="uppercase">{resource.file_type}</span>
          )}
          {resource.file_size && (
            <>
              {resource.file_type && ' • '}
              {formatFileSize(resource.file_size)}
            </>
          )}
          {resource.download_count !== null && resource.download_count > 0 && (
            <>
              {' • '}
              {resource.download_count} {resource.download_count === 1 ? 'download' : 'downloads'}
            </>
          )}
        </div>
        <Button asChild size="sm" className="gap-2">
          <a href={`/api/resources/${resource.id}/download`} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
