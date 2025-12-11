import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPlayers,
  getPlayerDeviceGuides,
  getBaseUrl,
} from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { Star, ArrowRight, MonitorPlay } from 'lucide-react';

interface PageProps {
  params: Promise<{ platform: string }>;
}

const platformLabels: Record<string, string> = {
  android: 'Android',
  'android-tv': 'Android TV',
  'apple-tv': 'Apple TV',
  firestick: 'Fire TV / Firestick',
  ios: 'iPhone & iOS',
  'lg-tv': 'LG Smart TV (webOS)',
  linux: 'Linux',
  mac: 'Mac',
  'nvidia-shield': 'NVIDIA Shield',
  'samsung-tv': 'Samsung Smart TV (Tizen)',
  'smart-tv': 'Smart TV',
  'vision-pro': 'Apple Vision Pro',
  windows: 'Windows',
};

function getPlatformLabel(platform: string) {
  return (
    platformLabels[platform] ||
    platform
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateStaticParams() {
  const players = await getPlayers();
  const platforms = Array.from(
    new Set(players.flatMap((p) => p.platforms || []))
  );
  return platforms.map((platform) => ({ platform }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const players = await getPlayers();
  const platformPlayers = players.filter((p) =>
    (p.platforms || []).includes(platform)
  );

  if (platformPlayers.length === 0) {
    return { title: 'Platform Not Found' };
  }

  const baseUrl = getBaseUrl();
  const label = getPlatformLabel(platform);

  return {
    title: `Best IPTV Players for ${label} 2025 - Top Apps Reviewed`,
    description: `Compare ${platformPlayers.length} IPTV players that work on ${label}. Ratings, features, pricing, setup guides, and troubleshooting.`,
    keywords: [
      `best iptv player for ${label.toLowerCase()}`,
      `${label.toLowerCase()} iptv app`,
      `iptv players ${label.toLowerCase()}`,
      'iptv player reviews',
      'iptv setup guides',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/players/platform/${platform}`,
    },
    openGraph: {
      title: `Best IPTV Players for ${label}`,
      description: `Top IPTV apps for ${label} with hands‑on reviews and setup help.`,
      type: 'website',
      url: `${baseUrl}/players/platform/${platform}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best IPTV Players for ${label}`,
      description: `Top IPTV apps for ${label} with ratings and setup guides.`,
    },
  };
}

export default async function PlayersByPlatformPage({ params }: PageProps) {
  const { platform } = await params;
  const [players, guides] = await Promise.all([
    getPlayers(),
    getPlayerDeviceGuides(),
  ]);

  const platformPlayers = players.filter((p) =>
    (p.platforms || []).includes(platform)
  );

  if (platformPlayers.length === 0) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const label = getPlatformLabel(platform);
  const topRated = [...platformPlayers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const setupGuides = guides
    .filter((g) => g.deviceId === platform)
    .slice(0, 6);

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name={`IPTV Players for ${label}`}
        description={`Compare IPTV players that work on ${label}.`}
        url={`${baseUrl}/players/platform/${platform}`}
        numberOfItems={platformPlayers.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Players', url: `${baseUrl}/players` },
          { name: label, url: `${baseUrl}/players/platform/${platform}` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MonitorPlay className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Players for {label}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            We’ve tested {platformPlayers.length} IPTV apps that run on {label}. Use
            this page to pick the right player for your device, features, and budget.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`What is the best IPTV player for ${label}?`}
          answer={
            topRated.length > 0
              ? `${topRated[0].name} is the top‑rated option for ${label} right now, with strong EPG support and reliable playback. Compare the apps below based on features like catch‑up, recording, multi‑screen, and casting.`
              : `Compare the apps below based on features like EPG, catch‑up, recording, and casting to find the best match for ${label}.`
          }
          highlight={
            topRated.length > 0
              ? `Top picks: ${topRated.map((p) => p.name).join(', ')}`
              : undefined
          }
        />

        {topRated.length > 0 && (
          <section className="mt-8 mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top rated on {label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRated.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}`}
                  className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{player.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{player.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {player.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All compatible players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformPlayers.map((player) => (
              <article
                key={player.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-md transition bg-white"
              >
                <Link href={`/players/${player.slug}`} className="block">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{player.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {player.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {player.pricing.price}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {player.platforms.length} platforms
                    </span>
                  </div>
                </Link>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/players/${player.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Read review
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {setupGuides.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Setup guides for {label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {setupGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition bg-white"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV App Reviewers & Testers"
          expertise={[
            `${label} player testing`,
            'Large‑playlist performance checks',
            'EPG and catch‑up validation',
            'Cross‑device streaming optimization',
          ]}
          bio="We install, configure, and benchmark IPTV apps on real hardware, using large M3U and Xtream playlists. Platform pages are updated when apps change features or pricing."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

