import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import { COMPANY_NAME } from '@/constants/company';
import type { BlogPost } from '@/types/content';

export const revalidate = 3600; // Revalidate every hour

function generateRSSFeed(posts: BlogPost[]): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const currentDate = new Date().toUTCString();

  const items = posts.map((post) => {
    const pubDate = post.published_at
      ? new Date(post.published_at).toUTCString()
      : currentDate;
    
    const content = post.excerpt || '';
    const imageTag = post.image_url
      ? `<enclosure url="${post.image_url}" type="image/jpeg" />`
      : '';

    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author}</author>
      ${imageTag}
      <category><![CDATA[${post.category || 'Uncategorized'}]]></category>
    </item>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${COMPANY_NAME} Blog]]></title>
    <description><![CDATA[Latest articles and updates from ${COMPANY_NAME}]]></description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    const posts = (data ?? []) as BlogPost[];
    const rssFeed = generateRSSFeed(posts);

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
