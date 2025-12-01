import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'IPTV Guide - Setup Guides, Player Reviews & Troubleshooting';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
            }}
          >
            📺
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: 20,
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          IPTV Guide
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Setup Guides, Player Reviews & Troubleshooting
        </div>

        {/* Features row */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 50,
          }}
        >
          {['Players', 'Devices', 'Guides'].map((text) => (
            <div
              key={text}
              style={{
                padding: '12px 32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 50,
                color: 'white',
                fontSize: 24,
                fontWeight: 500,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
