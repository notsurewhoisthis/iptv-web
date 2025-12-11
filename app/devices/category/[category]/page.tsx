import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDevices, getPlayers, getBaseUrl } from '@/lib/data-loader';
import { CollectionPageSchema, BreadcrumbSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { Tv, ArrowRight, Monitor, Gamepad2, Smartphone } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string }>;
}

const categoryLabels: Record<string, { label: string; icon: ReactNode }> = {
  'streaming-stick': {
    label: 'Streaming Sticks',
    icon: <Tv className="h-7 w-7 text-blue-600" />,
  },
  'streaming-box': {
    label: 'Streaming Boxes',
    icon: <Tv className="h-7 w-7 text-blue-600" />,
  },
  'set-top-box': {
    label: 'Set‑top Boxes',
    icon: <Tv className="h-7 w-7 text-blue-600" />,
  },
  'iptv-box': {
    label: 'IPTV Boxes',
    icon: <Tv className="h-7 w-7 text-blue-600" />,
  },
  'smart-tv': {
    label: 'Smart TVs',
    icon: <Tv className="h-7 w-7 text-blue-600" />,
  },
  desktop: {
    label: 'Desktop / PC',
    icon: <Monitor className="h-7 w-7 text-blue-600" />,
  },
  mobile: {
    label: 'Mobile Devices',
    icon: <Smartphone className="h-7 w-7 text-blue-600" />,
  },
  'gaming-console': {
    label: 'Gaming Consoles',
    icon: <Gamepad2 className="h-7 w-7 text-blue-600" />,
  },
};

function getCategoryLabel(category: string) {
  return (
    categoryLabels[category]?.label ||
    category
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export async function generateStaticParams() {
  const devices = await getDevices();
  const categories = Array.from(new Set(devices.map((d) => d.category)));
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const devices = await getDevices();
  const categoryDevices = devices.filter((d) => d.category === category);

  if (categoryDevices.length === 0) {
    return { title: 'Device Category Not Found' };
  }

  const baseUrl = getBaseUrl();
  const label = getCategoryLabel(category);

  return {
    title: `Best IPTV Devices: ${label} (2025 Guide)`,
    description: `Compare ${categoryDevices.length} ${label.toLowerCase()} for IPTV. Specs, supported apps, and setup recommendations.`,
    keywords: [
      `best iptv ${label.toLowerCase()}`,
      `${label.toLowerCase()} for iptv`,
      'iptv streaming devices',
      'iptv device guide',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/devices/category/${category}`,
    },
    openGraph: {
      title: `${label} for IPTV`,
      description: `Top ${label.toLowerCase()} for IPTV with setup tips.`,
      type: 'website',
      url: `${baseUrl}/devices/category/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${label} for IPTV`,
      description: `Top ${label.toLowerCase()} for IPTV with setup tips.`,
    },
  };
}

export default async function DevicesByCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const [devices, players] = await Promise.all([getDevices(), getPlayers()]);
  const categoryDevices = devices.filter((d) => d.category === category);

  if (categoryDevices.length === 0) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const label = getCategoryLabel(category);
  const icon = categoryLabels[category]?.icon;

  return (
    <div className="min-h-screen py-8">
      <CollectionPageSchema
        name={`IPTV ${label}`}
        description={`Compare ${label.toLowerCase()} that work well for IPTV.`}
        url={`${baseUrl}/devices/category/${category}`}
        numberOfItems={categoryDevices.length}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Devices', url: `${baseUrl}/devices` },
          { name: label, url: `${baseUrl}/devices/category/${category}` },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            {icon}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {label} for IPTV
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse {categoryDevices.length} {label.toLowerCase()} that are popular
            for IPTV streaming. We highlight compatible apps, performance, and setup
            considerations.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`Are ${label.toLowerCase()} good for IPTV?`}
          answer={`Yes—${label.toLowerCase()} can be excellent for IPTV when paired with a reliable player and stable internet. Focus on 4K support, strong Wi‑Fi/Ethernet, and enough storage for app caching.`}
          highlight={`${categoryDevices.length} devices, ${players.length} reviewed players.`}
        />

        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryDevices.map((device) => {
              const supportedPlayerCount = (device.supportedPlayers || []).length;
              const topPlayers = players
                .filter((p) => (device.supportedPlayers || []).includes(p.slug))
                .slice(0, 3);

              return (
                <article
                  key={device.slug}
                  className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition bg-white"
                >
                  <Link href={`/devices/${device.slug}`} className="block">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {device.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {device.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        OS: {device.os}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {supportedPlayerCount} compatible apps
                      </span>
                    </div>
                    {topPlayers.length > 0 && (
                      <div className="text-sm text-gray-700">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Top players
                        </p>
                        {topPlayers.map((p) => (
                          <div key={p.slug} className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-blue-600" />
                            <span>{p.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="Streaming Device Reviewers"
          expertise={[
            'IPTV device benchmarking',
            'Playback stability checks',
            'Wi‑Fi/Ethernet diagnostics',
            'Cross‑platform app testing',
          ]}
          bio="Our device notes come from hands‑on IPTV setup, long‑playlist testing, and real‑world buffering diagnostics."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

