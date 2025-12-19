import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPlayerFeatureGuide,
  getDeviceFeatureGuide,
  getPlayer,
  getDevice,
  getFeature,
  getPlayers,
  getBaseUrl,
  getVideoForPage,
} from '@/lib/data-loader';
import { VideoWatchCard } from '@/components/VideoWatchCard';
import { ChevronRight, BookOpen } from 'lucide-react';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { FAQSchema, HowToSchema, BreadcrumbSchema, ArticleWithAuthorSchema } from '@/components/JsonLd';
import type { Step, FAQ, PlayerFeatureGuide, DeviceFeatureGuide } from '@/lib/types';

interface PageProps {
  params: Promise<{ player: string; feature: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { player, feature } = await params;
  const baseUrl = getBaseUrl();

  const guide =
    (await getPlayerFeatureGuide(player, feature)) ||
    (await getDeviceFeatureGuide(player, feature));

  if (!guide) return { title: 'Guide Not Found' };

  const guideAuthor =
    'playerName' in guide
      ? guide.playerName
      : 'deviceName' in guide
      ? guide.deviceName
      : 'IPTV Guide Team';

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords.join(', '),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/guides/${player}/features/${feature}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      type: 'article',
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guideAuthor],
    },
  };
}

export default async function FeatureGuidePage({ params }: PageProps) {
  const { player: entitySlug, feature: featureSlug } = await params;
  const baseUrl = getBaseUrl();

  const [playerGuide, deviceGuide, playerEntity, deviceEntity, feature, allPlayers, video] =
    await Promise.all([
      getPlayerFeatureGuide(entitySlug, featureSlug),
      getDeviceFeatureGuide(entitySlug, featureSlug),
      getPlayer(entitySlug),
      getDevice(entitySlug),
      getFeature(featureSlug),
      getPlayers(),
      getVideoForPage('technical-guides', `${entitySlug}-${featureSlug}`),
    ]);

  const guide = (playerGuide || deviceGuide) as PlayerFeatureGuide | DeviceFeatureGuide | null;
  if (!guide || !feature) notFound();

  const content =
    guide.content as PlayerFeatureGuide['content'] | DeviceFeatureGuide['content'];
  const recommendedPlayers: string[] | undefined =
    'recommendedPlayers' in content
      ? (content as DeviceFeatureGuide['content']).recommendedPlayers
      : undefined;
  const conclusion: string | undefined =
    'conclusion' in content
      ? (content as DeviceFeatureGuide['content']).conclusion
      : undefined;

  const guideEntityName =
    'playerName' in guide
      ? guide.playerName
      : 'deviceName' in guide
      ? guide.deviceName
      : undefined;

  const entityName = playerEntity?.name || deviceEntity?.name || guideEntityName;
  const entityTypeLabel = playerEntity ? 'Player' : deviceEntity ? 'Device' : 'Guide';

  const howToSteps = ((guide.content.steps || []) as Step[])
    .slice(0, 12)
    .map((s) => ({ title: s.title, description: s.description }));

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Guides', url: `${baseUrl}/guides` },
    { name: `${entityName} Features`, url: `${baseUrl}/features/${feature.slug}` },
    {
      name: guide.title,
      url: `${baseUrl}/guides/${entitySlug}/features/${featureSlug}`,
    },
  ];

  return (
    <div className="min-h-screen">
      <FAQSchema faqs={(guide.content.faqs || []) as FAQ[]} />
      {howToSteps.length > 0 && (
        <HowToSchema
          name={guide.title}
          description={guide.description}
          steps={howToSteps}
        />
      )}
      <ArticleWithAuthorSchema
        title={guide.title}
        description={guide.description}
        url={`${baseUrl}/guides/${entitySlug}/features/${featureSlug}`}
        datePublished={guide.lastUpdated}
        dateModified={guide.lastUpdated}
        authorName="IPTV Guide Team"
        authorExpertise="IPTV & Streaming Specialists"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/guides" className="hover:text-gray-900">Guides</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{guide.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {guide.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">{guide.description}</p>
          <LastUpdated date={guide.lastUpdated} />
        </header>

        <QuickAnswer
          question={`How do I enable ${feature.shortName} on ${entityName}?`}
          answer={guide.content.intro || guide.description}
          highlight={`${entityTypeLabel}: ${entityName}`}
        />

        {video && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Video Guide</h2>
            <VideoWatchCard video={video} />
          </section>
        )}

        {content.requirements && content.requirements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {content.requirements.map((r: string) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {content.steps && content.steps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step‑by‑step setup</h2>
            <div className="space-y-4">
              {(content.steps as Step[]).map((step, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    {step.tips && step.tips.length > 0 && (
                      <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
                        {step.tips.map((t: string) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.tips && content.tips.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Pro tips</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {content.tips.map((t: string) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        {recommendedPlayers && recommendedPlayers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Recommended IPTV players</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {recommendedPlayers.map((pid: string) => {
                const p = allPlayers.find((x) => x.slug === pid);
                if (!p) return null;
                return (
                  <Link
                    key={pid}
                    href={`/players/${pid}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{p.shortDescription}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {(content.faqs || [])?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {(content.faqs as FAQ[]).map((faq: FAQ, i: number) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {conclusion && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed">{conclusion}</p>
          </section>
        )}

        {/* Cross‑links */}
        <section className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Explore more</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={`/features/${feature.slug}`} className="text-blue-600 hover:underline">
              {feature.name} overview
            </Link>
            {playerEntity && (
              <Link href={`/players/${playerEntity.slug}`} className="text-blue-600 hover:underline">
                {playerEntity.name} review
              </Link>
            )}
            {deviceEntity && (
              <Link href={`/devices/${deviceEntity.slug}`} className="text-blue-600 hover:underline">
                {deviceEntity.name} device guide
              </Link>
            )}
          </div>
        </section>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={['Hands‑on setup testing', 'Feature verification', 'Cross‑device IPTV performance']}
          bio="We verify each feature guide on real devices with live provider playlists, checking both UI steps and playback stability."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}
