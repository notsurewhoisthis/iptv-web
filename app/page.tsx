import Link from 'next/link';
import { getPlayers, getDevices, getBaseUrl } from '@/lib/data-loader';
import { Tv, Smartphone, MonitorPlay, Settings, ArrowRight, Star } from 'lucide-react';
import { WebsiteSchema, OrganizationSchema } from '@/components/JsonLd';
import { QuickAnswer } from '@/components/GeoComponents';

export default async function Home() {
  const players = await getPlayers();
  const devices = await getDevices();
  const baseUrl = getBaseUrl();

  const topPlayers = players.sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topDevices = devices.slice(0, 6);
  const topPlayer = topPlayers[0];

  return (
    <div className="min-h-screen">
      {/* Structured Data for GEO */}
      <WebsiteSchema baseUrl={baseUrl} />
      <OrganizationSchema baseUrl={baseUrl} />

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

      {/* QuickAnswer for GEO - AI extracts this first */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 mb-8">
        <QuickAnswer
          question="What is IPTV and which player should I use?"
          answer={`IPTV (Internet Protocol Television) lets you stream live TV over the internet. ${topPlayer ? `The top-rated IPTV player is ${topPlayer.name} with a ${topPlayer.rating}/5 rating. ` : ''}We've reviewed ${players.length} players across ${devices.length} devices to help you find the best option.`}
          highlight={topPlayer ? `Top Pick: ${topPlayer.name} - ${topPlayer.pricing.price}` : undefined}
        />
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

      {/* Popular Players - Ranked for GEO */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Rated IPTV Players</h2>
            <Link href="/players" className="text-gray-600 hover:text-gray-900 text-sm">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {topPlayers.map((player, index) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-500">{player.shortDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{player.rating}</span>
                  </div>
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

      {/* Find Alternatives Section */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Find Alternatives
            </h2>
            <Link href="/compare" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
              Compare all →
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
            Looking for alternatives to your current IPTV player? We compare all major players to help you find the perfect fit.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/players/tivimate/alternatives"
              className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition text-center"
            >
              <span className="font-medium text-gray-900 dark:text-white">TiviMate</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Android favorite</span>
            </Link>
            <Link
              href="/players/jamrun/alternatives"
              className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition text-center"
            >
              <span className="font-medium text-gray-900 dark:text-white">JamRun</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Best for Apple</span>
            </Link>
            <Link
              href="/players/kodi/alternatives"
              className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition text-center"
            >
              <span className="font-medium text-gray-900 dark:text-white">Kodi</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Power users</span>
            </Link>
            <Link
              href="/players/vlc/alternatives"
              className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition text-center"
            >
              <span className="font-medium text-gray-900 dark:text-white">VLC</span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Cross-platform</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Guides CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Check out our most popular setup guides and start streaming in
            minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/guides/tivimate/setup/firestick"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              TiviMate on Firestick
            </Link>
            <Link
              href="/guides/kodi/setup/firestick"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Kodi on Firestick
            </Link>
            <Link
              href="/guides/iptv-smarters/setup/firestick"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              IPTV Smarters on Firestick
            </Link>
            <Link
              href="/best/best-iptv-player-firestick"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Best Player for Firestick
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
