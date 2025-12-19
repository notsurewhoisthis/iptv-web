import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { LastUpdated } from '@/components/GeoComponents';

export const metadata: Metadata = {
  title: 'Public IPTV Playlists by Language (M3U)',
  description:
    'Browse publicly available IPTV playlists by language code. Copy the M3U URL and open it in an IPTV player.',
  alternates: {
    canonical: `${getBaseUrl()}/legal-iptv/languages`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function LegalIptvLanguagesPage() {
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
          { name: 'Languages', url: `${baseUrl}/legal-iptv/languages` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by language</h1>
          <p className="text-gray-600">
            Language playlists from {data.source.name}. Availability varies by region.
          </p>
          <LastUpdated date={data.generatedAt} />
        </header>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.languages.map((l) => (
            <Link
              key={l.code}
              href={`/legal-iptv/languages/${l.code}`}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white hover:shadow-sm hover:border-gray-300 transition"
            >
              <span className="font-medium text-gray-900">{l.label}</span>
              <span className="ml-2 text-xs text-gray-500">{l.code}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/legal-iptv" className="text-blue-600 hover:underline">
            ← Back to directory
          </Link>
        </div>
      </div>
    </div>
  );
}
