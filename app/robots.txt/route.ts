import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/data-loader';

// Force dynamic rendering so env vars are read at runtime
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = getBaseUrl();

  const robots = `# IPTV Guide Robots.txt

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Allow AI crawlers
User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block known bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
