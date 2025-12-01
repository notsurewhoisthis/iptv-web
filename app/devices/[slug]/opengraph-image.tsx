import { ImageResponse } from 'next/og';
import { getDevice, getDevices } from '@/lib/data-loader';

export const alt = 'IPTV Device Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const devices = await getDevices();
  return devices.map((device) => ({ slug: device.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const device = await getDevice(slug);

  if (!device) {
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
          Device Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
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
          <div style={{ display: 'flex', fontSize: 28, color: 'white', opacity: 0.9 }}>
            📺 IPTV Guide
          </div>
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {device.brand}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          {device.name}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 30,
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          {device.shortDescription}
        </div>

        <div style={{ display: 'flex', gap: 30, marginTop: 'auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)',
              padding: '16px 24px',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 'bold', color: 'white' }}>
              {device.specs.resolution}
            </div>
            <div style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>
              Resolution
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)',
              padding: '16px 24px',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 'bold', color: 'white' }}>
              {device.specs.storage}
            </div>
            <div style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>
              Storage
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.15)',
              padding: '16px 24px',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 'bold', color: 'white' }}>
              {device.supportedPlayers.length}
            </div>
            <div style={{ display: 'flex', fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>
              Players
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
