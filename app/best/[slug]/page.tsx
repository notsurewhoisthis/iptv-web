import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getBestPlayerDevice,
  getBestForPage,
  getBaseUrl,
} from '@/lib/data-loader';
import { ChevronRight, Trophy, Star, Check, X } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getBestPlayerDevice();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getBestForPage(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: page.metaTitle,
    description: page.description,
    keywords: page.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/best/${slug}`,
    },
  };
}

export default async function BestForPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getBestForPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/best" className="hover:text-gray-900">Best IPTV Players</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">{page.deviceShortName}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600">{page.description}</p>
        </header>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{page.content.intro}</p>
        </section>

        {/* Top Pick */}
        {page.content.topPick ? (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Top Pick</h2>
            <div className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{page.content.topPick.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{page.content.topPick.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{page.content.topPick.pricing.price}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{page.content.topPick.description}</p>
                  <p className="text-blue-700 font-medium mb-4">{page.content.topPick.whyTopPick}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-800 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {page.content.topPick.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {page.content.topPick.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                            <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/players/${page.content.topPick.slug}`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                  >
                    View Full Review →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Limited IPTV Player Support</h2>
              <p className="text-gray-700">
                Unfortunately, {page.deviceName} has limited IPTV player options available.
                Consider using a dedicated streaming device like a Firestick or Android TV box for better app support.
              </p>
              <Link
                href="/best/best-iptv-player-firestick"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                See Best Firestick IPTV Players →
              </Link>
            </div>
          </section>
        )}

        {/* Runner Up & Budget Pick */}
        {(page.content.runnerUp || page.content.budgetPick) && (
          <section className="mb-8">
            <div className={`grid gap-6 ${page.content.runnerUp && page.content.budgetPick ? 'md:grid-cols-2' : ''}`}>
              {/* Runner Up */}
              {page.content.runnerUp && (
                <div className="border border-gray-300 bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">RUNNER UP</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{page.content.runnerUp.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{page.content.runnerUp.rating}</span>
                    <span className="text-sm text-gray-500">{page.content.runnerUp.pricing.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{page.content.runnerUp.description}</p>
                  <ul className="space-y-1 mb-4">
                    {page.content.runnerUp.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/players/${page.content.runnerUp.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Review →
                  </Link>
                </div>
              )}

              {/* Budget Pick */}
              {page.content.budgetPick && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-200 text-green-700 text-xs font-medium rounded">BUDGET PICK</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{page.content.budgetPick.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{page.content.budgetPick.rating}</span>
                    <span className="text-sm text-gray-500">{page.content.budgetPick.pricing.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{page.content.budgetPick.description}</p>
                  <p className="text-green-700 text-sm font-medium mb-4">{page.content.budgetPick.whyBudget}</p>
                  <Link
                    href={`/players/${page.content.budgetPick.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Review →
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Full Rankings */}
        {page.content.allRankings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Rankings</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Player</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">Highlight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {page.content.allRankings.map((player) => (
                    <tr key={player.slug} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          player.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          player.rank === 2 ? 'bg-gray-100 text-gray-600' :
                          player.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        }`}>
                          {player.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/players/${player.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {player.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{player.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{player.pricing}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm hidden sm:table-cell">{player.highlight}</td>
                    </tr>
                  ))}
              </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FAQs */}
        {page.content.faqs && page.content.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.content.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/best"
              className="text-gray-600 hover:text-gray-900"
            >
              ← All Rankings
            </Link>
            <Link
              href={`/devices/${page.deviceId}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {page.deviceName} Guide →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
