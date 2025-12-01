import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlayerDeviceGuides, getPlayers, getDevices } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'IPTV Setup Guides - Complete Installation Instructions',
  description:
    'Step-by-step IPTV player setup guides for all devices. Learn how to install and configure TiviMate, Kodi, VLC, and more on Firestick, Apple TV, Android, and other devices.',
};

export default async function GuidesPage() {
  const [guides, players, devices] = await Promise.all([
    getPlayerDeviceGuides(),
    getPlayers(),
    getDevices(),
  ]);

  // Group guides by player
  const guidesByPlayer = players.map((player) => ({
    player,
    guides: guides.filter((g) => g.playerId === player.id),
  })).filter((group) => group.guides.length > 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IPTV Setup Guides</h1>
        <p className="text-gray-600 mb-8">
          Complete installation and setup instructions for every IPTV player on every device.
        </p>

        {/* Quick Device Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Browse by Device</h2>
          <div className="flex flex-wrap gap-2">
            {devices.slice(0, 8).map((device) => (
              <Link
                key={device.id}
                href={`/devices/${device.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                {device.shortName}
              </Link>
            ))}
          </div>
        </div>

        {/* Guides by Player */}
        <div className="space-y-12">
          {guidesByPlayer.map(({ player, guides: playerGuides }) => (
            <section key={player.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                <Link
                  href={`/players/${player.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Player Details →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {playerGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">
                      {guide.deviceShortName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {guide.content.steps.length} steps • {guide.content.faqs.length} FAQs
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{guides.length}</div>
              <div className="text-sm text-gray-500">Setup Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{players.length}</div>
              <div className="text-sm text-gray-500">IPTV Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{devices.length}</div>
              <div className="text-sm text-gray-500">Devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
