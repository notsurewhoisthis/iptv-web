import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getPlayerComparisons,
  getDeviceComparisons,
  getPlayers,
  getDevices,
} from '@/lib/data-loader';
import { ArrowLeftRight, Tv, Smartphone } from 'lucide-react';

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

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IPTV Comparisons</h1>
        <p className="text-gray-600 mb-8">
          Side-by-side comparisons to help you choose the best IPTV player or streaming device.
        </p>

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

          {/* Build Your Own Comparison */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">All Player Comparisons</h3>
            <div className="flex flex-wrap gap-2">
              {players.slice(0, 10).map((player) => (
                <span
                  key={player.id}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  {player.name}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
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

          {/* All Devices */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">All Device Comparisons</h3>
            <div className="flex flex-wrap gap-2">
              {devices.slice(0, 10).map((device) => (
                <span
                  key={device.id}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  {device.shortName}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
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
