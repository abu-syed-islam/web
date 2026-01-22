import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import { generateConfirmationToken } from '@/lib/booking';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/email-booking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service_id, booking_date, booking_time, duration_minutes, message } = body;

    // Validation
    if (!name || !email || !booking_date || !booking_time) {
      return NextResponse.json(
        { error: 'Name, email, booking date, and booking time are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Date validation - cannot book in the past
    const bookingDateTime = new Date(`${booking_date}T${booking_time}`);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Check if time slot is available
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', booking_date)
      .eq('booking_time', booking_time)
      .in('status', ['pending', 'confirmed']);

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please select another time.' },
        { status: 400 }
      );
    }

    // Generate confirmation token
    const confirmation_token = generateConfirmationToken();

    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        name,
        email,
        phone: phone || null,
        service_id: service_id || null,
        booking_date,
        booking_time,
        duration_minutes: duration_minutes || 60,
        message: message || null,
        status: 'pending',
        confirmation_token,
        reminder_sent: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create booking:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Get service name if service_id is provided
    let serviceName: string | undefined;
    if (service_id) {
      const { data: service } = await supabase
        .from('services')
        .select('title')
        .eq('id', service_id)
        .single();
      serviceName = service?.title;
    }

    // Send emails (non-blocking)
    sendBookingConfirmation(data, serviceName).catch((err) => {
      console.error('Failed to send booking confirmation email', err);
    });

    sendBookingNotification(data, serviceName).catch((err) => {
      console.error('Failed to send booking notification email', err);
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
