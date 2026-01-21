import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Use RPC function for atomic increment
    const { data: viewCount, error: rpcError } = await supabase
      .rpc('increment_blog_post_views', { post_slug: slug });

    if (rpcError) {
      console.error('Error incrementing view count:', rpcError);
      
      // Fallback: try direct update if RPC doesn't exist yet
      const { data: post } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!post) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }

      const currentCount = post.view_count || 0;
      const { data: updatedPost, error: updateError } = await supabase
        .from('blog_posts')
        .update({ view_count: currentCount + 1 })
        .eq('slug', slug)
        .eq('status', 'published')
        .select('view_count')
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to increment view count' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        view_count: updatedPost.view_count,
      });
    }

    // RPC returns 0 if no rows were updated (post not found or not published)
    // Returns the new view_count if successful (which should be >= 1 after increment)
    if (viewCount === null || viewCount === 0) {
      // Check if post exists (might be draft or doesn't exist)
      const { data: post } = await supabase
        .from('blog_posts')
        .select('id, status')
        .eq('slug', slug)
        .single();

      if (!post) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }

      if (post.status !== 'published') {
        return NextResponse.json(
          { error: 'Blog post not published' },
          { status: 404 }
        );
      }
    }

    // Successfully incremented - return the new count
    // viewCount should be >= 1 after successful increment
    return NextResponse.json({
      success: true,
      view_count: viewCount ?? 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
