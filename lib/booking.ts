/**
 * Utility functions for booking system
 */

import { getSupabaseClient } from '@/lib/supabase/client';
import type { Booking, TimeSlot } from '@/types/content';

/**
 * Generate a unique confirmation token
 */
export function generateConfirmationToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Check if a time slot is available for a given date
 */
export async function isTimeSlotAvailable(
  date: string,
  time: string,
  serviceId?: string | null
): Promise<boolean> {
  const supabase = getSupabaseClient();

  // Check for existing bookings at this date and time
  const { data: existingBookings, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('booking_date', date)
    .eq('booking_time', time)
    .in('status', ['pending', 'confirmed']);

  if (error) {
    console.error('Error checking time slot availability:', error);
    return false;
  }

  // If there are existing bookings, slot is not available
  return (existingBookings?.length || 0) === 0;
}

/**
 * Get available time slots for a given date
 */
export async function getAvailableTimeSlots(
  date: string,
  serviceId?: string | null
): Promise<string[]> {
  const supabase = getSupabaseClient();

  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  // Get configured time slots for this day
  const { data: timeSlots, error: slotsError } = await supabase
    .from('time_slots')
    .select('start_time, end_time')
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .order('start_time', { ascending: true });

  if (slotsError || !timeSlots) {
    console.error('Error fetching time slots:', slotsError);
    return [];
  }

  // Get existing bookings for this date
  const { data: existingBookings } = await supabase
    .from('bookings')
    .select('booking_time, duration_minutes')
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed']);

  // Generate all possible time slots from configured ranges
  const availableSlots: string[] = [];

  for (const slot of timeSlots) {
    const startTime = new Date(`2000-01-01T${slot.start_time}`);
    const endTime = new Date(`2000-01-01T${slot.end_time}`);

    // Generate 1-hour slots
    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5); // HH:MM format

      // Check if this slot is already booked
      const isBooked = existingBookings?.some((booking) => {
        const bookingTime = new Date(`2000-01-01T${booking.booking_time}`);
        const bookingEnd = new Date(bookingTime);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + (booking.duration_minutes || 60));

        return (
          (currentTime >= bookingTime && currentTime < bookingEnd) ||
          (new Date(currentTime.getTime() + 60 * 60 * 1000) > bookingTime &&
            new Date(currentTime.getTime() + 60 * 60 * 1000) <= bookingEnd)
        );
      });

      if (!isBooked) {
        availableSlots.push(timeString);
      }

      // Move to next hour
      currentTime.setHours(currentTime.getHours() + 1);
    }
  }

  return availableSlots;
}

/**
 * Format booking date and time for display
 */
export function formatBookingDateTime(date: string, time: string): string {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);
  return `${formattedDate} at ${time}`;
}
