import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPlayerComparisons,
  getPlayerComparison,
  getPlayer,
  getBaseUrl,
} from '@/lib/data-loader';
import { ChevronRight, Check, X, Star } from 'lucide-react';

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
    alternates: {
      canonical: `${baseUrl}/compare/players/${player1}/vs/${player2}`,
    },
  };
}

export default async function PlayerComparisonPage({ params }: PageProps) {
  const { player1: player1Id, player2: player2Id } = await params;
  const comparison = await getPlayerComparison(player1Id, player2Id);

  if (!comparison) {
    notFound();
  }

  const [player1, player2] = await Promise.all([
    getPlayer(comparison.player1Id),
    getPlayer(comparison.player2Id),
  ]);

  // Extract winner from verdict string (e.g., "TiviMate edges out...")
  const verdictText = comparison.content.verdict || '';
  const winner = verdictText.toLowerCase().includes(comparison.player1Name.toLowerCase()) &&
                 !verdictText.toLowerCase().includes(comparison.player2Name.toLowerCase() + ' edges')
                   ? comparison.player1Name
                   : verdictText.toLowerCase().includes(comparison.player2Name.toLowerCase())
                     ? comparison.player2Name
                     : comparison.player1Name;

  return (
    <div className="min-h-screen">
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
          <p className="text-lg text-gray-600">{comparison.description}</p>
        </header>

        {/* Winner Summary */}
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

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/compare"
            className="text-gray-600 hover:text-gray-900"
          >
            ← All Comparisons
          </Link>
        </footer>
      </article>
    </div>
  );
}
