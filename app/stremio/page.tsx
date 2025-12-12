import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getPlayerDeviceGuides, getPlayerTroubleshooting, getStremioArticles } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { BookOpen, Wrench, Puzzle, Shield, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Stremio Guides, Troubleshooting & Resources',
  description:
    'Stremio knowledge base: safe setup, addon basics, troubleshooting fixes, and best practices for smooth streaming across devices.',
};

const CATEGORY_CARDS = [
  {
    href: '/stremio/basics',
    title: 'Basics',
    description: 'What Stremio is, how it works, and safe defaults.',
    icon: BookOpen,
  },
  {
    href: '/stremio/setup',
    title: 'Setup',
    description: 'Account sync, device checklists, and clean configuration.',
    icon: Shield,
  },
  {
    href: '/stremio/addons',
    title: 'Addons',
    description: 'What addons do and how to choose them safely.',
    icon: Puzzle,
  },
  {
    href: '/stremio/troubleshooting',
    title: 'Troubleshooting',
    description: 'Fix buffering, subtitle issues, casting, and common errors.',
    icon: Wrench,
  },
];

export default async function StremioHubPage() {
  const baseUrl = getBaseUrl();
  const [articles, deviceGuides, troubleshooting] = await Promise.all([
    getStremioArticles(),
    getPlayerDeviceGuides(),
    getPlayerTroubleshooting(),
  ]);

  const stremioSetupGuides = deviceGuides
    .filter((g) => g.playerId === 'stremio')
    .slice(0, 8);

  const stremioTroubleshooting = troubleshooting
    .filter((g) => g.playerId === 'stremio')
    .slice(0, 6);

  const byCategory = articles.reduce<Record<string, typeof articles>>((acc, a) => {
    (acc[a.category] ||= []).push(a);
    return acc;
  }, {});

  const topPicks = [
    ...(byCategory.basics || []).slice(0, 3),
    ...(byCategory.troubleshooting || []).slice(0, 3),
    ...(byCategory.addons || []).slice(0, 2),
  ].slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
        ]}
      />

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-2">Knowledge Base</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Stremio Guides, Troubleshooting & Resources
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Safe, practical Stremio help: addon basics, device checklists, and fixes for the most common
            playback problems.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <QuickAnswer
            question="What will I find in the Stremio section?"
            answer="Device setup shortcuts, addon safety basics, and step‑by‑step troubleshooting for common Stremio issues—written to be clear, repeatable, and focused on legal use."
            highlight="Tip: For traditional IPTV (M3U/Xtream), use an IPTV player instead."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CATEGORY_CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <c.icon className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">{c.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-3">{c.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:underline">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Top Stremio articles</h2>
              <Link href="/stremio/basics" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {topPicks.map((a) => (
                <Link
                  key={a.slug}
                  href={`/stremio/${a.slug}`}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition"
                >
                  <p className="text-xs text-gray-500 mb-1 capitalize">{a.category.replace(/-/g, ' ')}</p>
                  <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{a.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-8">
            <section className="border border-gray-200 rounded-xl p-5 bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Device setup shortcuts</h2>
              <ul className="space-y-2 text-sm">
                {stremioSetupGuides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/stremio/setup/${g.deviceId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {g.deviceName}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/guides/stremio/setup/firestick" className="text-sm text-gray-600 hover:underline">
                  More Stremio setup guides →
                </Link>
              </div>
            </section>

            {stremioTroubleshooting.length > 0 && (
              <section className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Common fixes</h2>
                <ul className="space-y-2 text-sm">
                  {stremioTroubleshooting.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/troubleshooting/players/${t.playerId}/${t.issueId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t.issueName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="border border-gray-200 rounded-xl p-5 bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Need IPTV playlists?</h2>
              <p className="text-sm text-gray-600 mb-3">
                Stremio isn’t a traditional M3U/Xtream IPTV app. If you’re looking for public playlists,
                start here:
              </p>
              <Link href="/legal-iptv" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
                Public playlists directory <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

