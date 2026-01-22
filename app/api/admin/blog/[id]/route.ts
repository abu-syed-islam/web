import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to create authenticated Supabase client from request
async function createAuthenticatedClient(request: NextRequest) {
  // Get auth token from Authorization header
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

  // Verify the token and get user
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
    
    // Verify authentication
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message || 'No valid session found'
      }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      image_url,
      status,
      published_at,
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !author || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists (excluding current post)
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .neq('id', resolvedParams.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Another post with this slug already exists' },
        { status: 409 }
      );
    }

    // Update blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        excerpt,
        content,
        author,
        category: category || null,
        image_url: image_url || null,
        status,
        published_at: status === 'published' ? published_at : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update post' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { supabase, user, error: authError } = await createAuthenticatedClient(request);
    
    // Verify authentication
    if (!supabase || !user || authError) {
      return NextResponse.json({ 
        error: 'Unauthorized. Please log in again.',
        details: authError?.message || 'No valid session found'
      }, { status: 401 });
    }

    // Delete blog post (cascade will handle blog_post_views)
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
