import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getBlogPost, getBaseUrl } from '@/lib/data-loader';
import { normalizeCategory, normalizeTag } from '@/lib/blog-taxonomy';
import { parseMarkdown } from '@/lib/markdown';
import { ChevronRight, Clock, Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { ArticleWithAuthorSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer } from '@/components/GeoComponents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Allow new blog posts created after build (e.g., via n8n) to be rendered on-demand
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      ...(post.featuredImage && {
        images: [{ url: post.featuredImage, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.featuredImage && {
        images: [post.featuredImage],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const baseUrl = getBaseUrl();

  if (!post) {
    notFound();
  }

  // Parse markdown content to HTML (async in marked v17)
  const htmlContent = await parseMarkdown(post.content);

  // Format dates
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const category = normalizeCategory(post.category);
  const tagItems = (post.tags || [])
    .map((t) => normalizeTag(t))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Structured Data for GEO */}
      <ArticleWithAuthorSchema
        title={post.title}
        description={post.description}
        url={`${baseUrl}/blog/${post.slug}`}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={post.author.name}
        authorExpertise={post.author.expertise || 'IPTV & Streaming Expert'}
        baseUrl={baseUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-blue-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-white font-medium truncate max-w-xs">
                Article
              </li>
            </ol>
          </nav>

          {/* Category Badge */}
          {category && (
            <Link
              href={`/blog/category/${category.slug}`}
              className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 hover:underline"
            >
              {category.label}
            </Link>
          )}

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-6 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-xs text-blue-200">{post.author.expertise || 'IPTV Expert'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.metrics.readingTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 mb-8 relative z-10">
          <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-8">
            {/* QuickAnswer for AI/GEO - Structured for AI extraction */}
            <div className="mb-8">
              <QuickAnswer
                question={`What does this article cover: ${post.title}?`}
                answer={post.description}
                highlight={category ? `Category: ${category.label}` : undefined}
              />
            </div>

            {/* Article Body */}
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-gray-200
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-gray-800
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-700
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:space-y-2
                prose-ol:my-4 prose-ol:space-y-2
                prose-li:text-gray-600 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:text-gray-700
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:shadow-md
                prose-hr:my-8 prose-hr:border-gray-200
              "
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags */}
            {tagItems.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {tagItems.map((tag) => (
                    <Link
                      key={tag!.slug}
                      href={`/blog/tag/${tag!.slug}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {tag!.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            <div className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    Written by
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {post.author.expertise || 'IPTV & Streaming Expert'}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {post.author.bio}
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Article Info Card */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Article Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Published</span>
                    <span className="text-gray-900 font-medium text-sm">{publishedDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Updated</span>
                    <span className="text-gray-900 font-medium text-sm">{updatedDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Reading Time</span>
                    <span className="text-gray-900 font-medium text-sm">{post.metrics.readingTime} min</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 text-sm">Word Count</span>
                    <span className="text-gray-900 font-medium text-sm">{post.metrics.wordCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Related Content Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 text-blue-100">
                  Explore More
                </h3>
                <p className="text-blue-100 text-sm mb-4">
                  Find more IPTV guides, setup tutorials, and troubleshooting tips.
                </p>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
                >
                  View All Guides
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Articles
          </Link>
        </div>
      </main>
    </div>
  );
}
