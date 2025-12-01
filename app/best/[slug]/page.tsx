import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getBestPlayerDevice,
  getBestForPage,
  getUseCases,
  getUseCase,
  getPlayer,
  getBaseUrl,
} from '@/lib/data-loader';
import { ChevronRight, Trophy, Star, Check, X } from 'lucide-react';
import {
  QuickAnswer,
  ComparisonTable,
  AuthorBio,
  LastUpdated,
  TLDRBox,
} from '@/components/GeoComponents';
import { FAQSchema, ItemListSchema, ArticleWithAuthorSchema } from '@/components/JsonLd';
import type { BestForPage, UseCasePage, Player } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Combine static params from both data sources
export async function generateStaticParams() {
  const [devicePages, useCasePages] = await Promise.all([
    getBestPlayerDevice(),
    getUseCases(),
  ]);

  return [
    ...devicePages.map((page) => ({ slug: page.slug })),
    ...useCasePages.map((page) => ({ slug: page.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  // Check for device-based page first
  const devicePage = await getBestForPage(slug);
  if (devicePage) {
    return {
      title: devicePage.metaTitle,
      description: devicePage.description,
      keywords: devicePage.keywords.join(', '),
      alternates: {
        canonical: `${baseUrl}/best/${slug}`,
      },
    };
  }

  // Check for use-case page
  const useCasePage = await getUseCase(slug);
  if (useCasePage) {
    return {
      title: useCasePage.metaTitle,
      description: useCasePage.description,
      keywords: useCasePage.keywords.join(', '),
      alternates: {
        canonical: `${baseUrl}/best/${slug}`,
      },
      openGraph: {
        title: useCasePage.metaTitle,
        description: useCasePage.description,
        type: 'article',
        publishedTime: useCasePage.lastUpdated,
        modifiedTime: useCasePage.lastUpdated,
        authors: [useCasePage.author.name],
      },
    };
  }

  return { title: 'Page Not Found' };
}

export default async function BestForPageRoute({ params }: PageProps) {
  const { slug } = await params;

  // Check for device-based page first
  const devicePage = await getBestForPage(slug);
  if (devicePage) {
    return <DeviceBestPage page={devicePage} />;
  }

  // Check for use-case page
  const useCasePage = await getUseCase(slug);
  if (useCasePage) {
    return <UseCaseBestPage page={useCasePage} />;
  }

  notFound();
}

// Device-based best page (existing layout with GEO enhancements)
function DeviceBestPage({ page }: { page: BestForPage }) {
  const baseUrl = getBaseUrl();

  // Generate Quick Answer from top pick data
  const quickAnswerText = page.content.topPick
    ? `${page.content.topPick.name} is the best IPTV player for ${page.deviceShortName} in 2025 with a ${page.content.topPick.rating}/5 rating. ${page.content.topPick.whyTopPick}`
    : `Finding the best IPTV player for ${page.deviceShortName} depends on your needs. See our full rankings below.`;

  // Build ItemList schema data
  const itemListItems = page.content.allRankings.map((p) => ({
    name: p.name,
    position: p.rank,
    url: `${baseUrl}/players/${p.slug}`,
    rating: p.rating,
  }));

  return (
    <div className="min-h-screen">
      {/* Structured Data for GEO */}
      {page.content.faqs && page.content.faqs.length > 0 && (
        <FAQSchema faqs={page.content.faqs} />
      )}
      <ItemListSchema
        name={page.title}
        description={page.description}
        items={itemListItems}
        url={`${baseUrl}/best/${page.slug}`}
      />

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
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
          </div>
          <LastUpdated date={page.lastUpdated} />
        </header>

        {/* Quick Answer Box - GEO optimized */}
        <QuickAnswer
          question={`What is the Best IPTV Player for ${page.deviceShortName}?`}
          answer={quickAnswerText}
          highlight={page.content.topPick ? `${page.content.topPick.name} - ${page.content.topPick.pricing.price}` : undefined}
        />

        {/* TL;DR Box - Quick summary for AI extraction */}
        <TLDRBox
          title={`TL;DR: Best IPTV Players for ${page.deviceShortName}`}
          points={[
            page.content.topPick
              ? `Top Pick: ${page.content.topPick.name} (${page.content.topPick.rating}/5) - ${page.content.topPick.pricing.price}`
              : `Limited IPTV player options available for ${page.deviceName}`,
            page.content.runnerUp
              ? `Runner Up: ${page.content.runnerUp.name} (${page.content.runnerUp.rating}/5) - ${page.content.runnerUp.pricing.price}`
              : null,
            page.content.budgetPick
              ? `Budget Pick: ${page.content.budgetPick.name} (${page.content.budgetPick.rating}/5) - Free`
              : null,
            `${page.content.allRankings.length} total IPTV players tested for ${page.deviceShortName}`,
          ].filter((point): point is string => point !== null)}
        />

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

        {/* Author Bio for E-E-A-T */}
        <AuthorBio name="IPTV Guide Team" expertise="IPTV & Streaming Specialists" />

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

// GEO-optimized Use-Case page (new layout)
async function UseCaseBestPage({ page }: { page: UseCasePage }) {
  const baseUrl = getBaseUrl();

  // Fetch player details for rankings
  const playersWithDetails = await Promise.all(
    page.rankings.map(async (ranking) => {
      const player = await getPlayer(ranking.playerId);
      return {
        ...ranking,
        player,
      };
    })
  );

  // Build comparison table data
  const comparisonPlayers = playersWithDetails
    .filter((r) => r.player)
    .map((r) => ({
      rank: r.rank,
      name: r.player!.name,
      slug: r.player!.slug,
      rating: r.player!.rating,
      pricing: r.player!.pricing.price,
      highlight: r.whyRanked,
    }));

  // Build ItemList schema data
  const itemListItems = comparisonPlayers.map((p) => ({
    name: p.name,
    position: p.rank,
    url: `${baseUrl}/players/${p.slug}`,
    rating: p.rating,
  }));

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <FAQSchema faqs={page.faqs} />
      <ItemListSchema
        name={page.title}
        description={page.description}
        items={itemListItems}
        url={`${baseUrl}/best/${page.slug}`}
      />
      <ArticleWithAuthorSchema
        title={page.title}
        description={page.description}
        url={`${baseUrl}/best/${page.slug}`}
        datePublished={page.lastUpdated}
        dateModified={page.lastUpdated}
        authorName={page.author.name}
        authorExpertise={page.author.expertise}
      />

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
            <li className="text-gray-900 font-medium">{page.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
          </div>
          <LastUpdated date={page.lastUpdated} />
        </header>

        {/* Quick Answer Box - AI extracts this first */}
        <QuickAnswer
          question={page.quickAnswer.question}
          answer={page.quickAnswer.answer}
          highlight={page.quickAnswer.highlight}
        />

        {/* TL;DR Box - Quick summary for AI extraction */}
        {playersWithDetails.length > 0 && (
          <TLDRBox
            title={`TL;DR: ${page.title}`}
            points={[
              playersWithDetails[0]?.player
                ? `#1 Pick: ${playersWithDetails[0].player.name} (${playersWithDetails[0].player.rating}/5) - ${playersWithDetails[0].bestFor}`
                : '',
              playersWithDetails[1]?.player
                ? `#2 Pick: ${playersWithDetails[1].player.name} (${playersWithDetails[1].player.rating}/5) - ${playersWithDetails[1].bestFor}`
                : '',
              playersWithDetails[2]?.player
                ? `#3 Pick: ${playersWithDetails[2].player.name} (${playersWithDetails[2].player.rating}/5) - ${playersWithDetails[2].bestFor}`
                : '',
              `${playersWithDetails.length} players ranked for this use case`,
            ].filter((point) => point !== '')}
          />
        )}

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">{page.content.intro}</p>
          <p className="text-gray-600 leading-relaxed">{page.content.whyItMatters}</p>
        </section>

        {/* Comparison Table - AI loves structured tables */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Top {page.title.replace('Best ', '')} Ranked
          </h2>
          <ComparisonTable players={comparisonPlayers} />
        </section>

        {/* Detailed Rankings with explanations */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Rankings</h2>
          <div className="space-y-6">
            {playersWithDetails.filter((r) => r.player).map((ranking) => (
              <div
                key={ranking.playerId}
                className={`border rounded-lg p-6 ${
                  ranking.rank === 1
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      ranking.rank === 1
                        ? 'bg-yellow-400 text-yellow-900'
                        : ranking.rank === 2
                        ? 'bg-gray-300 text-gray-700'
                        : ranking.rank === 3
                        ? 'bg-orange-300 text-orange-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ranking.rank}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        <Link href={`/players/${ranking.player!.slug}`} className="hover:text-blue-600">
                          {ranking.player!.name}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{ranking.player!.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{ranking.player!.pricing.price}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{ranking.whyRanked}</p>
                    <p className="text-blue-700 text-sm font-medium">
                      <strong>Best for:</strong> {ranking.bestFor}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <Link
                        href={`/players/${ranking.player!.slug}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Full Review →
                      </Link>
                      {ranking.player!.platforms.length > 0 && (
                        <span className="text-sm text-gray-500">
                          Platforms: {ranking.player!.platforms.slice(0, 3).join(', ')}
                          {ranking.player!.platforms.length > 3 && '...'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section - Highest GEO value */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Author Bio for E-E-A-T */}
        <AuthorBio name={page.author.name} expertise={page.author.expertise} />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <Link href="/best" className="text-gray-600 hover:text-gray-900">
              ← All Rankings
            </Link>
            <Link href="/players" className="text-blue-600 hover:text-blue-800">
              Browse All Players →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
