import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { JAMRUN_APPSTORE_URL } from '@/lib/jamrun';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { CopyButton } from '@/components/CopyButton';
import { LastUpdated } from '@/components/GeoComponents';
import { ExternalLink } from 'lucide-react';

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service } = await params;
  const baseUrl = getBaseUrl();
  return {
    title: `FAST playlists: ${service.replace(/-/g, ' ')}`,
    description:
      'Copy the playlist URL and open it in an IPTV player. Availability varies by country and provider.',
    alternates: { canonical: `${baseUrl}/legal-iptv/fast/${service}` },
  };
}

export default async function LegalIptvFastServiceDetailPage({ params }: PageProps) {
  const { service } = await params;
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  const svc = data.fastServices.find((s) => s.id === service);
  if (!svc) notFound();

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
          { name: 'FAST services', url: `${baseUrl}/legal-iptv/fast` },
          { name: svc.name, url: `${baseUrl}/legal-iptv/fast/${svc.id}` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Official FAST playlists</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{svc.name}</h1>
          <p className="text-gray-600">{svc.description}</p>
          <LastUpdated date={data.generatedAt} />
          {svc.officialUrl && (
            <a
              href={svc.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-3"
            >
              Official website <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

        <div className="space-y-3">
          {svc.playlists.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{p.countryLabel || p.label}</p>
                <code className="text-xs bg-gray-100 rounded-lg px-3 py-2 break-all inline-block mt-2">
                  {p.url}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={p.url} label="Copy" />
                <a
                  href={JAMRUN_APPSTORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                  aria-label="Open JamRun on the App Store"
                >
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to use</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Choose your country playlist above and copy its URL.</li>
            <li>Open an IPTV player and add the playlist by URL.</li>
            <li>Load channels and start watching.</li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            Recommended players: <Link href="/players/vlc" className="text-blue-600 hover:underline">VLC</Link>,{' '}
            <Link href="/players/kodi" className="text-blue-600 hover:underline">Kodi</Link>,{' '}
            <a
              href={JAMRUN_APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              JamRun (iOS)
            </a>
            .
          </p>
        </section>

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/legal-iptv/fast" className="text-blue-600 hover:underline">
            ← Back to FAST services
          </Link>
        </div>
      </div>
    </div>
  );
}
