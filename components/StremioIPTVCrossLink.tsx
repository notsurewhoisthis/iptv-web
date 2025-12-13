import Link from 'next/link';
import { Tv, Play, FileText, ArrowRight } from 'lucide-react';

interface StremioIPTVCrossLinkProps {
  /** Article category for context-aware recommendations */
  category?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Cross-promotion component for Stremio pages linking to IPTV content.
 * Helps users discover related IPTV players and guides.
 */
export function StremioIPTVCrossLink({
  category,
  className = '',
}: StremioIPTVCrossLinkProps) {
  // Customize recommendations based on category
  const links = getLinksForCategory(category);

  return (
    <section
      className={`p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
        <Tv className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        Looking for IPTV Solutions?
      </h3>

      <div className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm transition group"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
              <link.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {link.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {link.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex-shrink-0 mt-1 transition" />
          </Link>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Stremio works great with IPTV.{' '}
        <Link
          href="/players/stremio"
          className="text-purple-600 dark:text-purple-400 hover:underline"
        >
          Learn more about Stremio
        </Link>
      </p>
    </section>
  );
}

interface CrossLink {
  href: string;
  title: string;
  description: string;
  icon: typeof Tv;
}

function getLinksForCategory(category?: string): CrossLink[] {
  const baseLinks: CrossLink[] = [
    {
      href: '/players',
      title: 'IPTV Players Comparison',
      description: 'Compare the best IPTV players for your device',
      icon: Play,
    },
    {
      href: '/guides/stremio/setup/firestick',
      title: 'Setup Guides',
      description: 'Step-by-step installation guides',
      icon: FileText,
    },
    {
      href: '/legal-iptv',
      title: 'Free M3U Playlists',
      description: 'Legal IPTV streams and channels',
      icon: Tv,
    },
  ];

  // Customize based on category
  if (category === 'addons') {
    return [
      {
        href: '/glossary/xtream-codes',
        title: 'Xtream Codes API',
        description: 'Learn about the Xtream Codes protocol',
        icon: FileText,
      },
      ...baseLinks.slice(0, 2),
    ];
  }

  if (category === 'troubleshooting') {
    return [
      {
        href: '/troubleshooting/players/stremio',
        title: 'Stremio Troubleshooting',
        description: 'Fix common Stremio issues',
        icon: FileText,
      },
      ...baseLinks.slice(0, 2),
    ];
  }

  if (category === 'setup') {
    return [
      {
        href: '/devices',
        title: 'Device Setup Guides',
        description: 'IPTV setup for all devices',
        icon: Tv,
      },
      ...baseLinks.slice(0, 2),
    ];
  }

  return baseLinks;
}
