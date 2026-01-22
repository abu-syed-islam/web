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
    const { title, description, icon } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('services')
      .insert({
        title,
        description,
        icon: icon || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create service' },
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
