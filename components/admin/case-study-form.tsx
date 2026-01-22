"use client";

import { useState, useEffect } from 'react';
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
import type { CaseStudy, Project } from '@/types/content';

interface CaseStudyFormProps {
  caseStudy?: CaseStudy;
}

export function CaseStudyForm({ caseStudy }: CaseStudyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [formData, setFormData] = useState({
    title: caseStudy?.title || '',
    slug: caseStudy?.slug || '',
    excerpt: caseStudy?.excerpt || '',
    content: caseStudy?.content || '',
    project_id: caseStudy?.project_id || '',
    client_name: caseStudy?.client_name || '',
    client_logo_url: caseStudy?.client_logo_url || '',
    image_url: caseStudy?.image_url || null,
    gallery_images: caseStudy?.gallery_images?.join(', ') || '',
    challenges: caseStudy?.challenges?.join('\n') || '',
    solutions: caseStudy?.solutions?.join('\n') || '',
    results: caseStudy?.results?.join('\n') || '',
    tech_stack: caseStudy?.tech_stack?.join(', ') || '',
    category: caseStudy?.category || '',
    duration: caseStudy?.duration || '',
    status: caseStudy?.status || 'draft',
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, category')
          .order('title', { ascending: true });

        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    }

    fetchProjects();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
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

      const url = caseStudy ? `/api/admin/case-studies/${caseStudy.id}` : '/api/admin/case-studies';
      const method = caseStudy ? 'PUT' : 'POST';

      const challenges = formData.challenges
        ? formData.challenges.split('\n').filter((c) => c.trim())
        : [];
      const solutions = formData.solutions
        ? formData.solutions.split('\n').filter((s) => s.trim())
        : [];
      const results = formData.results
        ? formData.results.split('\n').filter((r) => r.trim())
        : [];
      const techStack = formData.tech_stack
        ? formData.tech_stack.split(',').map((t) => t.trim()).filter((t) => t)
        : [];
      const galleryImages = formData.gallery_images
        ? formData.gallery_images.split(',').map((img) => img.trim()).filter((img) => img)
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
          challenges: challenges.length > 0 ? challenges : null,
          solutions: solutions.length > 0 ? solutions : null,
          results: results.length > 0 ? results : null,
          project_id: formData.project_id || null,
          tech_stack: techStack.length > 0 ? techStack : null,
          category: formData.category || null,
          gallery_images: galleryImages.length > 0 ? galleryImages : null,
          published_at: formData.status === 'published' && !caseStudy?.published_at
            ? new Date().toISOString()
            : caseStudy?.published_at || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save case study');
      }

      router.push('/admin/case-studies');
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
          <Link href="/admin/case-studies" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : caseStudy ? 'Update Case Study' : 'Create Case Study'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Case study title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="case-study-slug"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="Brief description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              placeholder="Full case study content in HTML format"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_id">Related Project (Optional)</Label>
            {loadingProjects ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <select
                id="project_id"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a project (optional)</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title} {project.category ? `(${project.category})` : ''}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-muted-foreground">
              Link this case study to a specific project from your portfolio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Client company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_logo_url">Client Logo URL</Label>
              <Input
                id="client_logo_url"
                type="url"
                value={formData.client_logo_url}
                onChange={(e) => setFormData({ ...formData, client_logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={(url) => setFormData({ ...formData, image_url: url })}
          />

          <div className="space-y-2">
            <Label htmlFor="gallery_images">Gallery Images (comma-separated URLs)</Label>
            <Input
              id="gallery_images"
              type="text"
              value={formData.gallery_images}
              onChange={(e) => setFormData({ ...formData, gallery_images: e.target.value })}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Challenges (one per line)</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              rows={4}
              placeholder="Challenge 1&#10;Challenge 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solutions">Solutions (one per line)</Label>
            <Textarea
              id="solutions"
              value={formData.solutions}
              onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
              rows={4}
              placeholder="Solution 1&#10;Solution 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results (one per line)</Label>
            <Textarea
              id="results"
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
              rows={4}
              placeholder="Result 1&#10;Result 2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
              <Input
                id="tech_stack"
                type="text"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, Next.js, TypeScript"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Web App, Mobile App, E-commerce"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 3 months"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
