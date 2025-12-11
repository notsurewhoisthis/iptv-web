import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getUseCases,
  getUseCase,
  getPlayers,
  getBaseUrl,
} from '@/lib/data-loader';
import {
  BreadcrumbSchema,
  FAQSchema,
  ArticleWithAuthorSchema,
  ItemListSchema,
} from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated, ComparisonTable } from '@/components/GeoComponents';
import { ChevronRight, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

type RankedPlayer = {
  rank: number;
  name: string;
  slug: string;
  rating: number;
  pricing: string;
  highlight: string;
  pros?: string[];
  cons?: string[];
};

export async function generateStaticParams() {
  const useCases = await getUseCases();
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const uc = await getUseCase(slug);
  const baseUrl = getBaseUrl();

  if (!uc) return { title: 'Use Case Not Found' };

  return {
    title: uc.metaTitle,
    description: uc.description,
    keywords: uc.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/use-cases/${slug}`,
    },
    openGraph: {
      title: uc.metaTitle,
      description: uc.description,
      type: 'article',
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const [uc, players] = await Promise.all([getUseCase(slug), getPlayers()]);
  const baseUrl = getBaseUrl();

  if (!uc) notFound();

  const rankedPlayers: RankedPlayer[] = (uc.rankings || [])
    .map((r) => {
      const p = players.find((x) => x.slug === r.playerId);
      if (!p) return null;
      return {
        rank: r.rank,
        name: p.name,
        slug: p.slug,
        rating: p.rating,
        pricing: p.pricing.price,
        highlight: r.whyRanked,
        pros: p.pros,
        cons: p.cons,
      };
    })
    .filter(Boolean) as RankedPlayer[];

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Use Cases', url: `${baseUrl}/use-cases` },
    { name: uc.title, url: `${baseUrl}/use-cases/${uc.slug}` },
  ];

  return (
    <div className="min-h-screen">
      <FAQSchema faqs={uc.faqs || []} />
      <ItemListSchema
        name={uc.title}
        description={uc.description}
        url={`${baseUrl}/use-cases/${uc.slug}`}
        items={rankedPlayers.map((p) => ({
          position: p.rank,
          name: p.name,
          url: `${baseUrl}/players/${p.slug}`,
          rating: p.rating,
        }))}
      />
      <ArticleWithAuthorSchema
        title={uc.title}
        description={uc.description}
        url={`${baseUrl}/use-cases/${uc.slug}`}
        datePublished={uc.lastUpdated}
        dateModified={uc.lastUpdated}
        authorName={uc.author.name}
        authorExpertise={uc.author.expertise}
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
              <Link href="/use-cases" className="hover:text-gray-900">Use Cases</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{uc.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {uc.title}
          </h1>
          <p className="text-lg text-gray-600 mb-2">{uc.description}</p>
          <LastUpdated date={uc.lastUpdated} />
        </header>

        <QuickAnswer
          question={uc.quickAnswer.question}
          answer={uc.quickAnswer.answer}
          highlight={uc.quickAnswer.highlight}
        />

        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{uc.content.intro}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ranked IPTV players</h2>
          <ComparisonTable players={rankedPlayers} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why this matters</h2>
          <p className="text-gray-700 leading-relaxed">{uc.content.whyItMatters}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top picks</h2>
          <div className="space-y-4">
            {rankedPlayers.map((p) => (
              <Link
                key={p.slug}
                href={`/players/${p.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-gray-900">
                    #{p.rank} {p.name}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{p.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{p.highlight}</p>
              </Link>
            ))}
          </div>
        </section>

        {uc.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {uc.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <EnhancedAuthorBio
          name={uc.author.name}
          title={uc.author.expertise}
          expertise={['Use‑case based IPTV testing', 'Cross‑platform streaming optimization']}
          bio="Use‑case rankings are based on hands‑on tests with real providers, large playlists, and device‑level performance checks."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}
