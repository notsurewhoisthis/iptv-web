import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBaseUrl } from '@/lib/data-loader';
import { getBlogTags, normalizeTag } from '@/lib/blog-taxonomy';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { Clock, Calendar, Tag as TagIcon, ArrowRight, ImageIcon } from 'lucide-react';

interface PageProps {
  params: Promise<{ tag: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = true;
const PAGE_SIZE = 10;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const tags = getBlogTags(posts);
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getBlogPosts();
  const tags = getBlogTags(posts);
  const tagInfo = tags.find((t) => t.slug === tag);
  const label = tagInfo?.label || tag.replace(/-/g, ' ');

  const tagPosts = posts.filter((post) =>
    (post.tags || []).some((t) => normalizeTag(t)?.slug === tag)
  );

  if (tagPosts.length === 0) {
    return { title: 'Tag Not Found' };
  }

  const baseUrl = getBaseUrl();
  const sp = await searchParams;
  const rawPage = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const currentPage = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(tagPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const canonical =
    safePage > 1
      ? `${baseUrl}/blog/tag/${tag}?page=${safePage}`
      : `${baseUrl}/blog/tag/${tag}`;

  return {
    title:
      safePage > 1
        ? `${label} IPTV Blog Posts - Guides & News (Page ${safePage})`
        : `${label} IPTV Blog Posts - Guides & News`,
    description: `Browse IPTV articles tagged "${label}". Setup guides, troubleshooting, and player insights.`,
    keywords: [
      `${label.toLowerCase()} iptv`,
      `${label.toLowerCase()} guides`,
      'iptv blog',
      'iptv tips',
    ].join(', '),
    alternates: {
      canonical,
    },
  };
}

export default async function BlogTagPage({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const posts = await getBlogPosts();
  const tags = getBlogTags(posts);
  const tagInfo = tags.find((t) => t.slug === tag);
  const label = tagInfo?.label || tag.replace(/-/g, ' ');

  const tagPosts = posts.filter((post) =>
    (post.tags || []).some((t) => normalizeTag(t)?.slug === tag)
  );

  if (tagPosts.length === 0) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const sp = await searchParams;
  const rawPage = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const currentPage = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(tagPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedPosts = tagPosts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name={`Blog tag: ${label}`}
        description={`IPTV blog posts tagged ${label}.`}
        url={`${baseUrl}/blog/tag/${tag}`}
        numberOfItems={tagPosts.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: label, url: `${baseUrl}/blog/tag/${tag}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TagIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {label} Articles
            </h1>
          </div>
          <p className="text-gray-600">
            {tagPosts.length} posts tagged “{label}”.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`What will I learn in ${label} posts?`}
          answer={`These articles cover ${label.toLowerCase()} topics, including setup steps, common problems, and best‑practice recommendations for IPTV streaming.`}
        />

        <div className="space-y-6 mt-8">
          {paginatedPosts.map((post) => {
            const cardImage = post.featuredImage || `/blog/${post.slug}/opengraph-image`;
            return (
              <article
                key={post.slug}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative w-full aspect-[3/1] bg-gradient-to-br from-blue-600 to-indigo-700">
                    <Image
                      src={cardImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    {!post.featuredImage && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <ImageIcon className="h-10 w-10 text-white/25" />
                      </div>
                    )}
                  </div>
                </Link>
              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.metrics.readingTime} min read
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Read article
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between mt-10 text-sm"
            aria-label="Tag pagination"
          >
            {safePage > 1 ? (
              <Link
                href={`/blog/tag/${tag}?page=${safePage - 1}`}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}

            <div className="text-gray-600">
              Page {safePage} of {totalPages}
            </div>

            {safePage < totalPages ? (
              <Link
                href={`/blog/tag/${tag}?page=${safePage + 1}`}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
