import { notFound } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { BookingForm } from '@/components/admin/booking-form';
import type { Booking } from '@/types/content';

async function getBooking(id: string) {
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
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Booking & { services?: { id: string; title: string } | null };
}

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Booking</h1>
        <p className="text-muted-foreground mt-1">
          Update booking details and status.
        </p>
      </div>

      <BookingForm booking={booking} />
    </div>
  );
}
