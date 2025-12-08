import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlayerDeviceGuides, getPlayers, getDevices, getTechnicalGuides, getBaseUrl } from '@/lib/data-loader';
import { BookOpen, Wrench, AlertTriangle, Settings } from 'lucide-react';
import { CollectionPageSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'IPTV Guides - Setup, Troubleshooting & Technical Tutorials',
  description:
    'Complete IPTV guides including setup tutorials, troubleshooting fixes, and technical how-tos. Learn to fix buffering, setup EPG, configure M3U playlists, and more.',
  keywords: 'iptv guide, iptv setup, fix iptv buffering, epg setup, m3u playlist, iptv troubleshooting',
};

export default async function GuidesPage() {
  const [setupGuides, players, devices, technicalGuides] = await Promise.all([
    getPlayerDeviceGuides(),
    getPlayers(),
    getDevices(),
    getTechnicalGuides(),
  ]);

  // Group setup guides by player
  const guidesByPlayer = players.map((player) => ({
    player,
    guides: setupGuides.filter((g) => g.playerId === player.id),
  })).filter((group) => group.guides.length > 0);

  // Separate technical guides by category
  const troubleshootingGuides = technicalGuides.filter((g) => g.category === 'troubleshooting');
  const setupTechnicalGuides = technicalGuides.filter((g) => g.category === 'setup');
  const baseUrl = getBaseUrl();
  const totalGuides = setupGuides.length + technicalGuides.length;

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Guides"
        description="Complete IPTV guides including setup tutorials, troubleshooting fixes, and technical how-tos."
        url={`${baseUrl}/guides`}
        numberOfItems={totalGuides}
      />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">IPTV Guides</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Complete guides for IPTV setup, troubleshooting, and optimization. From fixing buffering to setting up EPG.
        </p>

        {/* Technical Guides - Featured Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Technical Guides</h2>
          </div>
          <p className="text-gray-600 mb-6">
            In-depth tutorials for common IPTV issues and setups. These guides help you fix problems and optimize your streaming.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {technicalGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/technical/${guide.slug}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  {guide.category === 'troubleshooting' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Settings className="h-5 w-5 text-blue-500" />
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    guide.category === 'troubleshooting'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {guide.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{guide.description}</p>
                <div className="bg-blue-50 border border-blue-100 rounded p-2 text-sm text-blue-800">
                  <strong>Quick Answer:</strong> {guide.quickAnswer.answer.split('.')[0]}...
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Device Filter */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Browse Setup Guides by Device</h2>
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
        </section>

        {/* Setup Guides by Player */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Setup Guides by Player</h2>
          <div className="space-y-12">
            {guidesByPlayer.slice(0, 6).map(({ player, guides: playerGuides }) => (
              <div key={player.id}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{player.name}</h3>
                  <Link
                    href={`/players/${player.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Player Details →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playerGuides.slice(0, 6).map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {guide.deviceShortName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {guide.content.steps.length} steps
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{technicalGuides.length}</div>
              <div className="text-sm text-gray-500">Technical Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{setupGuides.length}</div>
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
