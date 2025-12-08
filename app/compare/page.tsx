import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getPlayerComparisons,
  getDeviceComparisons,
  getPlayers,
  getDevices,
  getBaseUrl,
} from '@/lib/data-loader';
import { ArrowLeftRight, Tv, Smartphone, ArrowRight } from 'lucide-react';
import { CollectionPageSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'IPTV Comparisons - Players & Devices Head-to-Head',
  description:
    'Compare IPTV players and streaming devices side by side. Find the best option for your needs with our detailed comparison guides.',
};

export default async function ComparePage() {
  const [playerComparisons, deviceComparisons, players, devices] = await Promise.all([
    getPlayerComparisons(),
    getDeviceComparisons(),
    getPlayers(),
    getDevices(),
  ]);

  // Get popular comparisons
  const popularPlayerComparisons = playerComparisons.slice(0, 6);
  const popularDeviceComparisons = deviceComparisons.slice(0, 6);

  // Featured players for alternatives
  const featuredAlternatives = ['tivimate', 'vlc', 'kodi', 'iptv-smarters', 'jamrun'];
  const alternativesPlayers = players.filter(p => featuredAlternatives.includes(p.slug));
  const baseUrl = getBaseUrl();
  const totalComparisons = playerComparisons.length + deviceComparisons.length;

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Comparisons"
        description="Compare IPTV players and streaming devices side by side. Find the best option for your needs."
        url={`${baseUrl}/compare`}
        numberOfItems={totalComparisons}
      />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IPTV Comparisons</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Side-by-side comparisons to help you choose the best IPTV player or streaming device.
        </p>

        {/* Find Alternatives Section */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Looking for Alternatives?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explore all alternatives to popular IPTV players and find the perfect fit for your platform.
          </p>
          <div className="flex flex-wrap gap-3">
            {alternativesPlayers.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}/alternatives`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:border-blue-400 hover:shadow-sm transition"
              >
                {player.name} alternatives
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </section>

        {/* Player Comparisons */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-6 w-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">IPTV Player Comparisons</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {popularPlayerComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/players/${comparison.player1Id}/vs/${comparison.player2Id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="font-medium text-gray-900">{comparison.player1Name}</span>
                  <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{comparison.player2Name}</span>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Side-by-side comparison
                </p>
              </Link>
            ))}
          </div>

          {/* Browse by Player */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Browse Comparisons by Player</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click a player to see all comparisons featuring it</p>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}`}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {player.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {playerComparisons.length} total player comparisons available
            </p>
          </div>
        </section>

        {/* Device Comparisons */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="h-6 w-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900">Device Comparisons</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {popularDeviceComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/devices/${comparison.device1Id}/vs/${comparison.device2Id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="font-medium text-gray-900">{comparison.device1ShortName}</span>
                  <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{comparison.device2ShortName}</span>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Side-by-side comparison
                </p>
              </Link>
            ))}
          </div>

          {/* Browse by Device */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Browse Comparisons by Device</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click a device to see all comparisons featuring it</p>
            <div className="flex flex-wrap gap-2">
              {devices.map((device) => (
                <Link
                  key={device.id}
                  href={`/devices/${device.slug}`}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {device.shortName}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              {deviceComparisons.length} total device comparisons available
            </p>
          </div>
        </section>

        {/* Stats */}
        <div className="p-6 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900">{playerComparisons.length}</div>
              <div className="text-sm text-blue-700">Player Comparisons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">{deviceComparisons.length}</div>
              <div className="text-sm text-blue-700">Device Comparisons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
