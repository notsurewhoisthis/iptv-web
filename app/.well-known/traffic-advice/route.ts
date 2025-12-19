import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const body = [
    {
      user_agent: 'prefetch-proxy',
      fraction: 0.3,
    },
  ];

  return NextResponse.json(body, {
    headers: {
      'Content-Type': 'application/trafficadvice+json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
