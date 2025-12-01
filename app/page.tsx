import Link from 'next/link';
import { getPlayers, getDevices } from '@/lib/data-loader';
import { Tv, Smartphone, MonitorPlay, Settings, ArrowRight } from 'lucide-react';

export default async function Home() {
  const players = await getPlayers();
  const devices = await getDevices();

  const topPlayers = players.slice(0, 6);
  const topDevices = devices.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Complete IPTV Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Setup guides, player comparisons, and troubleshooting tips for all
            your IPTV streaming needs. From Firestick to Apple TV, we have you
            covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Browse Guides
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/players"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Compare Players
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/players"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <MonitorPlay className="h-6 w-6 text-gray-700" />
              <div>
                <div className="font-medium text-gray-900">IPTV Players</div>
                <div className="text-sm text-gray-500">{players.length} apps</div>
              </div>
            </Link>
            <Link
              href="/devices"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Tv className="h-6 w-6 text-gray-700" />
              <div>
                <div className="font-medium text-gray-900">Devices</div>
                <div className="text-sm text-gray-500">{devices.length} devices</div>
              </div>
            </Link>
            <Link
              href="/troubleshooting"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Settings className="h-6 w-6 text-gray-700" />
              <div>
                <div className="font-medium text-gray-900">Troubleshooting</div>
                <div className="text-sm text-gray-500">Fix issues</div>
              </div>
            </Link>
            <Link
              href="/compare"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <Smartphone className="h-6 w-6 text-gray-700" />
              <div>
                <div className="font-medium text-gray-900">Compare</div>
                <div className="text-sm text-gray-500">Side by side</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Players */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular IPTV Players</h2>
            <Link href="/players" className="text-gray-600 hover:text-gray-900 text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPlayers.map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {player.shortDescription}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {player.rating}/5
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
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
                  <span className="text-xs text-gray-500">
                    {player.platforms.length} platforms
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Devices */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Popular Streaming Devices
            </h2>
            <Link href="/devices" className="text-gray-600 hover:text-gray-900 text-sm">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topDevices.map((device) => (
              <Link
                key={device.id}
                href={`/devices/${device.slug}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
              >
                <h3 className="font-semibold text-gray-900">{device.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {device.shortDescription}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {device.os}
                  </span>
                  <span className="text-xs text-gray-500">
                    {device.supportedPlayers.length} apps
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Check out our most popular setup guides and start streaming in
            minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/guides/tivimate/setup/firestick"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
            >
              TiviMate on Firestick
            </Link>
            <Link
              href="/guides/kodi/setup/firestick"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Kodi on Firestick
            </Link>
            <Link
              href="/guides/iptv-smarters/setup/firestick"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
            >
              IPTV Smarters on Firestick
            </Link>
            <Link
              href="/best/best-iptv-player-firestick"
              className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
            >
              Best Player for Firestick
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
