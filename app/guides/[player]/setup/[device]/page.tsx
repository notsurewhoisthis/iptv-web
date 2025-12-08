import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPlayerDeviceGuides, getPlayerDeviceGuide, getPlayer, getDevice, getBaseUrl, getSetupGuideVideo } from '@/lib/data-loader';
import { VideoEmbed } from '@/components/VideoEmbed';
import { ChevronRight, Star, Clock, CheckCircle, Calendar } from 'lucide-react';
import { HowToSchema, FAQSchema, BreadcrumbSchema } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ player: string; device: string }>;
}

export async function generateStaticParams() {
  const guides = await getPlayerDeviceGuides();
  return guides.map((guide) => ({
    player: guide.playerId,
    device: guide.deviceId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { player, device } = await params;
  const guide = await getPlayerDeviceGuide(player, device);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/guides/${player}/setup/${device}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: `${baseUrl}/guides/${player}/setup/${device}`,
    },
  };
}

export default async function SetupGuidePage({ params }: PageProps) {
  const { player, device } = await params;
  const guide = await getPlayerDeviceGuide(player, device);

  if (!guide) {
    notFound();
  }

  const [playerData, deviceData, video] = await Promise.all([
    getPlayer(player),
    getDevice(device),
    getSetupGuideVideo(player, device),
  ]);

  const baseUrl = getBaseUrl();

  // Prepare HowTo steps for schema
  const howToSteps = guide.content.steps.map((step) => ({
    title: step.title,
    description: step.description,
  }));

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <HowToSchema
        name={guide.title}
        description={guide.description}
        steps={howToSteps}
        totalTime={`PT${guide.content.steps.length * 2}M`}
      />
      <FAQSchema faqs={guide.content.faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Guides', url: `${baseUrl}/guides` },
          { name: guide.playerName, url: `${baseUrl}/players/${player}` },
          { name: guide.deviceShortName, url: `${baseUrl}/guides/${player}/setup/${device}` },
        ]}
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
              <Link href="/guides" className="hover:text-gray-900">Guides</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href={`/players/${player}`} className="hover:text-gray-900">
                {guide.playerName}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">
              {guide.deviceShortName}
            </li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <header className="py-8 md:py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {guide.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{guide.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {playerData && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{playerData.rating}/5 rating</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{guide.content.steps.length * 2} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2 prose prose-gray max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed">{guide.content.intro}</p>
            </section>

            {/* Requirements */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What You Need
              </h2>
              <ul className="space-y-2">
                {guide.content.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Video Tutorial */}
            {video && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Video Tutorial
                </h2>
                <VideoEmbed video={video} />
              </section>
            )}

            {/* Steps */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Step-by-Step Guide
              </h2>
              <div className="space-y-6">
                {guide.content.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        {step.tips && step.tips.length > 0 && (
                          <div className="bg-blue-50 border border-blue-100 rounded p-3">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Tips:
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {step.tips.map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Troubleshooting Tips
              </h2>
              <ul className="space-y-2 text-gray-700">
                {guide.content.troubleshooting.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </section>

            {/* FAQs */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {guide.content.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Conclusion */}
            <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Conclusion
              </h2>
              <p className="text-gray-700">{guide.content.conclusion}</p>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Player Info Card */}
              {playerData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    About {playerData.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating</span>
                      <span className="font-medium">{playerData.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pricing</span>
                      <span className="font-medium">
                        {playerData.pricing.model === 'free'
                          ? 'Free'
                          : playerData.pricing.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Platforms</span>
                      <span className="font-medium">
                        {playerData.platforms.length}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/players/${player}`}
                    className="block mt-4 text-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    View full review →
                  </Link>
                </div>
              )}

              {/* Related Guides */}
              {guide.relatedGuides.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Related Guides
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {guide.relatedGuides.slice(0, 5).map((slug) => {
                      const parts = slug.split('-setup-');
                      if (parts.length === 2) {
                        return (
                          <li key={slug}>
                            <Link
                              href={`/guides/${parts[0]}/setup/${parts[1]}`}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {slug.replace(/-/g, ' ').replace(/setup/g, 'on')}
                            </Link>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}

              {/* Device Info */}
              {deviceData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {deviceData.shortName} IPTV Apps
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {deviceData.supportedPlayers.length} compatible apps
                  </p>
                  <Link
                    href={`/best/best-iptv-player-${device}`}
                    className="block text-sm text-gray-600 hover:text-gray-900"
                  >
                    Best IPTV player for {deviceData.shortName} →
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
