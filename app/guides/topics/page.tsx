import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuideTopics, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema } from '@/components/JsonLd';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Guide Clusters - EPG, Buffering, Catch‑Up & More',
  description:
    'Topic hubs for IPTV setup and troubleshooting. Explore deep guide clusters on EPG, buffering, and catch‑up/timeshift.',
};

export default async function GuideTopicsPage() {
  const topics = await getGuideTopics();
  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Guide Topics"
        description="Topic hubs for IPTV setup and troubleshooting."
        url={`${baseUrl}/guides/topics`}
        numberOfItems={topics.length}
      />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Guide Topics</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Deep, focused clusters that cover a single IPTV topic end‑to‑end. Use these hubs
          to find the right fix quickly and explore related guides.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/guides/topics/${topic.slug}`}
              className="block p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition"
            >
              <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">
                Topic hub
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{topic.description}</p>
              <div className="text-sm text-gray-500">
                {topic.guideSlugs.length} guides
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
