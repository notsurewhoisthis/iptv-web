import type { Metadata } from 'next';
import Link from 'next/link';
import { getBestPlayerDevice, getUseCases } from '@/lib/data-loader';
import { Trophy, Star, Zap, Tv, Monitor } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best IPTV Players 2025 - Top Picks for Every Device & Use Case',
  description:
    'Find the best IPTV player for your specific needs. Expert recommendations for free apps, sports streaming, 4K playback, Firestick, Apple TV, and more.',
  keywords: 'best iptv player, free iptv player, iptv for sports, 4k iptv player, best iptv app, iptv firestick, iptv apple tv',
};

export default async function BestPage() {
  const [devicePages, useCasePages] = await Promise.all([
    getBestPlayerDevice(),
    getUseCases(),
  ]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Best IPTV Players 2025</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Expert recommendations to help you find the perfect IPTV player for your specific needs and devices.
        </p>

        {/* Use-Case Rankings Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">By Use Case</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Find the best IPTV player based on what matters most to you - whether it&apos;s price, features, or specific needs.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCasePages.map((page) => (
              <Link
                key={page.slug}
                href={`/best/${page.slug}`}
                className="block p-6 border-2 border-blue-100 bg-blue-50/30 rounded-lg hover:border-blue-300 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {page.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{page.description}</p>

                {/* Quick Answer Preview */}
                <div className="bg-white border border-blue-100 rounded p-3 mb-4">
                  <p className="text-sm text-blue-800 font-medium line-clamp-2">
                    {page.quickAnswer.answer.split('.')[0]}.
                  </p>
                </div>

                {/* Top 3 Rankings */}
                <div className="space-y-2">
                  {page.rankings.slice(0, 3).map((rec, i) => (
                    <div key={rec.playerId} className="flex items-center gap-2">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {rec.rank}
                      </span>
                      <span className="text-sm text-gray-700 capitalize">{rec.playerId.replace(/-/g, ' ')}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-blue-100">
                  <span className="text-sm text-blue-600 group-hover:text-blue-800">
                    View full rankings →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Device-Specific Rankings Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Monitor className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">By Device</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Find the best IPTV player for your specific streaming device.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {devicePages.map((page) => (
              <Link
                key={page.slug}
                href={`/best/${page.slug}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tv className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {page.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{page.description}</p>

                {/* Top 3 Rankings */}
                <div className="space-y-2">
                  {page.content.allRankings.slice(0, 3).map((rec, i) => (
                    <div key={rec.slug} className="flex items-center gap-2">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {rec.rank}
                      </span>
                      <span className="text-sm text-gray-700">{rec.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{rec.rating}/5</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-blue-600 group-hover:text-blue-800">
                    View full rankings →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Trust Our Recommendations */}
        <section className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Rank IPTV Players</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-World Testing</h3>
              <p className="text-sm text-gray-600">
                We test each player on actual devices with real IPTV services to evaluate performance, stability, and user experience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Use Case Focus</h3>
              <p className="text-sm text-gray-600">
                Different users have different needs. We evaluate players based on specific use cases rather than one-size-fits-all ratings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
              <p className="text-sm text-gray-600">
                IPTV players evolve quickly. We regularly update our recommendations to reflect the latest features and improvements.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900">{useCasePages.length}</div>
              <div className="text-sm text-blue-700">Use Case Rankings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">{devicePages.length}</div>
              <div className="text-sm text-blue-700">Device Rankings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">16</div>
              <div className="text-sm text-blue-700">Players Evaluated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">100+</div>
              <div className="text-sm text-blue-700">Hours of Testing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
