import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPlayerTroubleshooting,
  getPlayerTroubleshootingGuide,
  getPlayer,
  getBaseUrl,
  getTroubleshootingVideo,
} from '@/lib/data-loader';
import { VideoEmbed } from '@/components/VideoEmbed';
import { ChevronRight, AlertTriangle, Lightbulb } from 'lucide-react';

interface PageProps {
  params: Promise<{ player: string; issue: string }>;
}

export async function generateStaticParams() {
  const guides = await getPlayerTroubleshooting();
  return guides.map((guide) => ({
    player: guide.playerId,
    issue: guide.issueId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { player, issue } = await params;
  const guide = await getPlayerTroubleshootingGuide(player, issue);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/troubleshooting/players/${player}/${issue}`,
    },
  };
}

export default async function PlayerTroubleshootingPage({ params }: PageProps) {
  const { player: playerId, issue: issueId } = await params;
  const guide = await getPlayerTroubleshootingGuide(playerId, issueId);

  if (!guide) {
    notFound();
  }

  const [player, video] = await Promise.all([
    getPlayer(playerId),
    getTroubleshootingVideo('players', playerId, issueId),
  ]);
  const severity = guide.content.severity;

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
              <Link href="/troubleshooting" className="hover:text-gray-900">Troubleshooting</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href={`/players/${playerId}`} className="hover:text-gray-900">
                {guide.playerName}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">{guide.issueName}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`h-6 w-6 ${
              severity === 'high' ? 'text-red-500' :
              severity === 'medium' ? 'text-yellow-500' : 'text-gray-400'
            }`} />
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              severity === 'high' ? 'bg-red-100 text-red-700' :
              severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {severity.toUpperCase()} SEVERITY
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {guide.title}
          </h1>
          <p className="text-lg text-gray-600">{guide.description}</p>
        </header>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{guide.content.intro}</p>
        </section>

        {/* Common Causes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Causes</h2>
          <ul className="space-y-2">
            {guide.content.commonCauses.map((cause, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {i + 1}
                </span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Video Fix Guide */}
        {video && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Fix Guide</h2>
            <VideoEmbed video={video} />
          </section>
        )}

        {/* Solutions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Solutions</h2>
          <div className="space-y-4">
            {guide.content.solutions.map((solution, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-gray-700">{solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Player-Specific Tips */}
        {guide.content.playerSpecificTips.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{guide.playerName}-Specific Tips</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <ul className="space-y-2">
                {guide.content.playerSpecificTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-blue-700">
                    <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQs */}
        {guide.content.faqs && guide.content.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {guide.content.faqs.map((faq, i) => (
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
              href="/troubleshooting"
              className="text-gray-600 hover:text-gray-900"
            >
              ← All Troubleshooting
            </Link>
            {player && (
              <Link
                href={`/players/${player.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {player.name} Guide →
              </Link>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
