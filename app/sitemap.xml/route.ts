import { NextResponse } from 'next/server';
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
  getBaseUrl,
} from '@/lib/data-loader';
import learnArticles from '@/data/learn-articles.json';

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
  ]);

  const urls: { url: string; priority: number; changefreq: string; lastmod?: string }[] = [];

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/players', priority: 0.9, changefreq: 'weekly' },
    { url: '/devices', priority: 0.9, changefreq: 'weekly' },
    { url: '/guides', priority: 0.9, changefreq: 'weekly' },
    { url: '/learn', priority: 0.9, changefreq: 'weekly' },
    { url: '/troubleshooting', priority: 0.9, changefreq: 'weekly' },
    { url: '/compare', priority: 0.9, changefreq: 'weekly' },
    { url: '/best', priority: 0.9, changefreq: 'weekly' },
    { url: '/use-cases', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.85, changefreq: 'daily' },
    { url: '/glossary', priority: 0.8, changefreq: 'monthly' },
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

  // Device pages
  devices.forEach((device) => {
    urls.push({
      url: `/devices/${device.slug}`,
      priority: 0.8,
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

  // Feature pages
  features.forEach((feature) => {
    urls.push({
      url: `/features/${feature.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    });
  });

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
      url: `/technical/${guide.slug}`,
      priority: 0.6,
      changefreq: 'monthly',
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
