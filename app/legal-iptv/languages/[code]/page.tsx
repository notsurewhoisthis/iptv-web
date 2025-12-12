import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBaseUrl, getLegalIptvData } from '@/lib/data-loader';
import { BreadcrumbSchema } from '@/components/JsonLd';
import { CopyButton } from '@/components/CopyButton';
import { LastUpdated } from '@/components/GeoComponents';

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const baseUrl = getBaseUrl();
  return {
    title: `Public IPTV: ${code} language playlist (M3U)`,
    description:
      'Copy the playlist URL and open it in an IPTV player. Always verify rights and availability in your region.',
    alternates: { canonical: `${baseUrl}/legal-iptv/languages/${code}` },
  };
}

export default async function LegalIptvLanguageDetailPage({ params }: PageProps) {
  const { code } = await params;
  const baseUrl = getBaseUrl();
  const data = await getLegalIptvData();

  const language = data.languages.find((l) => l.code === code.toLowerCase());
  if (!language) notFound();

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-gray-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Public IPTV', url: `${baseUrl}/legal-iptv` },
          { name: 'Languages', url: `${baseUrl}/legal-iptv/languages` },
          { name: language.label, url: `${baseUrl}/legal-iptv/languages/${language.code}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Public IPTV playlist</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{language.label}</h1>
          <p className="text-gray-600">
            Language playlist URL from {data.source.name}. Use only legal streams and verify availability in your region.
          </p>
          <LastUpdated date={data.generatedAt} />
        </header>

        <div className="border border-gray-200 rounded-xl p-5 bg-white">
          <p className="text-sm text-gray-600 mb-3">Playlist URL (M3U)</p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <code className="text-xs bg-gray-100 rounded-lg px-3 py-2 break-all flex-1">
              {language.url}
            </code>
            <CopyButton text={language.url} label="Copy" />
            <a
              href={language.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Open
            </a>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to use</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Copy the M3U URL above.</li>
            <li>Open an IPTV player and choose “Open network stream / Add playlist URL”.</li>
            <li>Paste the URL and load the playlist.</li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            Recommended players: <Link href="/players/vlc" className="text-blue-600 hover:underline">VLC</Link>,{' '}
            <Link href="/players/kodi" className="text-blue-600 hover:underline">Kodi</Link>.
          </p>
        </section>

        <div className="mt-10 text-sm text-gray-600">
          <Link href="/legal-iptv/languages" className="text-blue-600 hover:underline">
            ← Back to languages
          </Link>
        </div>
      </div>
    </div>
  );
}

