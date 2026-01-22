import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    // Get resource
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_url, file_name')
      .eq('id', id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Increment download count (non-blocking)
    supabase
      .from('resources')
      .select('download_count')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          supabase
            .from('resources')
            .update({ download_count: (data.download_count || 0) + 1 })
            .eq('id', id)
            .catch((err) => {
              console.error('Failed to update download count:', err);
            });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch resource for download count:', err);
      });

    // Redirect to file URL
    return NextResponse.redirect(resource.file_url);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
