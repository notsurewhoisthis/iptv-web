import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBaseUrl, getStremioArticle, getStremioArticles } from '@/lib/data-loader';
import { parseMarkdown } from '@/lib/markdown';
import { ArticleWithAuthorSchema, BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { LastUpdated } from '@/components/GeoComponents';
import { categoryLabel } from '@/app/stremio/_category';
import { StremioIPTVCrossLink } from '@/components/StremioIPTVCrossLink';
import { GlossaryTermLinks } from '@/components/GlossaryTermLinks';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getStremioArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

function categoryPath(category: string): string {
  const normalized = category.trim().toLowerCase();
  const known = new Set([
    'basics',
    'setup',
    'addons',
    'troubleshooting',
    'best-practices',
    'resources',
  ]);
  return known.has(normalized) ? `/stremio/${normalized}` : '/stremio';
}

function extractHeadings(markdown: string): Array<{ id: string; title: string }> {
  const lines = markdown.split('\n');
  const items: Array<{ id: string; title: string }> = [];
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)\s*$/);
    if (!match) continue;
    const title = match[1].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (id) items.push({ id, title });
  }
  return items.slice(0, 18);
}

function addHeadingAnchors(markdown: string): string {
  // Convert "## Heading" into "## <span id='...'></span>Heading" so the TOC can link reliably.
  return markdown
    .split('\n')
    .map((line) => {
      const match = line.match(/^##\s+(.+)\s*$/);
      if (!match) return line;
      const title = match[1].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (!id) return line;
      return `## <span id="${id}"></span>${title}`;
    })
    .join('\n');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getStremioArticle(slug);
  if (!article) return { title: 'Article Not Found' };

  const baseUrl = getBaseUrl();
  return {
    title: article.metaTitle,
    description: article.description,
    keywords: article.keywords.join(', '),
    alternates: { canonical: `${baseUrl}/stremio/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `${baseUrl}/stremio/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function StremioArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();
  const [article, all] = await Promise.all([getStremioArticle(slug), getStremioArticles()]);

  if (!article) notFound();

  const tocItems = extractHeadings(article.content);
  const contentWithAnchors = addHeadingAnchors(article.content);
  const html = await parseMarkdown(contentWithAnchors);

  const categoryHref = categoryPath(article.category);
  const categoryName = categoryLabel(article.category);

  const related = (article.relatedSlugs || [])
    .map((s) => all.find((a) => a.slug === s))
    .filter(Boolean)
    .slice(0, 6) as typeof all;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ArticleWithAuthorSchema
        title={article.title}
        description={article.description}
        url={`${baseUrl}/stremio/${article.slug}`}
        datePublished={article.lastUpdated}
        dateModified={article.lastUpdated}
        authorName="IPTV Guide Team"
        authorExpertise="Streaming & IPTV"
        baseUrl={baseUrl}
      />
      {article.faqs && article.faqs.length > 0 && <FAQSchema faqs={article.faqs} />}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Stremio', url: `${baseUrl}/stremio` },
          { name: categoryName, url: `${baseUrl}${categoryHref}` },
          { name: article.title, url: `${baseUrl}/stremio/${article.slug}` },
        ]}
      />

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-sm text-gray-500 mb-2">
            <Link href="/stremio" className="hover:underline">
              Stremio
            </Link>
            <span className="mx-2">/</span>
            <Link href={categoryHref} className="hover:underline">
              {categoryName}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {article.title}
          </h1>
          <p className="text-gray-600 max-w-3xl">{article.description}</p>
          <LastUpdated date={article.lastUpdated} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8">
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
                prose-img:rounded-lg prose-img:shadow-md
              "
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-10 text-sm text-gray-600">
              <Link href={categoryHref} className="text-blue-600 hover:underline">
                ← Back to {categoryName}
              </Link>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            {tocItems.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-semibold text-gray-900 mb-3">On this page</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  {tocItems.map((i) => (
                    <li key={i.id}>
                      <a href={`#${i.id}`} className="hover:underline">
                        {i.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border border-gray-200 rounded-xl p-5 bg-white">
              <h2 className="font-semibold text-gray-900 mb-3">Related</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/players/stremio" className="text-blue-600 hover:underline">
                    Stremio player overview
                  </Link>
                </li>
                <li>
                  <Link href="/guides/stremio/setup/firestick" className="text-blue-600 hover:underline">
                    Stremio setup guides
                  </Link>
                </li>
                <li>
                  <Link href="/legal-iptv" className="text-blue-600 hover:underline">
                    Public playlist directory (M3U)
                  </Link>
                </li>
              </ul>
            </div>

            {related.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-semibold text-gray-900 mb-3">More Stremio articles</h2>
                <ul className="space-y-2 text-sm">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/stremio/${r.slug}`} className="text-blue-600 hover:underline">
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cross-link to IPTV content */}
            <StremioIPTVCrossLink category={article.category} />

            {/* Glossary terms from article content */}
            <GlossaryTermLinks text={article.description} title="IPTV Terms" />
          </aside>
        </div>
      </main>
    </div>
  );
}

