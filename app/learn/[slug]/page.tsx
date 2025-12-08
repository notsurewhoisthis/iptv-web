import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import learnArticles from '@/data/learn-articles.json';
import { TableOfContents, TOCItem } from '@/components/TableOfContents';
import { RelatedContent, RelatedPlayers, RelatedGuides } from '@/components/RelatedContent';
import { IptvArchitectureDiagram, StreamingFlowDiagram, M3uStructureDiagram } from '@/components/IptvDiagram';
import { EnhancedAuthorBio, EditorialReviewBadge, LastUpdated } from '@/components/GeoComponents';
import { TechArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { getBaseUrl, getPlayers, getTechnicalGuides, getVideoForPage } from '@/lib/data-loader';
import { VideoEmbed } from '@/components/VideoEmbed';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = learnArticles.find((a) => a.slug === slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: article.metaTitle,
    description: article.description,
    alternates: {
      canonical: `${baseUrl}/learn/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
  };
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const categoryColors = {
  basics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  technical: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  troubleshooting: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

export default async function LearnArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = learnArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const [allPlayers, allGuides, video] = await Promise.all([
    getPlayers(),
    getTechnicalGuides(),
    getVideoForPage('learn-articles', slug),
  ]);

  const baseUrl = getBaseUrl();

  // Map article categories to relevant players and guides
  const articleToPlayers: Record<string, string[]> = {
    'what-is-iptv': ['tivimate', 'kodi', 'vlc', 'iptv-smarters'],
    'm3u-playlists-explained': ['vlc', 'kodi', 'tivimate', 'iptv-smarters'],
    'xtream-codes-vs-m3u': ['tivimate', 'iptv-smarters', 'ott-navigator'],
    'epg-guide-explained': ['tivimate', 'perfect-player', 'iptv-smarters'],
    'how-iptv-works': ['tivimate', 'kodi', 'vlc'],
    'buffering-solutions': ['tivimate', 'kodi', 'vlc'],
    'codec-comparison': ['vlc', 'kodi', 'tivimate'],
    'iptv-vs-cable': ['tivimate', 'kodi', 'jamrun'],
    'legal-iptv-guide': ['tivimate', 'stremio', 'kodi'],
    'vpn-for-iptv': ['tivimate', 'kodi', 'iptv-smarters'],
    'record-iptv-streams': ['tivimate', 'kodi', 'perfect-player'],
    'multi-room-setup': ['tivimate', 'iptv-smarters', 'ott-navigator'],
    'choosing-iptv-player': ['tivimate', 'kodi', 'vlc', 'iptv-smarters', 'jamrun'],
    'iptv-quality-settings': ['tivimate', 'kodi', 'vlc'],
  };

  const articleToGuides: Record<string, string[]> = {
    'what-is-iptv': ['m3u-playlist-complete-guide', 'xtream-codes-complete-guide'],
    'm3u-playlists-explained': ['m3u-playlist-complete-guide', 'setup-epg-guide'],
    'xtream-codes-vs-m3u': ['xtream-codes-complete-guide', 'm3u-playlist-complete-guide'],
    'epg-guide-explained': ['setup-epg-guide', 'fix-iptv-buffering'],
    'buffering-solutions': ['fix-iptv-buffering', 'setup-vpn-for-iptv'],
    'vpn-for-iptv': ['setup-vpn-for-iptv', 'fix-iptv-buffering'],
    'record-iptv-streams': ['record-iptv-guide', 'fix-iptv-buffering'],
    'multi-room-setup': ['multi-room-iptv-setup', 'fix-iptv-buffering'],
  };

  const relevantPlayerIds = articleToPlayers[slug] || ['tivimate', 'kodi', 'vlc'];
  const relevantGuideIds = articleToGuides[slug] || [];

  // Build TOC from sections
  const tocItems: TOCItem[] = article.sections.map((section) => ({
    id: section.id,
    title: section.title,
    level: 2,
  }));

  if (article.faqs && article.faqs.length > 0) {
    tocItems.push({ id: 'faq', title: 'Frequently Asked Questions', level: 2 });
  }

  // Get related articles
  const relatedArticles = article.relatedSlugs
    ?.map((relSlug) => learnArticles.find((a) => a.slug === relSlug))
    .filter(Boolean)
    .map((a) => ({
      title: a!.title,
      description: a!.description,
      href: `/learn/${a!.slug}`,
      type: 'learn' as const,
      meta: a!.readTime,
    })) || [];

  // Find prev/next articles
  const currentIndex = learnArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? learnArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < learnArticles.length - 1 ? learnArticles[currentIndex + 1] : null;

  // Determine which diagrams to show based on article
  const showArchitectureDiagram = slug === 'how-iptv-works' || slug === 'what-is-iptv';
  const showStreamingFlow = slug === 'what-is-iptv';
  const showM3uDiagram = slug === 'm3u-playlists-explained';

  return (
    <div className="min-h-screen">
      {/* Schema */}
      <TechArticleSchema
        title={article.title}
        description={article.description}
        url={`${baseUrl}/learn/${slug}`}
        datePublished={article.lastUpdated}
        dateModified={article.lastUpdated}
        proficiencyLevel={article.difficulty as 'Beginner' | 'Intermediate' | 'Expert'}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Learn', url: `${baseUrl}/learn` },
          { name: article.title, url: `${baseUrl}/learn/${slug}` },
        ]}
      />
      {article.faqs && <FAQSchema faqs={article.faqs} />}

      {/* Breadcrumb */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/learn" className="hover:text-gray-900 dark:hover:text-white">Learn</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 dark:text-white font-medium truncate">{article.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category as keyof typeof categoryColors]}`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[article.difficulty as keyof typeof difficultyColors]}`}>
              {article.difficulty}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {article.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} read
            </span>
            <LastUpdated date={article.lastUpdated} />
          </div>

          <EditorialReviewBadge reviewDate={new Date(article.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
        </header>

        {/* Table of Contents */}
        <TableOfContents items={tocItems} />

        {/* Video Overview */}
        {video && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Video Overview</h2>
            <VideoEmbed video={video} />
          </section>
        )}

        {/* Diagrams based on article type */}
        {showArchitectureDiagram && <IptvArchitectureDiagram />}
        {showStreamingFlow && <StreamingFlowDiagram />}
        {showM3uDiagram && <M3uStructureDiagram />}

        {/* Content Sections */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {section.content.split('\n\n').map((paragraph, i) => {
                  // Check if it's a table (contains |)
                  if (paragraph.includes('|') && paragraph.includes('---')) {
                    const lines = paragraph.split('\n').filter(l => l.trim());
                    const headers = lines[0].split('|').filter(h => h.trim());
                    const rows = lines.slice(2).map(r => r.split('|').filter(c => c.trim()));

                    return (
                      <div key={i} className="overflow-x-auto my-4">
                        <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                              {headers.map((h, j) => (
                                <th key={j} className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold">
                                  {h.trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, j) => (
                              <tr key={j} className={j % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-900/50'}>
                                {row.map((cell, k) => (
                                  <td key={k} className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // Check if it's a code block
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```\w*\n?/g, '').trim();
                    return (
                      <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
                        <code>{code}</code>
                      </pre>
                    );
                  }

                  // Check if it's a list
                  if (paragraph.match(/^(\d+\.|[-•*])\s/m)) {
                    const items = paragraph.split('\n').filter(l => l.trim());
                    const isOrdered = items[0]?.match(/^\d+\./);

                    const ListTag = isOrdered ? 'ol' : 'ul';
                    return (
                      <ListTag key={i} className={`my-4 ${isOrdered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2`}>
                        {items.map((item, j) => {
                          const text = item.replace(/^(\d+\.|[-•*])\s*/, '');
                          // Handle bold text
                          const parts = text.split(/(\*\*[^*]+\*\*)/);
                          return (
                            <li key={j}>
                              {parts.map((part, k) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={k}>{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </li>
                          );
                        })}
                      </ListTag>
                    );
                  }

                  // Regular paragraph with bold text handling
                  const parts = paragraph.split(/(\*\*[^*]+\*\*)/);
                  return (
                    <p key={i} className="mb-4">
                      {parts.map((part, k) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={k}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faq" className="mb-10 scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {article.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-5"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Author Bio */}
        <EnhancedAuthorBio
          name="IPTV Guide Editorial Team"
          title="Streaming Technology Experts"
          expertise={['IPTV Setup', 'Streaming Devices', 'Video Codecs', 'Network Optimization']}
          bio="Our team of streaming enthusiasts has tested over 50 IPTV players across dozens of devices. We break down complex technical topics into easy-to-understand guides for everyday users."
          yearsExperience={5}
          articlesWritten={100}
        />

        {/* Try with these players */}
        <RelatedPlayers
          playerIds={relevantPlayerIds}
          players={allPlayers}
          title="Try with these players"
        />

        {/* Related setup guides */}
        {relevantGuideIds.length > 0 && (
          <RelatedGuides
            guideIds={relevantGuideIds}
            guides={allGuides}
            title="Related setup guides"
          />
        )}

        {/* Navigation */}
        <nav className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          {prevArticle ? (
            <Link
              href={`/learn/${prevArticle.slug}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-500">Previous</div>
                <div className="text-sm font-medium">{prevArticle.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextArticle && (
            <Link
              href={`/learn/${nextArticle.slug}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition text-right"
            >
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">Next</div>
                <div className="text-sm font-medium">{nextArticle.title}</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>

        {/* Related Content */}
        {relatedArticles.length > 0 && (
          <RelatedContent
            title="Continue Learning"
            items={relatedArticles}
            columns={3}
          />
        )}
      </article>
    </div>
  );
}
