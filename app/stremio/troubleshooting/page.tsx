import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getPlayerTroubleshooting, getStremioArticles } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { STREMIO_CATEGORY_META } from '@/app/stremio/_category';

export const metadata: Metadata = {
  title: STREMIO_CATEGORY_META.troubleshooting.title,
  description: STREMIO_CATEGORY_META.troubleshooting.description,
};

export default async function StremioTroubleshootingPage() {
  const baseUrl = getBaseUrl();
  const [articles, troubleshooting] = await Promise.all([
    getStremioArticles(),
    getPlayerTroubleshooting(),
  ]);

  const troubleshootingArticles = articles.filter((a) => a.category === 'troubleshooting');
  const stremioTroubleshooting = troubleshooting.filter((g) => g.playerId === 'stremio');

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
          { name: 'Troubleshooting', url: `${baseUrl}/stremio/troubleshooting` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Stremio</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {STREMIO_CATEGORY_META.troubleshooting.title}
          </h1>
          <p className="text-gray-600">{STREMIO_CATEGORY_META.troubleshooting.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="What should I troubleshoot first?"
          answer="Start with network stability and device performance. Then isolate whether the issue is title-specific or happens for everything."
        />

        {stremioTroubleshooting.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Troubleshooting guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stremioTroubleshooting.map((g) => (
                <Link
                  key={g.slug}
                  href={`/troubleshooting/players/${g.playerId}/${g.issueId}`}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How-to fixes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {troubleshootingArticles.map((a) => (
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

