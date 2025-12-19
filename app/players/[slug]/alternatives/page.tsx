import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPlayer,
  getPlayers,
  getPlayerComparisons,
  getBaseUrl,
} from '@/lib/data-loader';
import {
  ChevronRight,
  Star,
  Crown,
  ArrowRight,
  Smartphone,
  Apple,
} from 'lucide-react';
import { BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Platform categories
const applePlatforms = ['ios', 'apple-tv', 'mac', 'vision-pro', 'ipad'];
const androidPlatforms = ['android', 'firestick', 'android-tv', 'nvidia-shield', 'chromecast'];

// Editor's choice picks by platform
const editorChoices = {
  apple: 'jamrun',
  android: 'tivimate',
  crossPlatform: 'iptv-smarters',
};

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
    title: `Best ${player.name} Alternatives 2025 - Top Similar IPTV Apps`,
    description: `Looking for ${player.name} alternatives? Compare the best similar IPTV players with features, pricing, and ratings. Find the perfect replacement or upgrade.`,
    keywords: [
      `${player.name.toLowerCase()} alternatives`,
      `apps like ${player.name.toLowerCase()}`,
      `${player.name.toLowerCase()} vs`,
      `best ${player.name.toLowerCase()} replacement`,
      'iptv player alternatives',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/players/${slug}/alternatives`,
    },
  };
}

export default async function PlayerAlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const [player, allPlayers, allComparisons] = await Promise.all([
    getPlayer(slug),
    getPlayers(),
    getPlayerComparisons(),
  ]);

  if (!player) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // Get comparisons involving this player
  const playerComparisons = allComparisons.filter(
    (c) => c.player1Id === player.id || c.player2Id === player.id
  );

  // Determine if this is an Apple or Android focused player
  const isAppleFocused = player.platforms.some((p) => applePlatforms.includes(p));
  const isAndroidFocused = player.platforms.some((p) => androidPlatforms.includes(p));

  // Get alternative players (exclude current player)
  const alternativePlayers = allPlayers
    .filter((p) => p.id !== player.id)
    .map((altPlayer) => {
      // Find the comparison between these two players
      const comparison = playerComparisons.find(
        (c) =>
          (c.player1Id === player.id && c.player2Id === altPlayer.id) ||
          (c.player2Id === player.id && c.player1Id === altPlayer.id)
      );

      // Check platform overlap
      const hasAppleSupport = altPlayer.platforms.some((p) => applePlatforms.includes(p));
      const hasAndroidSupport = altPlayer.platforms.some((p) => androidPlatforms.includes(p));
      const platformOverlap = player.platforms.filter((p) => altPlayer.platforms.includes(p)).length;

      // Is this player an editor's choice?
      const isEditorChoice =
        (hasAppleSupport && editorChoices.apple === altPlayer.id) ||
        (hasAndroidSupport && editorChoices.android === altPlayer.id) ||
        editorChoices.crossPlatform === altPlayer.id;

      return {
        ...altPlayer,
        comparison,
        hasAppleSupport,
        hasAndroidSupport,
        platformOverlap,
        isEditorChoice,
        relevanceScore:
          platformOverlap * 2 +
          altPlayer.rating +
          (isEditorChoice ? 5 : 0) +
          (comparison ? 2 : 0),
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Get top recommendations based on platform
  const appleAlternatives = alternativePlayers
    .filter((p) => p.hasAppleSupport)
    .slice(0, 6);
  const androidAlternatives = alternativePlayers
    .filter((p) => p.hasAndroidSupport)
    .slice(0, 6);

  // Generate FAQs
  const faqs = [
    {
      question: `What is the best alternative to ${player.name}?`,
      answer: isAppleFocused
        ? `For Apple devices (iPhone, iPad, Apple TV), JamRun IPTV is the best alternative with its stunning glass design, free pricing, and zero data collection. For Android, TiviMate offers premium features like EPG and recording.`
        : `For Android devices and Firestick, TiviMate is the top alternative with excellent EPG support and recording features. For Apple users, JamRun IPTV provides a beautiful, free experience.`,
    },
    {
      question: `Is there a free alternative to ${player.name}?`,
      answer: `Yes! JamRun IPTV is completely free for Apple devices with no ads. For Android, OTT Navigator and Perfect Player offer free options. Kodi is also free and available on all platforms.`,
    },
    {
      question: `Which ${player.name} alternative has the best features?`,
      answer: `TiviMate leads in features for Android with EPG, recording, and multi-view. JamRun IPTV offers the best Apple-native experience with VOD, catchup, and hardware decoding. IPTV Smarters Pro is best for cross-platform use.`,
    },
  ];

  // Is the current player the editor's choice for its platform?
  const isCurrentPlayerEditorChoice =
    (isAppleFocused && editorChoices.apple === player.id) ||
    (isAndroidFocused && editorChoices.android === player.id);

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Players', url: `${baseUrl}/players` },
          { name: player.name, url: `${baseUrl}/players/${slug}` },
          { name: 'Alternatives', url: `${baseUrl}/players/${slug}/alternatives` },
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/players" className="hover:text-gray-900 dark:hover:text-white">
                Players
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href={`/players/${slug}`} className="hover:text-gray-900 dark:hover:text-white">
                {player.name}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 dark:text-white font-medium">Alternatives</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Best {player.name} Alternatives in 2025
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {isCurrentPlayerEditorChoice ? (
              <>
                {player.name} is our top pick for{' '}
                {isAppleFocused ? 'Apple devices' : 'Android'}. But if you&apos;re looking for
                alternatives with different features or platform support, here are the best options.
              </>
            ) : (
              <>
                Looking for alternatives to {player.name}? We&apos;ve compared{' '}
                {playerComparisons.length} IPTV players to help you find the perfect fit for your
                streaming setup.
              </>
            )}
          </p>

          {/* Quick Answer Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Quick Answer: Best {player.name} Alternative
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <Apple className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">For Apple Devices</p>
                  <Link
                    href="/players/jamrun"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    JamRun IPTV
                  </Link>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    Free • 4.9★ • Best for iPhone, iPad, Apple TV
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <Smartphone className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">For Android/Firestick</p>
                  <Link
                    href="/players/tivimate"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    TiviMate
                  </Link>
                  <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
                    $9.99/yr • 4.8★ • Best features
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Current Player Card */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            About {player.name}
          </h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{player.name}</h3>
                  {isCurrentPlayerEditorChoice && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">
                      <Crown className="h-3 w-3" /> Editor&apos;s Choice
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {player.rating}
                  </span>
                  <span>{player.pricing.price}</span>
                  <span className="capitalize">{player.category}</span>
                </div>
              </div>
              <Link
                href={`/players/${slug}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Review →
              </Link>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{player.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {player.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Apple Alternatives */}
        {appleAlternatives.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Apple className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Best Alternatives for Apple (iOS, iPad, Apple TV)
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appleAlternatives.map((alt, index) => (
                <AlternativeCard
                  key={alt.id}
                  player={alt}
                  originalPlayer={player}
                  rank={index + 1}
                  isEditorChoice={alt.id === editorChoices.apple}
                />
              ))}
            </div>
          </section>
        )}

        {/* Android Alternatives */}
        {androidAlternatives.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Best Alternatives for Android & Firestick
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {androidAlternatives.map((alt, index) => (
                <AlternativeCard
                  key={alt.id}
                  player={alt}
                  originalPlayer={player}
                  rank={index + 1}
                  isEditorChoice={alt.id === editorChoices.android}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Comparisons */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {player.name} vs Other Players
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {playerComparisons.slice(0, 12).map((comparison) => {
              const isPlayer1 = comparison.player1Id === player.id;
              const otherPlayerName = isPlayer1 ? comparison.player2Name : comparison.player1Name;

              return (
                <Link
                  key={comparison.slug}
                  href={`/compare/players/${comparison.player1Id}/vs/${comparison.player2Id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-white">{player.name}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {otherPlayerName}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition" />
                </Link>
              );
            })}
          </div>
          {playerComparisons.length > 12 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              + {playerComparisons.length - 12} more comparisons available
            </p>
          )}
        </section>

        {/* FAQs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 bg-white dark:bg-gray-900"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Not Sure Which Player to Choose?</h2>
          <p className="text-blue-100 mb-6">
            Take our quick quiz to find the perfect IPTV player for your setup.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Take the Quiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Alternative Card Component
function AlternativeCard({
  player,
  originalPlayer,
  rank,
  isEditorChoice,
}: {
  player: {
    id: string;
    name: string;
    slug: string;
    rating: number;
    pricing: { price: string };
    shortDescription: string;
    platforms: string[];
    category: string;
    comparison?: { player1Id: string; player2Id: string };
  };
  originalPlayer: { id: string; name: string };
  rank: number;
  isEditorChoice: boolean;
}) {
  return (
    <div
      className={`border rounded-xl p-5 bg-white dark:bg-gray-900 transition ${
        isEditorChoice
          ? 'border-yellow-300 dark:border-yellow-700 ring-2 ring-yellow-100 dark:ring-yellow-900/30'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{rank}</span>
          {isEditorChoice && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">
              <Crown className="h-3 w-3" /> Top Pick
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-gray-900 dark:text-white">{player.rating}</span>
        </div>
      </div>

      <Link href={`/players/${player.slug}`}>
        <h3 className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition mb-1">
          {player.name}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {player.shortDescription}
      </p>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-700 dark:text-gray-300">{player.pricing.price}</span>
        <span className="text-gray-500 dark:text-gray-400 capitalize">{player.category}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {player.platforms.slice(0, 4).map((platform) => (
          <span
            key={platform}
            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
          >
            {platform}
          </span>
        ))}
        {player.platforms.length > 4 && (
          <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
            +{player.platforms.length - 4}
          </span>
        )}
      </div>

      {player.comparison && (
        <Link
          href={`/compare/players/${player.comparison.player1Id}/vs/${player.comparison.player2Id}`}
          className="block w-full text-center py-2 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-sm font-medium"
        >
          Compare with {originalPlayer.name}
        </Link>
      )}
    </div>
  );
}
