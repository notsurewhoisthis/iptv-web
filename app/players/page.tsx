import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlayers } from '@/lib/data-loader';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Players - Compare Top Apps for Streaming',
  description:
    'Compare the best IPTV players including TiviMate, Kodi, VLC, and IPTV Smarters. Reviews, features, and setup guides.',
};

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IPTV Players</h1>
        <p className="text-gray-600 mb-8">
          Compare {players.length} IPTV players to find the best app for your
          streaming needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="block border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {player.name}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{player.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {player.shortDescription}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    player.pricing.model === 'free'
                      ? 'bg-green-100 text-green-700'
                      : player.pricing.model === 'freemium'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {player.pricing.model === 'free'
                    ? 'Free'
                    : player.pricing.model === 'freemium'
                    ? 'Freemium'
                    : player.pricing.price}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {player.platforms.length} platforms
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {player.features.slice(0, 3).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
