import type { Metadata } from 'next';
import Link from 'next/link';
import { getDevices } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'Streaming Devices for IPTV - Firestick, Apple TV & More',
  description:
    'Find the best streaming device for IPTV. Setup guides for Firestick, Apple TV, Android TV, NVIDIA Shield, and more.',
};

export default async function DevicesPage() {
  const devices = await getDevices();

  // Group by category
  const categories = devices.reduce((acc, device) => {
    const cat = device.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  const categoryNames: Record<string, string> = {
    'streaming-stick': 'Streaming Sticks',
    'streaming-box': 'Streaming Boxes',
    'set-top-box': 'Set-Top Boxes',
    'smart-tv': 'Smart TVs',
    mobile: 'Mobile Devices',
    desktop: 'Desktop',
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Streaming Devices
        </h1>
        <p className="text-gray-600 mb-8">
          Choose the best device for IPTV streaming. We cover {devices.length}{' '}
          devices with setup guides and app compatibility.
        </p>

        {Object.entries(categories).map(([category, categoryDevices]) => (
          <section key={category} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {categoryNames[category] || category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryDevices.map((device) => (
                <Link
                  key={device.id}
                  href={`/devices/${device.slug}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {device.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {device.os}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {device.supportedPlayers.length} apps
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
