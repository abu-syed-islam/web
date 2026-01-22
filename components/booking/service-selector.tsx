"use client";

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Service } from '@/types/content';

interface ServiceSelectorProps {
  value?: string;
  onChange: (serviceId: string) => void;
  required?: boolean;
}

export function ServiceSelector({ value, onChange, required = false }: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('services')
          .select('id, title, description')
          .order('title', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
        } else {
          setServices(data || []);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Service</Label>
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="service">Service {required && '*'}</Label>
      <select
        id="service"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select a service (optional)</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.title}
          </option>
        ))}
      </select>
      {services.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No services available. Please contact us directly.
        </p>
      )}
    </div>
  );
}
