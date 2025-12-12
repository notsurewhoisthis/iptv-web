import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getTechnicalGuides,
  getTechnicalGuide,
  getBaseUrl,
  getPlayers,
  getDevices,
  getVideoForPage,
} from '@/lib/data-loader';
import { VideoWatchCard } from '@/components/VideoWatchCard';
import { ChevronRight, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import {
  QuickAnswer,
  AuthorBio,
  LastUpdated,
} from '@/components/GeoComponents';
import { FAQSchema, HowToSchema, ArticleWithAuthorSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { RelatedPlayers, RelatedDevices } from '@/components/RelatedContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = await getTechnicalGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getTechnicalGuide(slug);
  const baseUrl = getBaseUrl();

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/guides/technical/${slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      type: 'article',
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author.name],
    },
  };
}

export default async function TechnicalGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const [guide, allGuides, allPlayers, allDevices, video] = await Promise.all([
    getTechnicalGuide(slug),
    getTechnicalGuides(),
    getPlayers(),
    getDevices(),
    getVideoForPage('technical-guides', slug),
  ]);
  const baseUrl = getBaseUrl();

  if (!guide) {
    notFound();
  }

  // Get related guides
  const relatedGuides = guide.relatedGuides
    ? allGuides.filter((g) => guide.relatedGuides?.includes(g.slug))
    : [];

  // Get related players and devices from JSON data
  const relatedPlayerIds = guide.relatedPlayers || [];
  const relatedDeviceIds = guide.relatedDevices || [];

  // Build HowTo steps for schema
  const howToSteps = guide.content.sections
    .filter((s) => s.steps)
    .flatMap((s) => s.steps || [])
    .slice(0, 10)
    .map((step) => ({
      title: step.title,
      description: step.description,
    }));

  // Breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Guides', url: `${baseUrl}/guides` },
    { name: guide.title, url: `${baseUrl}/guides/technical/${guide.slug}` },
  ];

  return (
    <div className="min-h-screen">
      {/* Structured Data for GEO */}
      <FAQSchema faqs={guide.faqs} />
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
        url={`${baseUrl}/guides/technical/${guide.slug}`}
        datePublished={guide.lastUpdated}
        dateModified={guide.lastUpdated}
        authorName={guide.author.name}
        authorExpertise={guide.author.expertise}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

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
            <li className="text-gray-900 font-medium truncate">{guide.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              guide.category === 'troubleshooting'
                ? 'bg-red-100 text-red-700'
                : guide.category === 'setup'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {guide.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">{guide.description}</p>
          <LastUpdated date={guide.lastUpdated} />
        </header>

        {/* Quick Answer Box - AI extracts this first */}
        <QuickAnswer
          question={guide.quickAnswer.question}
          answer={guide.quickAnswer.answer}
          highlight={guide.quickAnswer.highlight}
        />

        {/* Video Guide */}
        {video && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Video Guide</h2>
            <VideoWatchCard video={video} />
          </section>
        )}

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{guide.content.intro}</p>
        </section>

        {/* Content Sections */}
        {guide.content.sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>

            {section.content && (
              <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
            )}

            {section.steps && section.steps.length > 0 && (
              <div className="space-y-4">
                {section.steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {stepIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* FAQ Section - Highest GEO value */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedGuides.map((related) => (
                <Link
                  key={related.slug}
                  href={`/guides/technical/${related.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{related.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Players - Works with these apps */}
        <RelatedPlayers
          playerIds={relatedPlayerIds}
          players={allPlayers}
          title="Works with these apps"
        />

        {/* Related Devices - Compatible devices */}
        <RelatedDevices
          deviceIds={relatedDeviceIds}
          devices={allDevices}
          title="Compatible devices"
        />

        {/* Author Bio for E-E-A-T */}
        <AuthorBio name={guide.author.name} expertise={guide.author.expertise} />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <Link href="/guides" className="text-gray-600 hover:text-gray-900">
              ← All Guides
            </Link>
            <Link href="/troubleshooting" className="text-blue-600 hover:text-blue-800">
              Troubleshooting Hub →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
