import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getDeviceComparisons,
  getDeviceComparison,
  getDevice,
  getBaseUrl,
} from '@/lib/data-loader';
import { ChevronRight, Check, X, Star } from 'lucide-react';
import { BreadcrumbSchema, ComparisonSchema, FAQSchema } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ device1: string; device2: string }>;
}

export async function generateStaticParams() {
  const comparisons = await getDeviceComparisons();
  return comparisons.map((c) => ({
    device1: c.device1Id,
    device2: c.device2Id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { device1, device2 } = await params;
  const comparison = await getDeviceComparison(device1, device2);

  if (!comparison) {
    return { title: 'Comparison Not Found' };
  }

  const baseUrl = getBaseUrl();

  return {
    title: comparison.metaTitle,
    description: comparison.description,
    keywords: comparison.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}/compare/devices/${device1}/vs/${device2}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: comparison.metaTitle,
      description: comparison.description,
    },
  };
}

export default async function DeviceComparisonPage({ params }: PageProps) {
  const { device1: device1Id, device2: device2Id } = await params;
  const comparison = await getDeviceComparison(device1Id, device2Id);

  if (!comparison) {
    notFound();
  }

  const [device1, device2] = await Promise.all([
    getDevice(comparison.device1Id),
    getDevice(comparison.device2Id),
  ]);

  // Extract winner from verdict string
  const verdictText = comparison.content.verdict || '';
  const winner = verdictText.toLowerCase().includes(comparison.device1ShortName.toLowerCase())
                   ? comparison.device1ShortName
                   : verdictText.toLowerCase().includes(comparison.device2ShortName.toLowerCase())
                     ? comparison.device2ShortName
                     : comparison.device1ShortName;

  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Compare', url: `${baseUrl}/compare` },
          { name: `${comparison.device1ShortName} vs ${comparison.device2ShortName}`, url: `${baseUrl}/compare/devices/${device1Id}/vs/${device2Id}` },
        ]}
      />
      <ComparisonSchema
        title={comparison.title}
        description={comparison.description}
        item1={{ name: comparison.device1Name }}
        item2={{ name: comparison.device2Name }}
        url={`${baseUrl}/compare/devices/${device1Id}/vs/${device2Id}`}
        dateModified={new Date().toISOString().split('T')[0]}
      />
      {comparison.content.faqs && comparison.content.faqs.length > 0 && (
        <FAQSchema faqs={comparison.content.faqs} />
      )}

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <li>
              <Link href="/" className="hover:text-gray-900">Home</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/compare" className="hover:text-gray-900">Compare</Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">
              {comparison.device1ShortName} vs {comparison.device2ShortName}
            </li>
          </ol>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {comparison.title}
          </h1>
          <p className="text-lg text-gray-600">{comparison.description}</p>
        </header>

        {/* Winner Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-lg ${winner === comparison.device1ShortName || winner === comparison.device1Name ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
            <div className="text-center">
              {(winner === comparison.device1ShortName || winner === comparison.device1Name) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
                  <Star className="h-3 w-3" /> WINNER
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{comparison.device1ShortName}</h2>
              {device1 && (
                <>
                  <p className="text-sm text-gray-500 mt-1">{device1.pricing}</p>
                  <p className="text-xs text-gray-400">{device1.os}</p>
                  <Link
                    href={`/devices/${device1.slug}`}
                    className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Review →
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className={`p-6 rounded-lg ${winner === comparison.device2ShortName || winner === comparison.device2Name ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
            <div className="text-center">
              {(winner === comparison.device2ShortName || winner === comparison.device2Name) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
                  <Star className="h-3 w-3" /> WINNER
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{comparison.device2ShortName}</h2>
              {device2 && (
                <>
                  <p className="text-sm text-gray-500 mt-1">{device2.pricing}</p>
                  <p className="text-xs text-gray-400">{device2.os}</p>
                  <Link
                    href={`/devices/${device2.slug}`}
                    className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Full Review →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{comparison.content.intro}</p>
        </section>

        {/* Pros and Cons */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{comparison.device1ShortName}</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {comparison.content.device1Summary.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {comparison.content.device1Summary.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{comparison.device2ShortName}</h3>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {comparison.content.device2Summary.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {comparison.content.device2Summary.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Verdict</h2>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900">Winner: {winner}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{comparison.content.verdict || 'Both devices have their strengths depending on your specific needs.'}</p>
          </div>
        </section>

        {/* FAQs */}
        {comparison.content.faqs && comparison.content.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {comparison.content.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/compare"
            className="text-gray-600 hover:text-gray-900"
          >
            ← All Comparisons
          </Link>
        </footer>
      </article>
    </div>
  );
}
