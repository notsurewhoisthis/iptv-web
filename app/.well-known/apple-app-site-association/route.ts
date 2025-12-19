import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildAppleAppSiteAssociation() {
  const teamId = process.env.AASA_TEAM_ID?.trim();
  const bundleId = (process.env.AASA_BUNDLE_ID || 'heni.Diamond-IPTV').trim();

  return {
    applinks: {
      apps: [],
      details: teamId
        ? [
            {
              appID: `${teamId}.${bundleId}`,
              paths: ['/*'],
            },
          ]
        : [],
    },
  };
}

export async function GET() {
  const body = buildAppleAppSiteAssociation();
  return NextResponse.json(body, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
