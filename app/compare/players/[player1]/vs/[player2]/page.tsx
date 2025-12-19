import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPlayerComparisons,
  getPlayerComparison,
  getPlayer,
  getBaseUrl,
  getPlayerDeviceGuides,
} from '@/lib/data-loader';
import { ChevronRight, Check, X, Star, Calendar } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema, ComparisonSchema } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ player1: string; player2: string }>;
}

export async function generateStaticParams() {
  const comparisons = await getPlayerComparisons();
  return comparisons.map((c) => ({
    player1: c.player1Id,
    player2: c.player2Id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { player1, player2 } = await params;
  const comparison = await getPlayerComparison(player1, player2);

  if (!comparison) {
    return { title: 'Comparison Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: comparison.metaTitle,
    description: comparison.description,
    keywords: comparison.keywords.join(', '),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/compare/players/${player1}/vs/${player2}`,
    },
  };
}

// Feature display names
const featureNames: Record<string, string> = {
  epg: 'EPG Support',
  'multi-screen': 'Multi-Screen',
  favorites: 'Favorites',
  catchup: 'Catchup/Timeshift',
  'parental-controls': 'Parental Controls',
  recording: 'Recording/DVR',
  'external-player': 'External Player',
  vod: 'VOD Support',
  'auto-update': 'Auto Update',
  subtitles: 'Subtitles',
  'audio-tracks': 'Multiple Audio',
  'hardware-decoding': 'Hardware Decoding',
  'channel-groups': 'Channel Groups',
};

export default async function PlayerComparisonPage({ params }: PageProps) {
  const { player1: player1Id, player2: player2Id } = await params;
  const comparison = await getPlayerComparison(player1Id, player2Id);

  if (!comparison) {
    notFound();
  }

  const [player1, player2, allGuides] = await Promise.all([
    getPlayer(comparison.player1Id),
    getPlayer(comparison.player2Id),
    getPlayerDeviceGuides(),
  ]);

  const baseUrl = getBaseUrl();

  // Get comparison data
  const compData = comparison.content.comparison as {
    rating?: { player1: number; player2: number; winner: string };
    pricing?: { player1: { model: string; price: string }; player2: { model: string; price: string }; winner: string };
    features?: { shared: string[]; player1Only: string[]; player2Only: string[]; winner: string };
    platforms?: { player1: string[]; player2: string[] };
  };

  // Extract winner from verdict string
  const verdictText = comparison.content.verdict || '';
  const winner = verdictText.toLowerCase().includes(comparison.player1Name.toLowerCase()) &&
                 !verdictText.toLowerCase().includes(comparison.player2Name.toLowerCase() + ' edges')
                   ? comparison.player1Name
                   : verdictText.toLowerCase().includes(comparison.player2Name.toLowerCase())
                     ? comparison.player2Name
                     : comparison.player1Name;

  // Get all features for the comparison table
  const sharedFeatures = compData.features?.shared || [];
  const player1OnlyFeatures = compData.features?.player1Only || [];
  const player2OnlyFeatures = compData.features?.player2Only || [];
  const allFeatures = [...new Set([...sharedFeatures, ...player1OnlyFeatures, ...player2OnlyFeatures])];

  // Get related guides for both players
  const relatedGuides = allGuides
    .filter((g) => g.playerId === comparison.player1Id || g.playerId === comparison.player2Id)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Compare', url: `${baseUrl}/compare` },
          { name: `${comparison.player1Name} vs ${comparison.player2Name}`, url: `${baseUrl}/compare/players/${player1Id}/vs/${player2Id}` },
        ]}
      />
      <FAQSchema faqs={comparison.content.faqs || []} />
      <ComparisonSchema
        title={comparison.title}
        description={comparison.description}
        item1={{ name: comparison.player1Name, rating: player1?.rating || compData.rating?.player1 }}
        item2={{ name: comparison.player2Name, rating: player2?.rating || compData.rating?.player2 }}
        url={`${baseUrl}/compare/players/${player1Id}/vs/${player2Id}`}
        dateModified={comparison.lastUpdated}
      />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/compare" className="hover:text-gray-900">Compare</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">
              {comparison.player1Name} vs {comparison.player2Name}
            </li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {comparison.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{comparison.description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date(comparison.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Quick Winner Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${winner === comparison.player1Name ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
            <div className="text-center">
              {winner === comparison.player1Name && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
                  <Star className="h-3 w-3" /> WINNER
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{comparison.player1Name}</h2>
              {player1 && (
                <>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{player1.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{player1.pricing.price}</p>
                  <Link
                    href={`/players/${player1.slug}`}
                    className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Review →
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className={`p-6 rounded-lg ${winner === comparison.player2Name ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
            <div className="text-center">
              {winner === comparison.player2Name && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
                  <Star className="h-3 w-3" /> WINNER
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{comparison.player2Name}</h2>
              {player2 && (
                <>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{player2.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{player2.pricing.price}</p>
                  <Link
                    href={`/players/${player2.slug}`}
                    className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Review →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{comparison.content.intro}</p>
        </section>

        {/* Comparison Table */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b border-gray-200 font-semibold text-gray-900">Feature</th>
                  <th className="text-center p-4 border-b border-gray-200 font-semibold text-gray-900">{comparison.player1Name}</th>
                  <th className="text-center p-4 border-b border-gray-200 font-semibold text-gray-900">{comparison.player2Name}</th>
                </tr>
              </thead>
              <tbody>
                {/* Rating */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700 font-medium">Rating</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{compData.rating?.player1 || player1?.rating}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{compData.rating?.player2 || player2?.rating}</span>
                    </div>
                  </td>
                </tr>
                {/* Pricing */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-4 text-gray-700 font-medium">Pricing</td>
                  <td className="p-4 text-center text-gray-700">{compData.pricing?.player1.price || player1?.pricing.price}</td>
                  <td className="p-4 text-center text-gray-700">{compData.pricing?.player2.price || player2?.pricing.price}</td>
                </tr>
                {/* Platforms */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-gray-700 font-medium">Platforms</td>
                  <td className="p-4 text-center text-sm text-gray-600">
                    {(compData.platforms?.player1 || player1?.platforms || []).slice(0, 4).join(', ')}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-600">
                    {(compData.platforms?.player2 || player2?.platforms || []).slice(0, 4).join(', ')}
                  </td>
                </tr>
                {/* Features */}
                {allFeatures.map((feature, idx) => {
                  const hasPlayer1 = sharedFeatures.includes(feature) || player1OnlyFeatures.includes(feature);
                  const hasPlayer2 = sharedFeatures.includes(feature) || player2OnlyFeatures.includes(feature);
                  return (
                    <tr key={feature} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="p-4 text-gray-700">{featureNames[feature] || feature.replace(/-/g, ' ')}</td>
                      <td className="p-4 text-center">
                        {hasPlayer1 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {hasPlayer2 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros and Cons */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{comparison.player1Name}</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {comparison.content.player1Summary.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {comparison.content.player1Summary.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-600 italic">{comparison.content.player1Summary.bestFor}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{comparison.player2Name}</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {comparison.content.player2Summary.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {comparison.content.player2Summary.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-600 italic">{comparison.content.player2Summary.bestFor}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Verdict</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900">Winner: {winner}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{comparison.content.verdict}</p>
          </div>
        </section>

        {/* FAQs */}
        {comparison.content.faqs && comparison.content.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {comparison.content.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition"
                >
                  <h3 className="font-medium text-gray-900">
                    {guide.playerName} on {guide.deviceShortName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Step-by-step setup guide</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4 justify-between items-center">
          <Link
            href="/compare"
            className="text-gray-600 hover:text-gray-900"
          >
            ← All Comparisons
          </Link>
          <div className="flex gap-4">
            <Link href={`/players/${comparison.player1Id}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {comparison.player1Name} Review
            </Link>
            <Link href={`/players/${comparison.player2Id}`} className="text-blue-600 hover:text-blue-800 text-sm">
              {comparison.player2Name} Review
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
