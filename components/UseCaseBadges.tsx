import Link from 'next/link';
import { Trophy, Target } from 'lucide-react';
import { getUseCases } from '@/lib/data-loader';
import type { UseCasePage } from '@/lib/types';

interface UseCaseMatch {
  slug: string;
  title: string;
  rank: number;
  bestFor: string;
}

interface UseCaseBadgesProps {
  /** Player ID to find use cases for */
  playerId: string;
  /** Section title (default: "Best For") */
  title?: string;
  /** Maximum number of use cases to show (default: 4) */
  limit?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Finds use cases where a player is ranked and returns them as badges.
 * Server component that fetches use case data.
 */
export async function UseCaseBadges({
  playerId,
  title = 'Best For',
  limit = 4,
  className = '',
}: UseCaseBadgesProps) {
  const useCases = await getUseCases();

  // Find use cases where this player is ranked
  const matches: UseCaseMatch[] = useCases
    .map((uc: UseCasePage) => {
      const ranking = uc.rankings.find((r) => r.playerId === playerId);
      if (!ranking) return null;
      return {
        slug: uc.slug,
        title: uc.title,
        rank: ranking.rank,
        bestFor: ranking.bestFor,
      };
    })
    .filter((m): m is UseCaseMatch => m !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);

  if (matches.length === 0) return null;

  return (
    <section
      className={`p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
        <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {matches.map((m) => (
          <Link
            key={m.slug}
            href={`/use-cases/${m.slug}`}
            className="group inline-flex items-center gap-2 text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700 transition"
            title={m.bestFor}
          >
            {m.rank <= 3 && (
              <Trophy
                className={`h-3.5 w-3.5 ${
                  m.rank === 1
                    ? 'text-yellow-500'
                    : m.rank === 2
                      ? 'text-gray-400'
                      : 'text-amber-600'
                }`}
                aria-label={`Ranked #${m.rank}`}
              />
            )}
            <span className="group-hover:text-amber-800 dark:group-hover:text-amber-300">
              {m.title.replace(/^Best\s+/i, '').replace(/\s+Players?$/i, '')}
            </span>
            <span className="text-gray-400 dark:text-gray-500">#{m.rank}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/use-cases" className="text-amber-600 dark:text-amber-400 hover:underline">
          View all IPTV use cases
        </Link>
      </p>
    </section>
  );
}
