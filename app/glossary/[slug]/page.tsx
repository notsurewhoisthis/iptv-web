import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { glossaryTerms } from '@/lib/glossary';
import type { GlossaryTerm } from '@/lib/glossary';
import { BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { QuickAnswer, EnhancedAuthorBio, LastUpdated } from '@/components/GeoComponents';
import { getBaseUrl } from '@/lib/data-loader';
import { ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return glossaryTerms.map((t) => ({ slug: t.slug }));
}

function getTerm(slug: string): GlossaryTerm | null {
  return glossaryTerms.find((t) => t.slug === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTerm(slug);

  if (!term) {
    return { title: 'Term Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: `${term.term} Meaning in IPTV - Definition & Guide`,
    description: `Learn what ${term.term} means in IPTV, why it matters, and how it impacts your streaming setup.`,
    keywords: [
      `${term.term.toLowerCase()} meaning`,
      `what is ${term.term.toLowerCase()}`,
      `${term.term.toLowerCase()} iptv`,
      'iptv glossary',
      'iptv terms',
    ].join(', '),
    alternates: {
      canonical: `${baseUrl}/glossary/${term.slug}`,
    },
    openGraph: {
      title: `${term.term} Meaning in IPTV`,
      description: term.definition,
      type: 'article',
      url: `${baseUrl}/glossary/${term.slug}`,
    },
    twitter: {
      card: 'summary',
      title: `${term.term} Meaning`,
      description: term.definition,
    },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTerm(slug);

  if (!term) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  const related = (term.relatedTerms || [])
    .map((name) =>
      glossaryTerms.find((t) =>
        t.term.toLowerCase().includes(name.toLowerCase())
      )
    )
    .filter(Boolean) as GlossaryTerm[];

  const faqItems = [
    {
      question: `What does ${term.term} mean in IPTV?`,
      answer: term.definition,
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Glossary', url: `${baseUrl}/glossary` },
          { name: term.term, url: `${baseUrl}/glossary/${term.slug}` },
        ]}
      />
      <FAQSchema faqs={faqItems} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/glossary" className="hover:text-gray-900">Glossary</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium truncate">{term.term}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-7 w-7 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {term.term}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            IPTV glossary definition and practical context.
          </p>
          <LastUpdated date={new Date().toISOString()} />
        </header>

        <QuickAnswer
          question={`What is ${term.term}?`}
          answer={term.definition}
        />

        <section className="mt-8 prose prose-lg max-w-none">
          <p>{term.definition}</p>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Related terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition"
                >
                  {r.term}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 p-5 bg-gray-50 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Next steps
          </h2>
          <p className="text-gray-600 mb-3">
            See how this term applies in real setups and player reviews.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/players"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Browse Players
            </Link>
            <Link
              href="/guides"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition text-sm"
            >
              Setup Guides
            </Link>
          </div>
        </div>

        <EnhancedAuthorBio
          name="IPTV Guide Team"
          title="IPTV & Streaming Specialists"
          expertise={[
            'IPTV terminology and protocols',
            'Playlist and EPG analysis',
            'Hands‑on player testing',
          ]}
          bio="We maintain this glossary alongside our setup guides and app reviews to keep terms accurate and practical."
          yearsExperience={6}
          articlesWritten={900}
        />
      </div>
    </div>
  );
}

