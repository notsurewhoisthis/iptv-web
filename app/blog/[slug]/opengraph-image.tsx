import { ImageResponse } from 'next/og';
import { getBlogPost, getBlogPosts } from '@/lib/data-loader';

export const alt = 'IPTV Guide Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
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
          Article Not Found
        </div>
      ),
      { ...size }
    );
  }

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
          <div style={{ display: 'flex', fontSize: 28, color: 'white', opacity: 0.9 }}>
            📺 IPTV Guide Blog
          </div>
          <div
            style={{
              display: 'flex',
              background: '#3b82f6',
              padding: '8px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {post.category}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.2,
            marginBottom: 30,
            maxWidth: 1000,
          }}
        >
          {post.title}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {post.description.length > 150 ? post.description.slice(0, 150) + '...' : post.description}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 'auto',
            paddingTop: 30,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 48,
              height: 48,
              borderRadius: 24,
              background: '#3b82f6',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {post.author.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', color: 'white', fontSize: 20 }}>{post.author.name}</div>
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>
              {post.metrics.readingTime} min read
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
