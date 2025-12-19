import Link from 'next/link';
import { Home, Search, BookOpen, Tv, Smartphone, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | IPTV Guide',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Visual */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white -mt-4">
            Page Not Found
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It may have been moved or doesn&apos;t exist.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Home</span>
          </Link>
          <Link
            href="/players"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Tv className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Players</span>
          </Link>
          <Link
            href="/devices"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Smartphone className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Devices</span>
          </Link>
          <Link
            href="/guides"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Guides</span>
          </Link>
          <Link
            href="/troubleshooting"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <HelpCircle className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Help</span>
          </Link>
          <Link
            href="/learn"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            <Search className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Learn</span>
          </Link>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
