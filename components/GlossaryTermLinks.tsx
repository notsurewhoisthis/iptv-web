import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { findGlossaryTerms } from '@/lib/glossary-linker';

interface GlossaryTermLinksProps {
  /** Text to search for glossary terms */
  text: string;
  /** Section title (default: "Related IPTV Terms") */
  title?: string;
  /** Maximum number of terms to show (default: 5) */
  limit?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays glossary term links found in the provided text.
 * Useful for adding contextual internal links to glossary pages.
 */
export function GlossaryTermLinks({
  text,
  title = 'Related IPTV Terms',
  limit = 5,
  className = '',
}: GlossaryTermLinksProps) {
  const terms = findGlossaryTerms(text, limit);

  if (terms.length === 0) return null;

  return (
    <section
      className={`p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 ${className}`}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
        <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
            title={t.definition.slice(0, 100) + '...'}
          >
            {t.term.replace(/\s*\([^)]*\)/, '')}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/glossary" className="text-blue-600 dark:text-blue-400 hover:underline">
          View all IPTV terms
        </Link>
      </p>
    </section>
  );
}
