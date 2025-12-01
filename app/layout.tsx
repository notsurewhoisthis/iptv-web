import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'IPTV Guide - Setup Guides, Player Reviews & Troubleshooting',
    template: '%s | IPTV Guide',
  },
  description:
    'Comprehensive IPTV guides for TiviMate, Kodi, VLC, and more. Setup tutorials, player comparisons, troubleshooting tips for Firestick, Apple TV, Android, and all devices.',
  keywords: [
    'iptv',
    'iptv player',
    'tivimate',
    'kodi',
    'firestick iptv',
    'm3u playlist',
    'iptv guide',
    'iptv setup',
  ],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'IPTV Guide',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900">
                IPTV Guide
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/players"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Players
                </Link>
                <Link
                  href="/devices"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Devices
                </Link>
                <Link
                  href="/guides"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Guides
                </Link>
                <Link
                  href="/troubleshooting"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Troubleshooting
                </Link>
                <Link
                  href="/compare"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Compare
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Players</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/players/tivimate">TiviMate</Link>
                  </li>
                  <li>
                    <Link href="/players/kodi">Kodi</Link>
                  </li>
                  <li>
                    <Link href="/players/vlc">VLC</Link>
                  </li>
                  <li>
                    <Link href="/players/iptv-smarters">IPTV Smarters</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Devices</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/devices/firestick">Firestick</Link>
                  </li>
                  <li>
                    <Link href="/devices/apple-tv">Apple TV</Link>
                  </li>
                  <li>
                    <Link href="/devices/android-tv">Android TV</Link>
                  </li>
                  <li>
                    <Link href="/devices/nvidia-shield">NVIDIA Shield</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/guides">Setup Guides</Link>
                  </li>
                  <li>
                    <Link href="/troubleshooting">Troubleshooting</Link>
                  </li>
                  <li>
                    <Link href="/compare">Comparisons</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} IPTV Guide. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
