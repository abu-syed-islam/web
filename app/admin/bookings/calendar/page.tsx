import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { CalendarView } from '@/components/admin/calendar-view';
import type { Booking } from '@/types/content';

export const revalidate = 0;

async function getAllBookings() {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services:service_id (
        id,
        title
      )
    `)
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data as (Booking & { services?: { id: string; title: string } | null })[];
}

export default async function CalendarPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Booking Calendar</h1>
        <p className="text-muted-foreground mt-1">
          View all bookings in a calendar format.
        </p>
      </div>

      <CalendarView bookings={bookings} />
    </div>
  );
}
