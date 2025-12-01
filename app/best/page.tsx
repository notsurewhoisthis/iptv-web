import type { Metadata } from 'next';
import Link from 'next/link';
import { getBestPlayerDevice } from '@/lib/data-loader';
import { Trophy, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best IPTV Players - Top Picks for Every Use Case',
  description:
    'Find the best IPTV player for your specific needs. Expert recommendations for Firestick, Apple TV, beginners, power users, and more.',
};

export default async function BestPage() {
  const bestForPages = await getBestPlayerDevice();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Best IPTV Players</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Expert recommendations to help you find the perfect IPTV player for your specific needs and devices.
        </p>

        {/* Best For Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestForPages.map((page) => (
            <Link
              key={page.slug}
              href={`/best/${page.slug}`}
              className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {page.title}
                </h2>
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
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-900">{bestForPages.length}</div>
              <div className="text-sm text-blue-700">Use Case Rankings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">15</div>
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
