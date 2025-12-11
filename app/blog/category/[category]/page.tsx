import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBaseUrl } from '@/lib/data-loader';
import { getBlogCategories, normalizeCategory } from '@/lib/blog-taxonomy';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, LastUpdated } from '@/components/GeoComponents';
import { Clock, Calendar, FolderOpen, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = true;
const PAGE_SIZE = 10;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const categories = getBlogCategories(posts);
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const posts = await getBlogPosts();
  const categories = getBlogCategories(posts);
  const categoryInfo = categories.find((c) => c.slug === category);
  const label = categoryInfo?.label || category.replace(/-/g, ' ');

  const categoryPosts = posts.filter(
    (post) => normalizeCategory(post.category)?.slug === category
  );

  if (categoryPosts.length === 0) {
    return { title: 'Category Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: `${label} IPTV Blog Posts - Guides & News`,
    description: `Browse IPTV articles in the "${label}" category. Practical setup guides, troubleshooting, and player insights.`,
    keywords: [
      `${label.toLowerCase()} iptv`,
      `${label.toLowerCase()} guides`,
      'iptv blog category',
      'iptv tips',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/blog/category/${category}`,
    },
  };
}

export default async function BlogCategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const posts = await getBlogPosts();
  const categories = getBlogCategories(posts);
  const categoryInfo = categories.find((c) => c.slug === category);
  const label = categoryInfo?.label || category.replace(/-/g, ' ');

  const categoryPosts = posts.filter(
    (post) => normalizeCategory(post.category)?.slug === category
  );

  if (categoryPosts.length === 0) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const sp = await searchParams;
  const rawPage = Array.isArray(sp?.page) ? sp?.page[0] : sp?.page;
  const currentPage = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(categoryPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedPosts = categoryPosts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name={`Blog category: ${label}`}
        description={`IPTV blog posts in ${label}.`}
        url={`${baseUrl}/blog/category/${category}`}
        numberOfItems={categoryPosts.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: label, url: `${baseUrl}/blog/category/${category}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {label} Articles
            </h1>
          </div>
          <p className="text-gray-600">
            {categoryPosts.length} posts in the “{label}” category.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`What will I learn in ${label} posts?`}
          answer={`These articles focus on ${label.toLowerCase()} topics for IPTV streaming, with step‑by‑step guidance and verified fixes.`}
        />

        <div className="space-y-6 mt-8">
          {paginatedPosts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative w-full aspect-[3/1] bg-gradient-to-br from-blue-600 to-indigo-700">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  ) : null}
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
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between mt-10 text-sm"
            aria-label="Category pagination"
          >
            {safePage > 1 ? (
              <Link
                href={`/blog/category/${category}?page=${safePage - 1}`}
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
                href={`/blog/category/${category}?page=${safePage + 1}`}
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

