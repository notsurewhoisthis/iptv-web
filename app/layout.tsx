import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import Link from 'next/link';
import { MobileNav } from '@/components/MobileNav';
import { SearchWrapper } from '@/components/SearchWrapper';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChevronDown, Rss } from 'lucide-react';
import { ChatWidgetWrapper } from '@/components/ChatWidgetWrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || process.env.SITE_URL || 'https://localhost:3000'
  ),
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
  twitter: {
    card: 'summary_large_image',
    title: 'IPTV Guide - Setup Guides, Player Reviews & Troubleshooting',
    description:
      'Comprehensive IPTV guides for TiviMate, Kodi, VLC, and more. Setup tutorials, player comparisons, troubleshooting tips.',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

const PRIMARY_NAV_LINKS = [
  { href: '/players', label: 'Players' },
  { href: '/devices', label: 'Devices' },
  { href: '/guides', label: 'Guides' },
  { href: '/troubleshooting', label: 'Troubleshooting' },
  { href: '/stremio', label: 'Stremio' },
  { href: '/legal-iptv', label: 'Public IPTV' },
  { href: '/blog', label: 'Blog' },
] as const;

const MORE_NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/issues', label: 'Issues' },
  { href: '/use-cases', label: 'Use Cases' },
  { href: '/compare', label: 'Compare' },
  { href: '/learn', label: 'Learn' },
  { href: '/glossary', label: 'Glossary' },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinkClassName =
    'flex-shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50';

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
        <nav
          className="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/80 dark:bg-gray-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-950/60"
          aria-label="Main navigation"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href="/"
                  className="flex-shrink-0 whitespace-nowrap text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                  IPTV Guide
                </Link>

                <div className="hidden md:flex items-center gap-1 ml-1">
                  {PRIMARY_NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className={navLinkClassName}>
                      {link.label}
                    </Link>
                  ))}

                  <details className="relative">
                    <summary
                      className={`${navLinkClassName} cursor-pointer list-none inline-flex items-center gap-1 [&::-webkit-details-marker]:hidden`}
                      aria-label="More navigation links"
                    >
                      More
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </summary>
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur shadow-lg p-1">
                      {MORE_NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Suspense
                  fallback={<div className="w-28 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />}
                >
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
                    <Link href="/features">Features</Link>
                  </li>
                  <li>
                    <Link href="/issues">Common Issues</Link>
                  </li>
                  <li>
                    <Link href="/use-cases">Use Cases</Link>
                  </li>
                  <li>
                    <Link href="/troubleshooting">Troubleshooting</Link>
                  </li>
                  <li>
                    <Link href="/compare">Comparisons</Link>
                  </li>
                  <li>
                    <Link href="/stremio">Stremio</Link>
                  </li>
                  <li>
                    <Link href="/legal-iptv">Public IPTV</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/glossary">Glossary</Link>
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
                    <Link href="/contact">Contact Us</Link>
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

        {/* AI Chat Widget - Lazy loaded to reduce initial bundle */}
        <ChatWidgetWrapper />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WV9732SXXG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WV9732SXXG');
          `}
        </Script>
      </body>
    </html>
  );
}
