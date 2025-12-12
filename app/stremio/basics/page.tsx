import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getStremioArticles } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { STREMIO_CATEGORY_META } from '@/app/stremio/_category';

export const metadata: Metadata = {
  title: STREMIO_CATEGORY_META.basics.title,
  description: STREMIO_CATEGORY_META.basics.description,
};

export default async function StremioBasicsPage() {
  const baseUrl = getBaseUrl();
  const articles = await getStremioArticles();
  const basics = articles.filter((a) => a.category === 'basics');

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
          { name: 'Basics', url: `${baseUrl}/stremio/basics` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Stremio</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {STREMIO_CATEGORY_META.basics.title}
          </h1>
          <p className="text-gray-600">{STREMIO_CATEGORY_META.basics.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="Where should I start with Stremio?"
          answer="Start with the basics: what Stremio is, how addons work, and what a safe, legal setup looks like. Then move on to setup and troubleshooting."
          highlight="If you have an M3U/Xtream playlist, use an IPTV player instead."
        />

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {basics.map((a) => (
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

