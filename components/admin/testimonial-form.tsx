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
import type { Testimonial } from '@/types/content';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  isEdit?: boolean;
}

export function TestimonialForm({ testimonial, isEdit = false }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    company: testimonial?.company || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating?.toString() || '5',
    image_url: testimonial?.image_url || null,
    featured: testimonial?.featured || false,
    display_order: testimonial?.display_order?.toString() || '0',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

      const url = isEdit ? `/api/admin/testimonials/${testimonial?.id}` : '/api/admin/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating) || null,
          display_order: parseInt(formData.display_order) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save testimonial');
      }

      router.push('/admin/testimonials');
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
          <Link href="/admin/testimonials" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Testimonials
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g., CEO, Founder"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Enter the testimonial content"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <select
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={handleImageChange}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="featured">Featured Testimonial</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
        </Button>
      </div>
    </form>
  );
}
