import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getIssues,
  getIssue,
  getPlayers,
  getDevices,
  getPlayerTroubleshooting,
  getDeviceTroubleshooting,
  getTechnicalGuides,
  getBaseUrl,
} from '@/lib/data-loader';
import { BreadcrumbSchema, ArticleWithAuthorSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const issues = await getIssues();
  return issues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  const baseUrl = getBaseUrl();

  if (!issue) return { title: 'Issue Not Found' };

  return {
    title: `${issue.name} - IPTV Fix Guide`,
    description: issue.description,
    keywords: issue.keywords.join(', '),
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/issues/${slug}`,
    },
    openGraph: {
      title: issue.name,
      description: issue.description,
      type: 'article',
    },
  };
}

export default async function IssuePage({ params }: PageProps) {
  const { slug } = await params;
  const [
    issue,
    players,
    devices,
    playerTroubleshooting,
    deviceTroubleshooting,
    technicalGuides,
  ] = await Promise.all([
    getIssue(slug),
    getPlayers(),
    getDevices(),
    getPlayerTroubleshooting(),
    getDeviceTroubleshooting(),
    getTechnicalGuides(),
  ]);
  const baseUrl = getBaseUrl();

  if (!issue) notFound();

  const affectedPlayers = players.filter((p) =>
    issue.affectedPlayers.includes(p.slug)
  );
  const affectedDevices = devices.filter((d) =>
    issue.affectedDevices.includes(d.slug)
  );

  const relatedPlayerFixes = playerTroubleshooting
    .filter((g) => g.issueId === issue.slug)
    .slice(0, 12);
  const relatedDeviceFixes = deviceTroubleshooting
    .filter((g) => g.issueId === issue.slug)
    .slice(0, 12);

  const relatedTechGuides = technicalGuides
    .filter((g) => g.keywords.some((k) => k.toLowerCase().includes(issue.slug)))
    .slice(0, 8);

  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    { name: 'Issues', url: `${baseUrl}/issues` },
    { name: issue.name, url: `${baseUrl}/issues/${issue.slug}` },
  ];

  return (
    <div className="min-h-screen">
      <ArticleWithAuthorSchema
        title={issue.name}
        description={issue.description}
        url={`${baseUrl}/issues/${issue.slug}`}
        datePublished={new Date().toISOString()}
        dateModified={new Date().toISOString()}
        authorName="IPTV Guide Team"
        authorExpertise="IPTV & Streaming Specialists"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/issues" className="hover:text-gray-900">Issues</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{issue.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-7 w-7 text-red-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {issue.name}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">{issue.description}</p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`How do I fix ${issue.name.toLowerCase()}?`}
          answer={issue.generalSolutions[0] || issue.description}
          highlight={`Severity: ${issue.severity}`}
        />

        {issue.commonCauses.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Common causes</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {issue.commonCauses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {issue.generalSolutions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Step‑by‑step fixes</h2>
            <div className="space-y-3">
              {issue.generalSolutions.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="text-gray-700">{s}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {affectedPlayers.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Players where this issue is common
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {affectedPlayers.map((p) => (
                <Link
                  key={p.slug}
                  href={`/players/${p.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{p.shortDescription}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {affectedDevices.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Devices where this issue shows up
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {affectedDevices.map((d) => (
                <Link
                  key={d.slug}
                  href={`/devices/${d.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="font-semibold text-gray-900 mb-1">{d.name}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{d.shortDescription}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(relatedPlayerFixes.length > 0 || relatedDeviceFixes.length > 0) && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Player‑ and device‑specific fixes
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPlayerFixes.map((g) => (
                <Link
                  key={g.slug}
                  href={`/troubleshooting/players/${g.playerId}/${g.issueId}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {g.playerName}: {issue.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
              {relatedDeviceFixes.map((g) => (
                <Link
                  key={g.slug}
                  href={`/troubleshooting/devices/${g.deviceId}/${g.issueId}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {g.deviceName}: {issue.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedTechGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related technical guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedTechGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/technical/${g.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={['Hands‑on troubleshooting', 'Provider playlist diagnostics', 'Network and codec fixes']}
          bio="All solutions here are tested across multiple IPTV players and devices. If a fix depends on a specific app or platform, we call it out clearly."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}
