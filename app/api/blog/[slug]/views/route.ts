import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';

// Helper function to extract IP address from request
function getClientIP(request: NextRequest): string | null {
  // Check various headers for IP address (handles proxies, load balancers, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to request IP (may not work in all environments)
  return request.ip || null;
}

// Helper function to detect if request is from a bot
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
    /httpie/i,
    /postman/i,
    /insomnia/i,
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

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

    // Extract IP address and user agent
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent');

    // Optional: Skip tracking for known bots (uncomment if desired)
    // if (isBot(userAgent)) {
    //   return NextResponse.json(
    //     { error: 'Bot requests are not tracked' },
    //     { status: 403 }
    //   );
    // }

    const supabase = getSupabaseClient();

    // Use RPC function for atomic increment with IP-based rate limiting
    const { data: viewCount, error: rpcError } = await supabase
      .rpc('increment_blog_post_views', { 
        post_slug_param: slug,
        ip_address_param: ipAddress,
        user_agent_param: userAgent,
      });

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
    // It also returns current count (without incrementing) if rate limited
    if (viewCount === null) {
      // Check if post exists (might be draft or doesn't exist)
      const { data: post } = await supabase
        .from('blog_posts')
        .select('id, status, view_count')
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

      // Return current count even if not incremented (rate limited or other issue)
      return NextResponse.json({
        success: true,
        view_count: post.view_count || 0,
        rate_limited: true, // Indicate that view was not counted
      });
    }

    // Successfully processed - return the count
    // viewCount will be the current count (may be same if rate limited, or incremented if new view)
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
