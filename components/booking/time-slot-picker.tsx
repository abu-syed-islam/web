"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  date?: string;
  value?: string;
  onChange: (time: string) => void;
  serviceId?: string | null;
  required?: boolean;
}

export function TimeSlotPicker({ date, value, onChange, serviceId, required = false }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(value || null);

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
    }
  }, [value]);

  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!date) {
        setSlots([]);
        setSelectedTime(null);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({ date });
        if (serviceId) {
          params.append('service_id', serviceId);
        }

        const response = await fetch(`/api/booking/available-slots?${params}`);
        const data = await response.json();

        if (data.success) {
          setSlots(data.slots || []);
        } else {
          console.error('Error fetching slots:', data.error);
          setSlots([]);
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
  }, [date, serviceId]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onChange(time);
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!date) {
    return (
      <div className="space-y-2">
        <Label>Select Time {required && '*'}</Label>
        <div className="rounded-lg border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
          Please select a date first
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Time {required && '*'}</Label>
      {loading ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            Loading available times...
          </div>
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-lg border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
          No available time slots for this date. Please select another date.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {slots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeClick(time)}
                className={`
                  rounded-md border p-3 text-sm font-medium transition-colors
                  ${isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                {formatTime(time)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
