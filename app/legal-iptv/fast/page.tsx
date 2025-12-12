import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { LastUpdated } from '@/components/GeoComponents';

export const metadata: Metadata = {
  title: 'Official Free Live TV (FAST) Playlists',
  description:
    'Browse official ad‑supported live TV (FAST) playlists by provider and country. Availability varies by region.',
};

export default async function LegalIptvFastServicesPage() {
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
          { name: 'FAST services', url: `${baseUrl}/legal-iptv/fast` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Official FAST services</h1>
          <p className="text-gray-600">
            These are well-known, ad‑supported streaming TV providers. Playlists are grouped by country when available.
          </p>
          <LastUpdated date={data.generatedAt} />
        </header>

        <div className="space-y-3">
          {data.fastServices.map((s) => (
            <Link
              key={s.id}
              href={`/legal-iptv/fast/${s.id}`}
              className="flex items-start justify-between gap-4 border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm hover:border-gray-300 transition"
            >
              <div>
                <h2 className="font-semibold text-gray-900">{s.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                <p className="text-xs text-gray-500 mt-2">{s.playlists.length} playlists</p>
              </div>
              <span className="text-sm text-blue-600">Browse</span>
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

