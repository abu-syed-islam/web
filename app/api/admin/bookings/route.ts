import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to create authenticated Supabase client from request
async function createAuthenticatedClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '') || null;

  if (!accessToken) {
    return { supabase: null, user: null, error: 'No access token provided' };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  return { supabase, user, error };
}

export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await createAuthenticatedClient(request);
    
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message 
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const serviceId = searchParams.get('service_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase
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

    if (status) {
      query = query.eq('status', status);
    }

    if (serviceId) {
      query = query.eq('service_id', serviceId);
    }

    if (startDate) {
      query = query.gte('booking_date', startDate);
    }

    if (endDate) {
      query = query.lte('booking_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, error: authError } = await createAuthenticatedClient(request);
    
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message 
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, service_id, booking_date, booking_time, duration_minutes, message, status } = body;

    if (!name || !email || !booking_date || !booking_time) {
      return NextResponse.json(
        { error: 'Name, email, booking date, and booking time are required' },
        { status: 400 }
      );
    }

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
        status: status || 'pending',
        reminder_sent: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
