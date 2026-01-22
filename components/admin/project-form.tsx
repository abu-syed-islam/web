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
import { ImageUpload } from './image-upload';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import type { Project } from '@/types/content';

interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
}

export function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    image_url: project?.image_url || null,
    tech_stack: project?.tech_stack?.join(', ') || '',
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
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

      const url = isEdit ? `/api/admin/projects/${project?.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const techStackArray = formData.tech_stack
        ? formData.tech_stack.split(',').map(t => t.trim()).filter(t => t)
        : [];

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tech_stack: techStackArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save project');
      }

      router.push('/admin/projects');
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
          <Link href="/admin/projects" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
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
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Enter project description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Web App, Mobile App, E-commerce"
            />
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={handleImageChange}
          />

          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
            <Input
              id="tech_stack"
              name="tech_stack"
              type="text"
              value={formData.tech_stack}
              onChange={handleChange}
              placeholder="e.g., React, Next.js, TypeScript"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL</Label>
            <Input
              id="live_url"
              name="live_url"
              type="url"
              value={formData.live_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link href="/admin/projects">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
