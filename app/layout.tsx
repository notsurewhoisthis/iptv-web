import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Link from 'next/link';
import { MobileNav } from '@/components/MobileNav';
import { SearchWrapper } from '@/components/SearchWrapper';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Rss } from 'lucide-react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://localhost:3000'),
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
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-950`}>
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <nav className="border-b border-gray-200 dark:border-gray-800" aria-label="Main navigation">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                IPTV Guide
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/players"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Players
                </Link>
                <Link
                  href="/devices"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Devices
                </Link>
                <Link
                  href="/guides"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Guides
                </Link>
                <Link
                  href="/troubleshooting"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Troubleshooting
                </Link>
                <Link
                  href="/compare"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Compare
                </Link>
                <Link
                  href="/learn"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Learn
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Suspense fallback={<div className="w-24 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}>
                  <SearchWrapper />
                </Suspense>
                <ThemeToggle />
              </div>
              {/* Mobile Navigation */}
              <MobileNav />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Players</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Devices</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Alternatives</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    <Link href="/players/tivimate/alternatives">TiviMate Alternatives</Link>
                  </li>
                  <li>
                    <Link href="/players/vlc/alternatives">VLC Alternatives</Link>
                  </li>
                  <li>
                    <Link href="/players/kodi/alternatives">Kodi Alternatives</Link>
                  </li>
                  <li>
                    <Link href="/players/jamrun/alternatives">JamRun Alternatives</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link
                      href="/feed.xml"
                      className="inline-flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Rss className="h-3 w-3" />
                      RSS Feed
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
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
