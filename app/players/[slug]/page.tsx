import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPlayers, getPlayer, getBaseUrl, getPlayerDeviceGuides, getPlayerComparisons } from '@/lib/data-loader';
import { ChevronRight, Star, ExternalLink, Check, X } from 'lucide-react';
import { SoftwareApplicationSchema, BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { QuickAnswer, AuthorBio, LastUpdated } from '@/components/GeoComponents';
import { RelatedPlayers, TroubleshootingLinks } from '@/components/RelatedContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const players = await getPlayers();
  return players.map((player) => ({ slug: player.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    return { title: 'Player Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: `${player.name} IPTV Player - Complete Guide & Review`,
    description: player.description,
    keywords: player.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/players/${slug}`,
    },
    openGraph: {
      title: `${player.name} - IPTV Player Review`,
      description: player.shortDescription,
      type: 'article',
    },
  };
}

export default async function PlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const player = await getPlayer(slug);

  if (!player) {
    notFound();
  }

  const [guides, comparisons, allPlayers] = await Promise.all([
    getPlayerDeviceGuides(),
    getPlayerComparisons(),
    getPlayers(),
  ]);
  const playerGuides = guides.filter((g) => g.playerId === player.id).slice(0, 6);
  const playerComparisons = comparisons.filter(
    (c) => c.player1Id === player.id || c.player2Id === player.id
  ).slice(0, 4);

  // Get related players from JSON data
  const relatedPlayerIds = player.relatedPlayers || [];

  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <SoftwareApplicationSchema
        name={player.name}
        description={player.description}
        rating={player.rating}
        ratingCount={150}
        price={player.pricing.price}
        operatingSystem={player.platforms}
        url={`${baseUrl}/players/${player.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Players', url: `${baseUrl}/players` },
          { name: player.name, url: `${baseUrl}/players/${player.slug}` },
        ]}
      />
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/players" className="hover:text-gray-900">Players</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">{player.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {player.name}
              </h1>
              <p className="text-lg text-gray-600">{player.shortDescription}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900">{player.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
              {player.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {player.pricing.price}
            </span>
            {player.platforms.slice(0, 4).map((platform) => (
              <span key={platform} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {platform}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {player.officialUrl && (
              <a
                href={player.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                Visit Official Website <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <LastUpdated date={player.lastUpdated} />
        </header>

        {/* QuickAnswer for GEO - AI extracts this first */}
        <QuickAnswer
          question={`What is ${player.name} and is it worth using?`}
          answer={`${player.name} is a ${player.category} IPTV player with a ${player.rating}/5 rating. ${player.shortDescription} Best for: ${player.platforms.slice(0, 3).join(', ')} users.`}
          highlight={player.pricing.model === 'free' ? 'This player is completely free to use.' : `Pricing: ${player.pricing.price}`}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{player.description}</p>
            </section>

            {/* Pros and Cons */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Pros</h3>
                <ul className="space-y-2">
                  {player.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-700">
                      <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Cons</h3>
                <ul className="space-y-2">
                  {player.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700">
                      <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="flex flex-wrap gap-2">
                {player.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {feature.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </section>

            {/* Setup Guides */}
            {playerGuides.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Guides</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {playerGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                    >
                      <h3 className="font-medium text-gray-900">
                        {player.name} on {guide.deviceShortName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Step-by-step setup guide
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Compare with Other Players */}
            {playerComparisons.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare {player.name}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {playerComparisons.map((comp) => {
                    const otherPlayer = comp.player1Id === player.id ? comp.player2Name : comp.player1Name;
                    return (
                      <Link
                        key={comp.slug}
                        href={`/compare/players/${comp.player1Id}/vs/${comp.player2Id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition"
                      >
                        <h3 className="font-medium text-gray-900">
                          {player.name} vs {otherPlayer}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          See detailed comparison
                        </p>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/players/${player.slug}/alternatives`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all {player.name} alternatives →
                </Link>
              </section>
            )}

            {/* Related Players */}
            <RelatedPlayers
              playerIds={relatedPlayerIds}
              players={allPlayers}
              currentPlayerId={player.id}
              title={`Similar to ${player.name}`}
            />

            {/* Troubleshooting Links */}
            <TroubleshootingLinks
              entityType="players"
              entitySlug={player.slug}
              entityName={player.name}
            />

            {/* FAQ Section for GEO */}
            {player.faqs && player.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <FAQSchema faqs={player.faqs} />
                <div className="space-y-4">
                  {player.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio for E-E-A-T */}
            <AuthorBio
              name="IPTV Guide Team"
              expertise="IPTV & Streaming Specialists"
              bio="Our team tests and reviews IPTV players across all major platforms to help you find the best streaming solution."
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Developer</dt>
                  <dd className="text-gray-900">{player.developer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Launched</dt>
                  <dd className="text-gray-900">{player.yearLaunched}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Pricing</dt>
                  <dd className="text-gray-900">{player.pricing.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {new Date(player.lastUpdated).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Download Links */}
            {player.downloadUrls.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Download</h3>
                <div className="space-y-2">
                  {player.downloadUrls.map((dl) => (
                    <a
                      key={dl.platform}
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-center text-sm hover:border-gray-300 transition"
                    >
                      {dl.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
