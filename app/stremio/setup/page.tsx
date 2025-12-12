import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getPlayerDeviceGuides, getStremioArticles } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { STREMIO_CATEGORY_META } from '@/app/stremio/_category';

export const metadata: Metadata = {
  title: STREMIO_CATEGORY_META.setup.title,
  description: STREMIO_CATEGORY_META.setup.description,
};

export default async function StremioSetupPage() {
  const baseUrl = getBaseUrl();
  const [articles, deviceGuides] = await Promise.all([
    getStremioArticles(),
    getPlayerDeviceGuides(),
  ]);

  const setupArticles = articles.filter((a) => a.category === 'setup');
  const setupGuides = deviceGuides.filter((g) => g.playerId === 'stremio').slice(0, 12);

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
          { name: 'Setup', url: `${baseUrl}/stremio/setup` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Stremio</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {STREMIO_CATEGORY_META.setup.title}
          </h1>
          <p className="text-gray-600">{STREMIO_CATEGORY_META.setup.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="How do I set up Stremio safely?"
          answer="Use official downloads, keep addons minimal and trusted, and start with one device as your reference setup before syncing to others."
        />

        {setupGuides.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Device setup guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {setupGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/stremio/setup/${g.deviceId}`}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 hover:shadow-sm transition"
                >
                  <p className="font-semibold text-gray-900">{g.deviceName}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Setup articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {setupArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/stremio/${a.slug}`}
                className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/stremio" className="text-blue-600 hover:underline">
            ← Back to Stremio hub
          </Link>
        </div>
      </div>
    </div>
  );
}

