import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBaseUrl } from '@/lib/data-loader';
import { normalizeCategory, normalizeTag, getBlogTags } from '@/lib/blog-taxonomy';
import { Clock, Calendar, ImageIcon } from 'lucide-react';
import { CollectionPageSchema } from '@/components/JsonLd';

const PAGE_SIZE = 10;

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const baseUrl = getBaseUrl();
  const posts = await getBlogPosts();
  const sp = await searchParams;
  const rawPage = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const currentPage = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const canonical =
    safePage > 1 ? `${baseUrl}/blog?page=${safePage}` : `${baseUrl}/blog`;

  return {
    title: 'IPTV Blog - News, Guides & Tips',
    description:
      'Latest IPTV news, streaming guides, player updates, and tips for getting the best streaming experience.',
    alternates: { canonical },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const posts = await getBlogPosts();
  const baseUrl = getBaseUrl();
  const sp = await searchParams;
  const rawPage = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const currentPage = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);
  const topTags = getBlogTags(posts).slice(0, 8);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-gray-600">
            No blog posts yet. Check back soon for IPTV news, guides, and tips!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Blog"
        description="Latest IPTV news, streaming guides, player updates, and tips for getting the best streaming experience."
        url={`${baseUrl}/blog`}
        numberOfItems={posts.length}
      />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">
          Latest IPTV news, streaming guides, and tips.
        </p>

        {topTags.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Popular tags</h2>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {paginatedPosts.map((post) => {
            const category = normalizeCategory(post.category);
            const tags = (post.tags || [])
              .map((t) => normalizeTag(t))
              .filter(Boolean);
            const cardImage = post.featuredImage || `/blog/${post.slug}/opengraph-image`;

            return (
              <article
                key={post.slug}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {/* Featured Image or Placeholder */}
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
                    {category && (
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="bg-gray-100 px-2 py-1 rounded text-xs hover:underline"
                      >
                        {category.label}
                      </Link>
                    )}
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.slice(0, 5).map((tag) => (
                        <Link
                          key={tag!.slug}
                          href={`/blog/tag/${tag!.slug}`}
                          className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded hover:underline"
                        >
                          {tag!.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between mt-10 text-sm"
            aria-label="Blog pagination"
          >
            {safePage > 1 ? (
              <Link
                href={`/blog?page=${safePage - 1}`}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <span>
                Page {safePage} of {totalPages}
              </span>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, safePage - 3),
                    Math.min(totalPages, safePage + 2)
                  )
                  .map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border transition ${
                        p === safePage
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
              </div>
            </div>

            {safePage < totalPages ? (
              <Link
                href={`/blog?page=${safePage + 1}`}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
