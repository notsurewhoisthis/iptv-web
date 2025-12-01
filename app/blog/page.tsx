import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data-loader';
import { Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Blog - News, Guides & Tips',
  description:
    'Latest IPTV news, streaming guides, player updates, and tips for getting the best streaming experience.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">
          Latest IPTV news, streaming guides, and tips.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-gray-700">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.metrics.readingTime} min read
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {post.category}
                </span>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
