import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getStremioArticles } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { STREMIO_CATEGORY_META } from '@/app/stremio/_category';

export const metadata: Metadata = {
  title: STREMIO_CATEGORY_META.addons.title,
  description: STREMIO_CATEGORY_META.addons.description,
};

export default async function StremioAddonsPage() {
  const baseUrl = getBaseUrl();
  const articles = await getStremioArticles();
  const addons = articles.filter((a) => a.category === 'addons');

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
          { name: 'Addons', url: `${baseUrl}/stremio/addons` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Stremio</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {STREMIO_CATEGORY_META.addons.title}
          </h1>
          <p className="text-gray-600">{STREMIO_CATEGORY_META.addons.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="What are Stremio addons?"
          answer="Addons extend Stremio with catalogs and features. Install only addons you understand and that use legal sources."
          highlight="Safety tip: avoid vague addons promising premium content for free."
        />

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {addons.map((a) => (
            <Link
              key={a.slug}
              href={`/stremio/${a.slug}`}
              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
            >
              <h2 className="font-semibold text-gray-900 mb-1">{a.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/stremio" className="text-blue-600 hover:underline">
            ← Back to Stremio hub
          </Link>
        </div>
      </div>
    </div>
  );
}

