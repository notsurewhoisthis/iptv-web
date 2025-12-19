import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getFeatures,
  getFeature,
  getPlayers,
  getDevices,
  getTechnicalGuides,
  getPlayerFeatureGuides,
  getDeviceFeatureGuides,
  getBaseUrl,
} from '@/lib/data-loader';
import { BreadcrumbSchema, ArticleWithAuthorSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { ChevronRight, Sparkles, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const features = await getFeatures();
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = await getFeature(slug);
  const baseUrl = getBaseUrl();

  if (!feature) return { title: 'Feature Not Found' };

  return {
    title: `${feature.name} IPTV Feature - What It Does & Best Apps`,
    description: feature.description,
    keywords: feature.keywords.join(', '),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/features/${slug}`,
    },
    openGraph: {
      title: feature.name,
      description: feature.description,
      type: 'article',
    },
  };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const [feature, players, devices, technicalGuides, playerFeatureGuides, deviceFeatureGuides] =
    await Promise.all([
      getFeature(slug),
      getPlayers(),
      getDevices(),
      getTechnicalGuides(),
      getPlayerFeatureGuides(),
      getDeviceFeatureGuides(),
    ]);
  const baseUrl = getBaseUrl();

  if (!feature) notFound();

  const supportingPlayers = players.filter((p) =>
    (p.features || []).includes(feature.slug)
  );
  const supportingDevices = devices.filter((d) =>
    (d.supportedPlayers || []).some((ps) =>
      supportingPlayers.map((sp) => sp.slug).includes(ps)
    )
  );

  const topPlayers = supportingPlayers
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const relatedPlayerGuides = playerFeatureGuides
    .filter((g) => g.featureId === feature.slug)
    .slice(0, 8);
  const relatedDeviceGuides = deviceFeatureGuides
    .filter((g) => g.featureId === feature.slug)
    .slice(0, 8);

  const relatedTechGuides = technicalGuides
    .filter(
      (g) =>
        (g.relatedPlayers || []).some((rp) =>
          supportingPlayers.map((p) => p.slug).includes(rp)
        ) ||
        (g.relatedDevices || []).some((rd) =>
          supportingDevices.map((d) => d.slug).includes(rd)
        ) ||
        g.keywords.some((k) => k.toLowerCase().includes(feature.slug))
    )
    .slice(0, 6);

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Features', url: `${baseUrl}/features` },
    { name: feature.name, url: `${baseUrl}/features/${feature.slug}` },
  ];

  return (
    <div className="min-h-screen">
      <ArticleWithAuthorSchema
        title={feature.name}
        description={feature.description}
        url={`${baseUrl}/features/${feature.slug}`}
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
        authorName="IPTV Guide Team"
        authorExpertise="IPTV & Streaming Specialists"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/features" className="hover:text-gray-900">Features</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{feature.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {feature.name}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">{feature.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`What does ${feature.shortName} do in IPTV?`}
          answer={feature.description}
          highlight={`Supported by ${supportingPlayers.length} players and ${supportingDevices.length} devices.`}
        />

        {feature.benefits.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why this feature matters</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {feature.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        )}

        {feature.requirements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {feature.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        )}

        {topPlayers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Best IPTV players with {feature.shortName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topPlayers.map((p) => (
                <Link
                  key={p.slug}
                  href={`/players/${p.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{p.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {supportingDevices.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Devices where {feature.shortName} works best
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportingDevices.slice(0, 9).map((d) => (
                <Link
                  key={d.slug}
                  href={`/devices/${d.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
                >
                  <h3 className="font-semibold text-gray-900">{d.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {d.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(relatedPlayerGuides.length > 0 || relatedDeviceGuides.length > 0) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Setup guides for {feature.shortName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPlayerGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.playerId}/features/${g.featureId}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
              {relatedDeviceGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.deviceId}/features/${g.featureId}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedTechGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related technical guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedTechGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/technical/${g.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={['Hands‑on feature testing', 'Cross‑device IPTV setup', 'EPG and playlist diagnostics']}
          bio="This feature page is based on hands‑on tests across popular IPTV apps and devices. We verify feature behavior with real providers, not just marketing claims."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}
