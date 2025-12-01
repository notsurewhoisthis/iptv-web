import Link from 'next/link';
import { ArrowRight, BookOpen, Tv, Settings, FileText, HelpCircle, Star } from 'lucide-react';

interface RelatedItem {
  title: string;
  description?: string;
  href: string;
  type: 'guide' | 'player' | 'device' | 'comparison' | 'troubleshooting' | 'article' | 'learn';
  meta?: string;
}

const typeConfig = {
  guide: { icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  player: { icon: Tv, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  device: { icon: Settings, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  comparison: { icon: Star, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  troubleshooting: { icon: HelpCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  article: { icon: FileText, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' },
  learn: { icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  columns?: 2 | 3;
}

export function RelatedContent({ title = 'Related Content', items, columns = 2 }: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      <div className={`grid gap-4 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {items.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition"
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {item.meta && (
                  <span className="inline-block text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {item.meta}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex-shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Compact related links for sidebar or inline use
interface RelatedLinksProps {
  title?: string;
  links: Array<{ title: string; href: string }>;
}

export function RelatedLinks({ title = 'See Also', links }: RelatedLinksProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-2"
            >
              <ArrowRight className="h-3 w-3" />
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// "You might also like" section
interface YouMightAlsoLikeProps {
  items: Array<{
    title: string;
    href: string;
    category: string;
  }>;
}

export function YouMightAlsoLike({ items }: YouMightAlsoLikeProps) {
  return (
    <section className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">You might also like</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block group"
          >
            <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
              {item.category}
            </span>
            <p className="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition font-medium">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Cross-promotion banner
interface CrossPromoBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  variant?: 'default' | 'highlight';
}

export function CrossPromoBanner({
  title,
  description,
  ctaText,
  ctaHref,
  variant = 'default',
}: CrossPromoBannerProps) {
  const isHighlight = variant === 'highlight';

  return (
    <div
      className={`rounded-xl p-6 mb-8 ${
        isHighlight
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800'
      }`}
    >
      <h3
        className={`font-bold text-lg mb-2 ${
          isHighlight ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-sm mb-4 ${
          isHighlight ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {description}
      </p>
      <Link
        href={ctaHref}
        className={`inline-flex items-center gap-2 text-sm font-medium ${
          isHighlight
            ? 'text-white hover:text-blue-100'
            : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
        }`}
      >
        {ctaText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
