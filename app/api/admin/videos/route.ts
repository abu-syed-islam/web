import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseVideoUrl } from '@/lib/video-utils';

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

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch videos' },
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
    const { title, video_url, description, category, duration, display_order, is_featured } = body;

    if (!title || !video_url) {
      return NextResponse.json(
        { error: 'Title and video URL are required' },
        { status: 400 }
      );
    }

    // Parse video URL to extract type and ID
    const videoInfo = parseVideoUrl(video_url);
    if (!videoInfo.type || !videoInfo.id) {
      return NextResponse.json(
        { error: 'Invalid video URL. Please provide a valid YouTube or Vimeo URL.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('videos')
      .insert({
        title,
        description: description || null,
        video_url,
        thumbnail_url: videoInfo.thumbnailUrl || null,
        video_type: videoInfo.type,
        video_id: videoInfo.id,
        category: category || null,
        duration: duration || null,
        display_order: display_order || 0,
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create video' },
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
