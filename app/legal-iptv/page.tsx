import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { JAMRUN_APPSTORE_URL } from '@/lib/jamrun';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { CopyButton } from '@/components/CopyButton';
import { LastUpdated } from '@/components/GeoComponents';
import { Globe, FolderOpen, Languages, Tv, ArrowRight, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Public IPTV Playlists (M3U) — Free & Legal-First Directory',
  description:
    'Browse publicly available IPTV playlists (M3U) by country, category, language, and official FAST services. Always verify rights and availability in your region.',
};

export default async function LegalIptvHubPage() {
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  const topCategories = data.categories
    .filter((c) => !['xxx', 'undefined'].includes(c.id))
    .slice(0, 12);

  const topServices = data.fastServices.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
        ]}
      />

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-2">Directory</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Public IPTV Playlists (M3U)
          </h1>
          <p className="text-gray-600 max-w-3xl">
            A practical directory of <strong>publicly accessible</strong> IPTV playlists.
            Streaming rights and availability vary by country, provider, and channel — always use legal sources.
          </p>
          <LastUpdated date={data.generatedAt} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Legal-first note</p>
              <p className="text-sm text-amber-900/90">
                “Public” does not automatically mean “licensed.” Verify rights and local laws.
                Prefer well-known, official FAST services when possible.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link
            href="/legal-iptv/fast"
            className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Tv className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">FAST services</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Official, ad‑supported live TV playlists (by country).
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:underline">
              Browse <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/legal-iptv/countries"
            className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">By country</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Browse country-level playlists (ISO codes).
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:underline">
              Browse <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/legal-iptv/categories"
            className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">By category</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              News, sports, movies, kids, documentaries, and more.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:underline">
              Browse <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <Link
            href="/legal-iptv/languages"
            className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <Languages className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">By language</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Browse playlists by language code.
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:underline">
              Browse <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Quick copy (full index)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Copy the full index playlist (from {data.source.name}). Then open it in an IPTV player.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <code className="text-xs bg-gray-100 rounded-lg px-3 py-2 break-all">
              {data.indexes.all}
            </code>
            <CopyButton text={data.indexes.all} label="Copy M3U URL" />
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
        </section>

        <section className="grid lg:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Popular categories</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {topCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/legal-iptv/categories/${c.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/legal-iptv/categories" className="text-sm text-gray-600 hover:underline">
                View all categories →
              </Link>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Official FAST services</h2>
            <div className="space-y-2">
              {topServices.map((s) => (
                <Link
                  key={s.id}
                  href={`/legal-iptv/fast/${s.id}`}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:border-gray-300 hover:shadow-sm transition"
                >
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <span className="text-sm text-blue-600">Browse</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/legal-iptv/fast" className="text-sm text-gray-600 hover:underline">
                View all FAST services →
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Attribution</h2>
          <p className="text-sm text-gray-600">
            Data sourced from{' '}
            <a
              href={data.source.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {data.source.name}
            </a>
            . License: {data.source.license || 'Unknown'}.
          </p>
        </section>
      </main>
    </div>
  );
}
