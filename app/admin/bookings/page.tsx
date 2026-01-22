import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSupabaseAdminClient } from '@/lib/supabase/client';
import { Plus, Calendar, Filter } from 'lucide-react';
import type { Booking } from '@/types/content';
import { formatBookingDateTime } from '@/lib/booking';

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
    .order('booking_date', { ascending: false })
    .order('booking_time', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data as (Booking & { services?: { id: string; title: string } | null })[];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage all appointment bookings and schedules.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/bookings/calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </Link>
          </Button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-lg font-semibold">No bookings yet</h3>
            <p className="text-sm text-muted-foreground">
              Bookings will appear here once customers start scheduling appointments.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{booking.name}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>Email:</strong> {booking.email}
                    </p>
                    {booking.phone && (
                      <p>
                        <strong>Phone:</strong> {booking.phone}
                      </p>
                    )}
                    {booking.services && (
                      <p>
                        <strong>Service:</strong> {booking.services.title}
                      </p>
                    )}
                    <p>
                      <strong>Date & Time:</strong>{' '}
                      {formatBookingDateTime(booking.booking_date, booking.booking_time)}
                    </p>
                    {booking.duration_minutes && (
                      <p>
                        <strong>Duration:</strong> {booking.duration_minutes} minutes
                      </p>
                    )}
                    {booking.message && (
                      <p className="mt-2">
                        <strong>Message:</strong> {booking.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/bookings/edit/${booking.id}`}>Edit</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
