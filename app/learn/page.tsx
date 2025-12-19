import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import learnArticles from '@/data/learn-articles.json';
import { MarketStats } from '@/components/MarketStats';
import { BreadcrumbSchema, CollectionPageSchema } from '@/components/JsonLd';
import { getBaseUrl } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'Learn IPTV - Beginner Guides & Technical Explanations',
  description:
    'Free IPTV guides for beginners. Learn what IPTV is, how it works, M3U playlists, EPG setup, buffering fixes, and more. No tech jargon.',
  keywords: [
    'what is iptv',
    'how iptv works',
    'm3u playlist',
    'iptv guide',
    'iptv for beginners',
    'iptv tutorial',
  ],
};

const difficultyInfo = {
  Beginner: { color: 'text-green-600 dark:text-green-400' },
  Intermediate: { color: 'text-yellow-600 dark:text-yellow-400' },
  Expert: { color: 'text-red-600 dark:text-red-400' },
};

export default function LearnPage() {
  const baseUrl = getBaseUrl();

  // Group articles by category
  const basics = learnArticles.filter((a) => a.category === 'basics');
  const technical = learnArticles.filter((a) => a.category === 'technical');
  const troubleshooting = learnArticles.filter((a) => a.category === 'troubleshooting');
  const guides = learnArticles.filter((a) => a.category === 'guides');
  const comparison = learnArticles.filter((a) => a.category === 'comparison');

  // Featured/recommended order for beginners
  const startHere = ['what-is-iptv', 'm3u-playlists-explained', 'epg-guide-explained'];
  const featuredArticles = startHere
    .map((slug) => learnArticles.find((a) => a.slug === slug))
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Learn', url: `${baseUrl}/learn` },
        ]}
      />
      <CollectionPageSchema
        name="Learn IPTV"
        description="Free IPTV guides for beginners. Learn what IPTV is, how it works, M3U playlists, EPG setup, and more."
        url={`${baseUrl}/learn`}
        numberOfItems={learnArticles.length}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">IPTV Learning Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Learn IPTV From Scratch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Everything you need to know about IPTV, explained in plain English.
            No technical jargon, just clear explanations for beginners.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Market Stats */}
        <MarketStats />

        {/* Start Here Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🚀</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Start Here</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            New to IPTV? Read these articles first to understand the basics.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <Link
                key={article!.slug}
                href={`/learn/${article!.slug}`}
                className="group relative block p-6 bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition"
              >
                <span className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {article!.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {article!.description}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    {article!.readTime}
                  </span>
                  <span className={difficultyInfo[article!.difficulty as keyof typeof difficultyInfo].color}>
                    {article!.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Articles by Category */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Basics */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basics</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Foundational knowledge for understanding IPTV
            </p>
            <div className="space-y-3">
              {basics.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition group"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-sm">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Technical */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-purple-500 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Technical</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Deeper dives into how IPTV technology works
            </p>
            <div className="space-y-3">
              {technical.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 transition group"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition text-sm">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Troubleshooting */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-6 bg-orange-500 rounded-full" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Troubleshooting</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Fix common IPTV problems and issues
            </p>
            <div className="space-y-3">
              {troubleshooting.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-700 transition group"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition text-sm">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Guides & Comparison Row */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Guides */}
          {guides.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-green-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guides</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Practical guides for optimizing your IPTV setup
              </p>
              <div className="space-y-3">
                {guides.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition group"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition text-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Comparison */}
          {comparison.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comparisons</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Compare different IPTV technologies and options
              </p>
              <div className="space-y-3">
                {comparison.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="block p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition text-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CTA */}
        <section className="mt-12 p-8 bg-gray-900 dark:bg-gray-800 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Now that you understand IPTV, check out our player reviews and setup guides to start streaming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/players"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Browse IPTV Players
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
            >
              Setup Guides
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
