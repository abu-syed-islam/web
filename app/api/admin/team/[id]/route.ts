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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { supabase, user, error: authError } = await createAuthenticatedClient(request);
    
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message || 'No valid session found'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, bio, email, github_url, linkedin_url, twitter_url, image_url, display_order, is_active } = body;

    if (!name || !role || !bio) {
      return NextResponse.json(
        { error: 'Name, role, and bio are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('team')
      .update({
        name,
        role,
        bio,
        email: email || null,
        github_url: github_url || null,
        linkedin_url: linkedin_url || null,
        twitter_url: twitter_url || null,
        image_url: image_url || null,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { supabase, user, error: authError } = await createAuthenticatedClient(request);
    
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message || 'No valid session found'
      }, { status: 401 });
    }

    const { error } = await supabase
      .from('team')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
