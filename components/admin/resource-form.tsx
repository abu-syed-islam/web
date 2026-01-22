"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import type { Resource } from '@/types/content';

interface ResourceFormProps {
  resource?: Resource;
}

export function ResourceForm({ resource }: ResourceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    file_url: resource?.file_url || '',
    file_name: resource?.file_name || '',
    file_size: resource?.file_size?.toString() || '',
    file_type: resource?.file_type || 'other',
    category: resource?.category || '',
    display_order: resource?.display_order?.toString() || '0',
    is_featured: resource?.is_featured || false,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const supabase = getSupabaseAdminClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You are not logged in. Please log in again.');
        setIsUploading(false);
        return;
      }

      const url = await uploadFile(file, 'resources', session.access_token);
      
      setFormData({
        ...formData,
        file_url: url,
        file_name: file.name,
        file_size: file.size.toString(),
        file_type: getFileType(file.name),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const getFileType = (fileName: string): 'pdf' | 'doc' | 'template' | 'other' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['zip', 'rar', '7z'].includes(ext || '')) return 'template';
    return 'other';
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

      if (!formData.file_url) {
        setError('Please upload a file or provide a file URL.');
        setIsSubmitting(false);
        return;
      }

      const url = resource ? `/api/admin/resources/${resource.id}` : '/api/admin/resources';
      const method = resource ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          file_size: formData.file_size ? parseInt(formData.file_size) : null,
          display_order: parseInt(formData.display_order) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save resource');
      }

      router.push('/admin/resources');
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
          <Link href="/admin/resources" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : resource ? 'Update Resource' : 'Create Resource'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
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
              placeholder="Resource title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Resource description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {isUploading && (
                <span className="text-sm text-muted-foreground">Uploading...</span>
              )}
            </div>
            {formData.file_url && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-800 dark:text-green-400">
                ✓ File uploaded: {formData.file_name || 'File'}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Or provide a file URL directly below
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_url">File URL *</Label>
            <Input
              id="file_url"
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              required
              placeholder="https://example.com/file.pdf"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="file_type">File Type</Label>
              <select
                id="file_type"
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="template">Template</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Templates, Guides, Resources"
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
                  Mark as featured resource
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
