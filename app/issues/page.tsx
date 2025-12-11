import type { Metadata } from 'next';
import Link from 'next/link';
import { getIssues, getPlayers, getDevices, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { AlertTriangle, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IPTV Problems & Fixes - Buffering, EPG Issues, Playback Errors',
  description:
    'Troubleshoot common IPTV problems in 2025. Learn why IPTV buffers, why EPG won’t load, how to fix playback errors, audio sync issues, and more.',
};

export default async function IssuesPage() {
  const [issues, players, devices] = await Promise.all([
    getIssues(),
    getPlayers(),
    getDevices(),
  ]);
  const baseUrl = getBaseUrl();

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Issues', url: `${baseUrl}/issues` },
  ];

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name="IPTV Issues"
        description="Fix buffering, EPG problems, playback errors, and other common IPTV issues."
        url={`${baseUrl}/issues`}
        numberOfItems={issues.length}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-7 w-7 text-red-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Issues & Fixes
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            IPTV is reliable when it’s set up correctly. This hub covers the most common problems
            and shows the fastest fixes before you dig into player‑ or device‑specific guides.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question="What’s the fastest way to fix IPTV problems?"
          answer="Start with your network (Ethernet or 5 GHz Wi‑Fi), then refresh your playlist/EPG, and finally check player buffer and codec settings. Most issues trace back to these three layers."
          highlight={`We track ${issues.length} core issues across ${players.length} players and ${devices.length} devices.`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <article
              key={issue.slug}
              className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition bg-white"
            >
              <Link href={`/issues/${issue.slug}`} className="block">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="h-5 w-5 text-gray-700" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {issue.name}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {issue.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Severity: {issue.severity}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {issue.affectedPlayers.length} players
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {issue.affectedDevices.length} devices
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={[
            'Buffering diagnostics',
            'Playlist/EPG repair',
            'Codec and audio troubleshooting',
          ]}
          bio="We reproduce each issue on real devices and verify fixes using multiple providers. Our steps are based on repeatable tests, not guesses."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

