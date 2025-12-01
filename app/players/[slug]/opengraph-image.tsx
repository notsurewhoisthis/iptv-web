import { ImageResponse } from 'next/og';
import { getPlayer, getPlayers } from '@/lib/data-loader';

export const alt = 'IPTV Player';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const players = await getPlayers();
  return players.map((player) => ({ slug: player.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#1e3a8a',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 48,
          }}
        >
          IPTV Player Not Found
        </div>
      ),
      { ...size }
    );
  }

  const categoryColors: Record<string, string> = {
    premium: '#f59e0b',
    free: '#22c55e',
    'open-source': '#3b82f6',
    freemium: '#8b5cf6',
    paid: '#ef4444',
  };

  const categoryColor = categoryColors[player.category] || '#6b7280';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', fontSize: 32, color: 'white', opacity: 0.9 }}>
            📺 IPTV Guide
          </div>
          <div
            style={{
              display: 'flex',
              background: categoryColor,
              padding: '8px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 20,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {player.category}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            lineHeight: 1.1,
          }}
        >
          {player.name}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 30,
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          {player.shortDescription}
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 'bold', color: '#fbbf24' }}>
              {player.rating}/5
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              Rating
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 'bold', color: '#60a5fa' }}>
              {player.platforms.length}
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              Platforms
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 'bold', color: '#34d399' }}>
              {player.pricing.price || 'Free'}
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              Price
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
