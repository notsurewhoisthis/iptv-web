import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TechnicalGuide } from '@/lib/types';
import {
  getGuideTopics,
  getGuideTopic,
  getTechnicalGuides,
  getBaseUrl,
} from '@/lib/data-loader';
import { BreadcrumbSchema, CollectionPageSchema, ItemListSchema } from '@/components/JsonLd';
import { QuickAnswer, AuthorBio, LastUpdated } from '@/components/GeoComponents';
import { BookOpen, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const topics = await getGuideTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getGuideTopic(slug);
  const baseUrl = getBaseUrl();

  if (!topic) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: topic.metaTitle,
    description: topic.description,
    keywords: topic.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/guides/topics/${slug}`,
    },
    openGraph: {
      title: topic.metaTitle,
      description: topic.description,
      type: 'article',
    },
  };
}

export default async function GuideTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const [topic, guides] = await Promise.all([
    getGuideTopic(slug),
    getTechnicalGuides(),
  ]);
  const baseUrl = getBaseUrl();

  if (!topic) {
    notFound();
  }

  const guideMap = new Map(guides.map((guide) => [guide.slug, guide]));
  const orderedGuides = topic.guideSlugs
    .map((guideSlug) => guideMap.get(guideSlug))
    .filter((guide): guide is TechnicalGuide => Boolean(guide));
  const topicGuides = orderedGuides.length
    ? orderedGuides
    : guides.filter((guide) => guide.topic === topic.slug);

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Guides', url: `${baseUrl}/guides` },
    { name: 'Topics', url: `${baseUrl}/guides/topics` },
    { name: topic.title, url: `${baseUrl}/guides/topics/${topic.slug}` },
  ];

  const itemList = topicGuides.map((guide, index) => ({
    position: index + 1,
    name: guide.title,
    url: `${baseUrl}/guides/technical/${guide.slug}`,
  }));

  return (
    <div className="min-h-screen">
      <CollectionPageSchema
        name={`Guide topic: ${topic.title}`}
        description={topic.description}
        url={`${baseUrl}/guides/topics/${topic.slug}`}
        numberOfItems={topicGuides.length}
      />
      {itemList.length > 0 && (
        <ItemListSchema
          name={topic.title}
          description={topic.description}
          url={`${baseUrl}/guides/topics/${topic.slug}`}
          items={itemList}
        />
      )}
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
            <li>
              <Link href="/guides/topics" className="hover:text-gray-900">Topics</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{topic.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {topic.title}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">{topic.description}</p>
          <LastUpdated date={topic.lastUpdated} />
          {topic.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {topic.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </header>

        <QuickAnswer
          question={topic.quickAnswer.question}
          answer={topic.quickAnswer.answer}
          highlight={topic.quickAnswer.highlight}
        />

        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{topic.intro}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Guides in this topic
          </h2>
          {topicGuides.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {topicGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/technical/${guide.slug}`}
                  className="block p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        guide.category === 'troubleshooting'
                          ? 'bg-red-100 text-red-700'
                          : guide.category === 'setup'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Updated {new Date(guide.lastUpdated).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No guides are currently assigned to this topic. Check back soon.
            </p>
          )}
        </section>

        <AuthorBio name={topic.author.name} expertise={topic.author.expertise} />

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/guides/topics" className="text-blue-600 hover:underline">
            ← Back to all topics
          </Link>
        </div>
      </article>
    </div>
  );
}
