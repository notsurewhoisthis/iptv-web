import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlayers, getBaseUrl } from '@/lib/data-loader';
import { Star, ArrowRight } from 'lucide-react';
import { CollectionPageSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'IPTV Players - Compare Top Apps for Streaming',
  description:
    'Compare the best IPTV players including TiviMate, Kodi, VLC, and IPTV Smarters. Reviews, features, and setup guides.',
};

export default async function PlayersPage() {
  const players = await getPlayers();
  const baseUrl = getBaseUrl();

  // Featured players for alternatives quick links
  const featuredPlayers = ['tivimate', 'vlc', 'kodi', 'iptv-smarters', 'jamrun'];
  const featuredForAlternatives = players.filter(p => featuredPlayers.includes(p.slug));

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Players"
        description="Compare the best IPTV players including TiviMate, Kodi, VLC, and IPTV Smarters. Reviews, features, and setup guides."
        url={`${baseUrl}/players`}
        numberOfItems={players.length}
      />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IPTV Players</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Compare {players.length} IPTV players to find the best app for your
          streaming needs.
        </p>

        {/* Quick Alternatives Links */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Find Alternatives</h2>
          <div className="flex flex-wrap gap-3">
            {featuredForAlternatives.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}/alternatives`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
              >
                {player.name} alternatives
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="block border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition"
            >
              <Link href={`/players/${player.slug}`}>
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {player.name}
                  </h2>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium dark:text-white">{player.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {player.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      player.pricing.model === 'free'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : player.pricing.model === 'freemium'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {player.pricing.model === 'free'
                      ? 'Free'
                      : player.pricing.model === 'freemium'
                      ? 'Freemium'
                      : player.pricing.price}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                    {player.platforms.length} platforms
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {player.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </Link>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={`/players/${player.slug}/alternatives`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View {player.name} alternatives →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
