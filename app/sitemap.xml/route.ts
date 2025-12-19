import { NextResponse } from 'next/server';

// Regenerate sitemap every hour (ISR) instead of on every request
export const revalidate = 3600;

import {
  getPlayers,
  getDevices,
  getFeatures,
  getIssues,
  getPlayerDeviceGuides,
  getBlogPosts,
  getBestPlayerDevice,
  getPlayerComparisons,
  getDeviceComparisons,
  getPlayerTroubleshooting,
  getDeviceTroubleshooting,
  getPlayerFeatureGuides,
  getDeviceFeatureGuides,
  getUseCases,
  getTechnicalGuides,
  getStremioArticles,
  getBaseUrl,
} from '@/lib/data-loader';
import learnArticles from '@/data/learn-articles.json';
import { getBlogCategories, getBlogTags } from '@/lib/blog-taxonomy';
import { glossaryTerms } from '@/lib/glossary';

export async function GET() {
  const baseUrl = getBaseUrl();

  // Load all data in parallel
  const [
    players,
    devices,
    features,
    issues,
    guides,
    posts,
    bestFor,
    playerComparisons,
    deviceComparisons,
    playerTroubleshooting,
    deviceTroubleshooting,
    playerFeatureGuides,
    deviceFeatureGuides,
    useCases,
    technicalGuides,
    stremioArticles,
  ] = await Promise.all([
    getPlayers(),
    getDevices(),
    getFeatures(),
    getIssues(),
    getPlayerDeviceGuides(),
    getBlogPosts(),
    getBestPlayerDevice(),
    getPlayerComparisons(),
    getDeviceComparisons(),
    getPlayerTroubleshooting(),
    getDeviceTroubleshooting(),
    getPlayerFeatureGuides(),
    getDeviceFeatureGuides(),
    getUseCases(),
    getTechnicalGuides(),
    getStremioArticles(),
  ]);

  const urls: { url: string; priority: number; changefreq: string; lastmod?: string }[] = [];

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/players', priority: 0.9, changefreq: 'weekly' },
    { url: '/devices', priority: 0.9, changefreq: 'weekly' },
    { url: '/features', priority: 0.85, changefreq: 'weekly' },
    { url: '/issues', priority: 0.85, changefreq: 'weekly' },
    { url: '/guides', priority: 0.9, changefreq: 'weekly' },
    { url: '/learn', priority: 0.9, changefreq: 'weekly' },
    { url: '/troubleshooting', priority: 0.9, changefreq: 'weekly' },
    { url: '/compare', priority: 0.9, changefreq: 'weekly' },
    { url: '/best', priority: 0.9, changefreq: 'weekly' },
    { url: '/use-cases', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.85, changefreq: 'daily' },
    { url: '/glossary', priority: 0.8, changefreq: 'monthly' },
    { url: '/stremio', priority: 0.85, changefreq: 'weekly' },
    { url: '/stremio/basics', priority: 0.75, changefreq: 'weekly' },
    { url: '/stremio/setup', priority: 0.75, changefreq: 'weekly' },
    { url: '/stremio/addons', priority: 0.75, changefreq: 'weekly' },
    { url: '/stremio/troubleshooting', priority: 0.75, changefreq: 'weekly' },
    { url: '/stremio/best-practices', priority: 0.7, changefreq: 'monthly' },
    { url: '/stremio/resources', priority: 0.7, changefreq: 'monthly' },
    // Legal IPTV hub and list pages are noindex; excluded from sitemap.
    { url: '/about', priority: 0.6, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { url: '/terms', priority: 0.3, changefreq: 'yearly' },
  ];

  urls.push(...staticPages);

  // Player pages
  players.forEach((player) => {
    urls.push({
      url: `/players/${player.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: player.lastUpdated,
    });
  });

  // Player alternatives pages
  players.forEach((player) => {
    urls.push({
      url: `/players/${player.slug}/alternatives`,
      priority: 0.7,
      changefreq: 'monthly',
    });
  });

  // Player platform landing pages (only include platforms with 4+ players)
  const platformCounts = new Map<string, number>();
  players.forEach((p) => {
    (p.platforms || []).forEach((platform) => {
      platformCounts.set(platform, (platformCounts.get(platform) || 0) + 1);
    });
  });
  Array.from(platformCounts.entries())
    .filter(([, count]) => count >= 4) // Only platforms with sufficient content
    .forEach(([platform]) => {
      urls.push({
        url: `/players/platform/${platform}`,
        priority: 0.75,
        changefreq: 'monthly',
      });
    });

  // Player pricing landing pages (only include tiers with 4+ players)
  const tierCounts = new Map<string, number>();
  players.forEach((p) => {
    if (p.pricing?.model) {
      tierCounts.set(p.pricing.model, (tierCounts.get(p.pricing.model) || 0) + 1);
    }
  });
  Array.from(tierCounts.entries())
    .filter(([, count]) => count >= 4) // Only tiers with sufficient content
    .forEach(([tier]) => {
      urls.push({
        url: `/players/pricing/${tier}`,
        priority: 0.75,
        changefreq: 'monthly',
      });
    });

  // Device pages
  devices.forEach((device) => {
    urls.push({
      url: `/devices/${device.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
    });
  });

  // Device category landing pages
  Array.from(new Set(devices.map((d) => d.category))).forEach((category) => {
    urls.push({
      url: `/devices/category/${category}`,
      priority: 0.75,
      changefreq: 'monthly',
    });
  });

  // Setup guides (player + device)
  guides.forEach((guide) => {
    urls.push({
      url: `/guides/${guide.playerId}/setup/${guide.deviceId}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Best for pages
  bestFor.forEach((page) => {
    urls.push({
      url: `/best/${page.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: page.lastUpdated,
    });
  });

  // Player comparisons
  playerComparisons.forEach((comp) => {
    urls.push({
      url: `/compare/players/${comp.player1Id}/vs/${comp.player2Id}`,
      priority: 0.75,
      changefreq: 'monthly',
      lastmod: comp.lastUpdated,
    });
  });

  // Device comparisons
  deviceComparisons.forEach((comp) => {
    urls.push({
      url: `/compare/devices/${comp.device1Id}/vs/${comp.device2Id}`,
      priority: 0.75,
      changefreq: 'monthly',
      lastmod: comp.lastUpdated,
    });
  });

  // Player troubleshooting
  playerTroubleshooting.forEach((guide) => {
    urls.push({
      url: `/troubleshooting/players/${guide.playerId}/${guide.issueId}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Device troubleshooting
  deviceTroubleshooting.forEach((guide) => {
    urls.push({
      url: `/troubleshooting/devices/${guide.deviceId}/${guide.issueId}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Player feature guides
  playerFeatureGuides.forEach((guide) => {
    urls.push({
      url: `/guides/${guide.playerId}/features/${guide.featureId}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Device feature guides
  deviceFeatureGuides.forEach((guide) => {
    urls.push({
      url: `/guides/${guide.deviceId}/features/${guide.featureId}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Blog posts
  posts.forEach((post) => {
    urls.push({
      url: `/blog/${post.slug}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: post.updatedAt,
    });
  });

  // Blog tag pages - EXCLUDED (thin content - no unique intro text)
  // Will be re-added after unique content is added to each tag page
  // getBlogTags(posts)
  //   .filter((t) => t.count >= 2)
  //   .forEach((tag) => {
  //     urls.push({
  //       url: `/blog/tag/${tag.slug}`,
  //       priority: 0.6,
  //       changefreq: 'weekly',
  //     });
  //   });

  // Blog category pages - EXCLUDED (thin content - no unique intro text)
  // Will be re-added after unique content is added to each category page
  // getBlogCategories(posts)
  //   .filter((c) => c.count >= 2)
  //   .forEach((cat) => {
  //     urls.push({
  //       url: `/blog/category/${cat.slug}`,
  //       priority: 0.6,
  //       changefreq: 'weekly',
  //     });
  //   });

  // Feature pages
  features.forEach((feature) => {
    urls.push({
      url: `/features/${feature.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    });
  });

  // Glossary term pages - EXCLUDED (thin content - only 80-100 unique words each)
  // Will be re-added after content is expanded to 300-500 words per term
  // glossaryTerms.forEach((term) => {
  //   urls.push({
  //     url: `/glossary/${term.slug}`,
  //     priority: 0.5,
  //     changefreq: 'yearly',
  //   });
  // });

  // Issue pages
  issues.forEach((issue) => {
    urls.push({
      url: `/issues/${issue.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    });
  });

  // Learn articles
  learnArticles.forEach((article) => {
    urls.push({
      url: `/learn/${article.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: article.lastUpdated,
    });
  });

  // Stremio knowledge base articles
  stremioArticles.forEach((article) => {
    urls.push({
      url: `/stremio/${article.slug}`,
      priority: 0.7,
      changefreq: 'monthly',
      lastmod: article.lastUpdated,
    });
  });

  // Legal IPTV detail pages - EXCLUDED (doorway pages with noindex)
  // These 427 pages have identical boilerplate content and are now noindexed
  // to address Google's spam policy. The index pages remain in staticPages above.

  // Use case pages
  useCases.forEach((useCase) => {
    urls.push({
      url: `/use-cases/${useCase.slug}`,
      priority: 0.7,
      changefreq: 'monthly',
    });
  });

  // Technical guides
  technicalGuides.forEach((guide) => {
    urls.push({
      url: `/guides/technical/${guide.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: guide.lastUpdated,
    });
  });

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <priority>${item.priority}</priority>
    <changefreq>${item.changefreq}</changefreq>
    ${item.lastmod ? `<lastmod>${item.lastmod.split('T')[0]}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
