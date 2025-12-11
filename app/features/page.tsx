import type { Metadata } from 'next';
import Link from 'next/link';
import { getFeatures, getPlayers, getDevices, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { Sparkles, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Features - EPG, Recording, Catch‑Up, Multi‑Screen & More',
  description:
    'Explore the most important IPTV player features in 2025. Learn what EPG, DVR recording, catch‑up TV, multi‑screen, VOD, and casting do, and which apps support them.',
};

export default async function FeaturesPage() {
  const [features, players, devices] = await Promise.all([
    getFeatures(),
    getPlayers(),
    getDevices(),
  ]);
  const baseUrl = getBaseUrl();

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Features', url: `${baseUrl}/features` },
  ];

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Features"
        description="Explore IPTV player features like EPG, recording, catch‑up, multi‑screen, and more."
        url={`${baseUrl}/features`}
        numberOfItems={features.length}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Features
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            IPTV apps vary a lot. The right features decide whether your streams feel like real TV
            (EPG, channel groups, favorites) or a basic playlist. Use this hub to understand each
            feature and find the players and devices that support it best.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="Which IPTV features matter most?"
          answer="Start with EPG (TV guide), playlist management, and stable playback. Add catch‑up and recording if you watch time‑shifted TV, and multi‑screen or casting if you share a screen or watch sports."
          highlight={`We track ${features.length} core features across ${players.length} players and ${devices.length} devices.`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const supportingPlayers = players.filter((p) =>
              (p.features || []).includes(feature.slug)
            );
            const supportingDevices = devices.filter((d) =>
              (d.supportedPlayers || []).some((ps) =>
                supportingPlayers.map((sp) => sp.slug).includes(ps)
              )
            );

            const topPlayers = supportingPlayers
              .slice()
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3);

            return (
              <article
                key={feature.slug}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition bg-white"
              >
                <Link href={`/features/${feature.slug}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {supportingPlayers.length} players
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {supportingDevices.length} devices
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Difficulty: {feature.difficulty}
                    </span>
                  </div>
                  {topPlayers.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Top players
                      </p>
                      {topPlayers.map((p) => (
                        <div key={p.slug} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-800">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            );
          })}
        </div>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={[
            'IPTV player testing',
            'EPG & playlist parsing',
            'Streaming device optimization',
            'Buffering and playback diagnostics',
          ]}
          bio="We test IPTV apps weekly on real devices with large M3U/Xtream playlists. Our feature notes are based on hands‑on setup, performance checks, and verified provider behavior."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

