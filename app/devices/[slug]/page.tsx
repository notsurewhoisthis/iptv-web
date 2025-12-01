import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDevices, getDevice, getBaseUrl, getPlayerDeviceGuides } from '@/lib/data-loader';
import { ChevronRight, ExternalLink, Check, X } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const devices = await getDevices();
  return devices.map((device) => ({ slug: device.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const device = await getDevice(slug);

  if (!device) {
    return { title: 'Device Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: `${device.name} IPTV Setup - Best Players & Guides`,
    description: device.description,
    keywords: device.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/devices/${slug}`,
    },
    openGraph: {
      title: `${device.name} - IPTV Setup Guide`,
      description: device.shortDescription,
      type: 'article',
    },
  };
}

export default async function DevicePage({ params }: PageProps) {
  const { slug } = await params;
  const device = await getDevice(slug);

  if (!device) {
    notFound();
  }

  const guides = await getPlayerDeviceGuides();
  const deviceGuides = guides.filter((g) => g.deviceId === device.id).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/devices" className="hover:text-gray-900">Devices</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">{device.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {device.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{device.shortDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {device.brand}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {device.os}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {device.pricing}
            </span>
          </div>

          {device.amazonUrl && (
            <a
              href={device.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              View on Amazon <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{device.description}</p>
            </section>

            {/* Pros and Cons */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Pros</h3>
                <ul className="space-y-2">
                  {device.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-green-700">
                      <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Cons</h3>
                <ul className="space-y-2">
                  {device.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-700">
                      <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Compatible Players */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Compatible IPTV Players</h2>
              <div className="flex flex-wrap gap-2">
                {device.supportedPlayers.map((playerId) => (
                  <Link
                    key={playerId}
                    href={`/players/${playerId}`}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
                  >
                    {playerId.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            </section>

            {/* Setup Guides */}
            {deviceGuides.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Guides</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {deviceGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.playerId}/setup/${guide.deviceId}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
                    >
                      <h3 className="font-medium text-gray-900">
                        {guide.playerName} on {device.shortName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Step-by-step setup guide
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Specs */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Resolution</dt>
                  <dd className="text-gray-900">{device.specs.resolution}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Storage</dt>
                  <dd className="text-gray-900">{device.specs.storage}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-2">Connectivity</dt>
                  <dd className="flex flex-wrap gap-1">
                    {device.specs.connectivity.map((conn) => (
                      <span key={conn} className="px-2 py-1 bg-white rounded text-xs text-gray-700">
                        {conn}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href={`/troubleshooting/devices/${device.id}/buffering`}
                  className="block text-sm text-blue-600 hover:text-blue-800"
                >
                  Troubleshoot Buffering
                </Link>
                <Link
                  href={`/compare/devices/${device.id}/vs/firestick`}
                  className="block text-sm text-blue-600 hover:text-blue-800"
                >
                  Compare with Other Devices
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
