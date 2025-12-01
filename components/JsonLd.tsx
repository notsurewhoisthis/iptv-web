import { FAQ } from '@/lib/types';

// FAQ Schema
export function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// HowTo Schema for setup guides
export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { title: string; description: string }[];
  totalTime?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime: totalTime || 'PT15M',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema
export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  baseUrl,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author?: string;
  baseUrl?: string;
}) {
  const siteUrl = baseUrl || url.split('/').slice(0, 3).join('/');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: author || 'IPTV Guide',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPTV Guide',
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Software Application Schema for players
export function SoftwareApplicationSchema({
  name,
  description,
  rating,
  ratingCount,
  price,
  priceCurrency,
  operatingSystem,
  url,
}: {
  name: string;
  description: string;
  rating: number;
  ratingCount?: number;
  price: string;
  priceCurrency?: string;
  operatingSystem: string[];
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: operatingSystem.join(', '),
    url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: ratingCount || 100,
    },
    offers: {
      '@type': 'Offer',
      price: price === 'Free' ? '0' : price.replace(/[^0-9.]/g, ''),
      priceCurrency: priceCurrency || 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema for devices
export function ProductSchema({
  name,
  description,
  brand,
  price,
  url,
}: {
  name: string;
  description: string;
  brand: string;
  price: string;
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    url,
    offers: {
      '@type': 'Offer',
      price: price.replace(/[^0-9.]/g, '') || '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Comparison Schema
export function ComparisonSchema({
  title,
  description,
  item1,
  item2,
  url,
  dateModified,
}: {
  title: string;
  description: string;
  item1: { name: string; rating?: number };
  item2: { name: string; rating?: number };
  url: string;
  dateModified: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    dateModified,
    articleSection: 'Comparison',
    about: [
      { '@type': 'Thing', name: item1.name },
      { '@type': 'Thing', name: item2.name },
    ],
    author: {
      '@type': 'Organization',
      name: 'IPTV Guide',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema for homepage
export function WebsiteSchema({ baseUrl }: { baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IPTV Guide',
    url: baseUrl,
    description: 'Comprehensive IPTV guides, player reviews, setup tutorials, and troubleshooting for all devices.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Organization Schema
export function OrganizationSchema({ baseUrl }: { baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IPTV Guide',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ItemList Schema for "Best of" pages - helps AI systems understand rankings
export function ItemListSchema({
  name,
  description,
  items,
  url,
}: {
  name: string;
  description: string;
  items: { name: string; position: number; url: string; rating?: number }[];
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.rating && {
        item: {
          '@type': 'SoftwareApplication',
          name: item.name,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: item.rating,
            bestRating: 5,
          },
        },
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema with Author for GEO E-E-A-T signals
export function ArticleWithAuthorSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  authorExpertise,
  baseUrl,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
  authorExpertise?: string;
  baseUrl?: string;
}) {
  const siteUrl = baseUrl || url.split('/').slice(0, 3).join('/');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl || `${siteUrl}/about`,
      ...(authorExpertise && { jobTitle: authorExpertise }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPTV Guide',
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
