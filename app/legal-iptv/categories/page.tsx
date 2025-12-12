import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { LastUpdated } from '@/components/GeoComponents';

export const metadata: Metadata = {
  title: 'Public IPTV Playlists by Category (M3U)',
  description:
    'Browse publicly available IPTV playlists by category (news, sports, movies, kids, documentaries, and more).',
};

export default async function LegalIptvCategoriesPage() {
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
          { name: 'Categories', url: `${baseUrl}/legal-iptv/categories` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse by category</h1>
          <p className="text-gray-600">
            Category playlists from {data.source.name}. Use an IPTV player to open the M3U URL.
          </p>
          <LastUpdated date={data.generatedAt} />
        </header>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.categories.map((c) => (
            <Link
              key={c.id}
              href={`/legal-iptv/categories/${c.id}`}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white hover:shadow-sm hover:border-gray-300 transition"
            >
              <span className="font-medium text-gray-900">{c.label}</span>
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

