import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { getBaseUrl } from '@/lib/data-loader';
import { glossaryTerms } from '@/lib/glossary';
import type { GlossaryTerm } from '@/lib/glossary';

export const metadata: Metadata = {
  title: 'IPTV Glossary - Terms & Definitions Explained',
  description:
    'Complete glossary of IPTV terminology. Learn what EPG, M3U, catchup, VOD, and other streaming terms mean with clear explanations.',
  keywords:
    'IPTV glossary, IPTV terms, EPG meaning, M3U playlist, IPTV definitions, streaming terminology, Xtream Codes, catchup TV',
};

// Sort terms alphabetically
const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.term.localeCompare(b.term)
);

// Group terms by first letter
const groupedTerms = sortedTerms.reduce(
  (acc, term) => {
    const firstChar = term.term[0].toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  },
  {} as Record<string, GlossaryTerm[]>
);

const letters = Object.keys(groupedTerms).sort();

export default function GlossaryPage() {
  const baseUrl = getBaseUrl();

  // Convert glossary terms to FAQ format for schema
  const faqItems = sortedTerms.slice(0, 20).map((term) => ({
    question: `What does ${term.term} mean in IPTV?`,
    answer: term.definition,
  }));

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Glossary', url: `${baseUrl}/glossary` },
        ]}
      />
      <FAQSchema faqs={faqItems} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">Glossary</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Glossary
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Understanding IPTV terminology can be confusing. This glossary
            explains common terms you will encounter when setting up and using
            IPTV players.
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Jump to Letter
          </h2>
          <div className="flex flex-wrap gap-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
              >
                {letter}
              </a>
            ))}
          </div>
        </nav>

        {/* Terms */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                {letter}
              </h2>
              <dl className="space-y-6">
                {groupedTerms[letter].map((item) => (
                  <div
                    key={item.slug}
                    id={item.slug}
                    className="scroll-mt-20"
                  >
                    <dt className="text-lg font-semibold text-gray-900 mb-2">
                      <Link
                        href={`/glossary/${item.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.term}
                      </Link>
                    </dt>
                    <dd className="text-gray-700 leading-relaxed">
                      {item.definition}
                    </dd>
                    {item.relatedTerms && item.relatedTerms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Related:</span>
                        {item.relatedTerms.map((related) => {
                          const relatedSlug = glossaryTerms.find((t) =>
                            t.term.toLowerCase().includes(related.toLowerCase())
                          )?.slug;
                          return relatedSlug ? (
                            <Link
                              key={related}
                              href={`/glossary/${relatedSlug}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {related}
                            </Link>
                          ) : (
                            <span key={related} className="text-sm text-blue-600">
                              {related}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-4">
            Now that you understand the terminology, explore our player reviews
            and setup guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/players"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Players
            </Link>
            <Link
              href="/guides"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition"
            >
              View Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
