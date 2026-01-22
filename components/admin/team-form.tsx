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
import type { TeamMember } from '@/types/content';

interface TeamFormProps {
  member?: TeamMember;
  isEdit?: boolean;
}

export function TeamForm({ member, isEdit = false }: TeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    email: member?.email || '',
    github_url: member?.github_url || '',
    linkedin_url: member?.linkedin_url || '',
    twitter_url: member?.twitter_url || '',
    image_url: member?.image_url || null,
    display_order: member?.display_order?.toString() || '0',
    is_active: member?.is_active !== undefined ? member.is_active : true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      const url = isEdit ? `/api/admin/team/${member?.id}` : '/api/admin/team';
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
          display_order: parseInt(formData.display_order) || 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save team member');
      }

      router.push('/admin/team');
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
          <Link href="/admin/team" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
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
                placeholder="Full name"
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
                placeholder="e.g., Lead Developer, UX Designer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Brief bio about the team member"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={handleImageChange}
          />

          <div className="grid gap-4 md:grid-cols-2">
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

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active">Active (visible on website)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link href="/admin/team">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
}
