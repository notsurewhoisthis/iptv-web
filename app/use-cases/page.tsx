import type { Metadata } from 'next';
import Link from 'next/link';
import { getUseCases, getPlayers, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { Target, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best IPTV Players for Every Use‑Case (2025)',
  description:
    'Find the best IPTV player for your exact needs: free apps, sports streaming, 4K playback, recording, live TV, and more. Ranked with real testing.',
};

export default async function UseCasesPage() {
  const [useCases, players] = await Promise.all([getUseCases(), getPlayers()]);
  const baseUrl = getBaseUrl();

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Use Cases', url: `${baseUrl}/use-cases` },
  ];

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Use Cases"
        description="Best IPTV players for free, sports, 4K, recording, live TV, and more."
        url={`${baseUrl}/use-cases`}
        numberOfItems={useCases.length}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-7 w-7 text-indigo-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Use‑Cases
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            IPTV apps excel at different things. These pages help you pick the right one fast based on
            how you actually watch TV.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="How should I choose an IPTV player?"
          answer="Pick based on your use‑case first: device platform, playback quality (HD/4K), features like EPG/recording/catch‑up, and your budget. Then compare top apps for that scenario."
          highlight={`We rank ${players.length} players across ${useCases.length} use‑cases.`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => {
            const topPick = uc.rankings?.find((r) => r.rank === 1);
            const topPlayer = topPick
              ? players.find((p) => p.slug === topPick.playerId)
              : undefined;

            return (
              <article
                key={uc.slug}
                className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition bg-white"
              >
                <Link href={`/use-cases/${uc.slug}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {uc.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {uc.description}
                  </p>
                  {topPlayer && (
                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-semibold">Top pick:</span> {topPlayer.name}
                    </div>
                  )}
                  <div className="inline-flex items-center text-blue-600 text-sm font-medium">
                    View rankings
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={['Use‑case testing', 'Cross‑platform IPTV reviews', 'Performance benchmarking']}
          bio="Our use‑case rankings are based on hands‑on tests with real providers and large playlists. We score apps for stability, UX, and feature accuracy per scenario."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

