import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlayers, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { Star, ArrowRight, CreditCard } from 'lucide-react';

interface PageProps {
  params: Promise<{ tier: string }>;
}

const pricingInfo: Record<
  string,
  { label: string; blurb: string; seoLabel: string }
> = {
  free: {
    label: 'Free',
    seoLabel: 'Free IPTV Players',
    blurb: 'No‑cost apps with essential IPTV features.',
  },
  freemium: {
    label: 'Freemium',
    seoLabel: 'Freemium IPTV Players',
    blurb: 'Free to start, with optional upgrades for advanced features.',
  },
  'one-time': {
    label: 'One‑time Purchase',
    seoLabel: 'One‑Time Purchase IPTV Players',
    blurb: 'Pay once for lifetime access, no recurring fees.',
  },
  subscription: {
    label: 'Subscription',
    seoLabel: 'Subscription IPTV Players',
    blurb: 'Recurring plans that unlock premium features or multi‑device use.',
  },
};

function getTierInfo(tier: string) {
  return (
    pricingInfo[tier] || {
      label: tier.replace(/-/g, ' '),
      seoLabel: `${tier} IPTV Players`,
      blurb: 'Pricing model overview for IPTV players.',
    }
  );
}

export async function generateStaticParams() {
  const players = await getPlayers();
  const tiers = Array.from(
    new Set(players.map((p) => p.pricing?.model).filter(Boolean))
  );
  return tiers.map((tier) => ({ tier: tier as string }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tier } = await params;
  const players = await getPlayers();
  const tierPlayers = players.filter((p) => p.pricing?.model === tier);

  if (tierPlayers.length === 0) {
    return { title: 'Pricing Tier Not Found' };
  }

  const baseUrl = getBaseUrl();
  const info = getTierInfo(tier);

  return {
    title: `Best ${info.label} IPTV Players 2025 - Top Apps Reviewed`,
    description: `Compare ${tierPlayers.length} ${info.label.toLowerCase()} IPTV players. Features, ratings, platform support, and setup help.`,
    keywords: [
      `best ${info.label.toLowerCase()} iptv player`,
      `${info.label.toLowerCase()} iptv apps`,
      'iptv player pricing',
      'free iptv players',
      'premium iptv apps',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/players/pricing/${tier}`,
    },
    openGraph: {
      title: `Best ${info.label} IPTV Players`,
      description: `Top ${info.label.toLowerCase()} IPTV apps with hands‑on reviews.`,
      type: 'website',
      url: `${baseUrl}/players/pricing/${tier}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best ${info.label} IPTV Players`,
      description: `Top ${info.label.toLowerCase()} IPTV apps with ratings.`,
    },
  };
}

export default async function PlayersByPricingPage({ params }: PageProps) {
  const { tier } = await params;
  const players = await getPlayers();
  const tierPlayers = players.filter((p) => p.pricing?.model === tier);

  if (tierPlayers.length === 0) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const info = getTierInfo(tier);
  const topRated = [...tierPlayers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name={info.seoLabel}
        description={`Compare ${info.label.toLowerCase()} IPTV players.`}
        url={`${baseUrl}/players/pricing/${tier}`}
        numberOfItems={tierPlayers.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Players', url: `${baseUrl}/players` },
          { name: info.label, url: `${baseUrl}/players/pricing/${tier}` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {info.seoLabel}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            {info.blurb} We track {tierPlayers.length} apps in this tier.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`Which ${info.label.toLowerCase()} IPTV player is best?`}
          answer={
            topRated.length > 0
              ? `${topRated[0].name} is currently the highest‑rated ${info.label.toLowerCase()} IPTV player. Compare the list below for platform support and features like EPG, catch‑up, and recording.`
              : `Compare the list below for platform support and features like EPG, catch‑up, and recording.`
          }
          highlight={
            topRated.length > 0
              ? `Top picks: ${topRated.map((p) => p.name).join(', ')}`
              : undefined
          }
        />

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All {info.label.toLowerCase()} players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tierPlayers.map((player) => (
              <article
                key={player.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-md transition bg-white"
              >
                <Link href={`/players/${player.slug}`} className="block">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{player.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {player.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {player.pricing.price}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {player.platforms.length} platforms
                    </span>
                  </div>
                </Link>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/players/${player.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Read review
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV App Reviewers & Testers"
          expertise={[
            'Pricing and value benchmarking',
            'Large‑playlist performance checks',
            'Cross‑platform IPTV reviews',
          ]}
          bio="Our reviews include transparent pricing notes, real‑device testing, and feature verification so you can choose the right value tier."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

