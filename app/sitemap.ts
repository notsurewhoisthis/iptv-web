import type { MetadataRoute } from 'next';
import {
  getPlayers,
  getDevices,
  getFeatures,
  getIssues,
  getPlayerDeviceGuides,
  getPlayerFeatureGuides,
  getDeviceFeatureGuides,
  getPlayerTroubleshooting,
  getDeviceTroubleshooting,
  getPlayerComparisons,
  getDeviceComparisons,
  getBestPlayerDevice,
  getUseCases,
  getTechnicalGuides,
  getBlogPosts,
} from '@/lib/data-loader';
import learnArticles from '@/data/learn-articles.json';

// Force dynamic rendering so env vars are read at runtime
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://localhost:3000';

  // Load all data in parallel
  const [
    players,
    devices,
    features,
    issues,
    playerDeviceGuides,
    playerFeatureGuides,
    deviceFeatureGuides,
    playerTroubleshooting,
    deviceTroubleshooting,
    playerComparisons,
    deviceComparisons,
    bestPages,
    useCases,
    technicalGuides,
    blogPosts,
  ] = await Promise.all([
    getPlayers(),
    getDevices(),
    getFeatures(),
    getIssues(),
    getPlayerDeviceGuides(),
    getPlayerFeatureGuides(),
    getDeviceFeatureGuides(),
    getPlayerTroubleshooting(),
    getDeviceTroubleshooting(),
    getPlayerComparisons(),
    getDeviceComparisons(),
    getBestPlayerDevice(),
    getUseCases(),
    getTechnicalGuides(),
    getBlogPosts(),
  ]);

  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/devices`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/troubleshooting`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Player pages
  const playerPages: MetadataRoute.Sitemap = players.map((player) => ({
    url: `${baseUrl}/players/${player.slug}`,
    lastModified: player.lastUpdated || now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Player alternatives pages (new!)
  const playerAlternativesPages: MetadataRoute.Sitemap = players.map((player) => ({
    url: `${baseUrl}/players/${player.slug}/alternatives`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Device pages
  const devicePages: MetadataRoute.Sitemap = devices.map((device) => ({
    url: `${baseUrl}/devices/${device.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Feature pages
  const featurePages: MetadataRoute.Sitemap = features.map((feature) => ({
    url: `${baseUrl}/features/${feature.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Issue pages
  const issuePages: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${baseUrl}/issues/${issue.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Player-device setup guides
  const setupGuidePages: MetadataRoute.Sitemap = playerDeviceGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.playerId}/setup/${guide.deviceId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Player feature guides
  const playerFeaturePages: MetadataRoute.Sitemap = playerFeatureGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.playerId}/features/${guide.featureId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Device feature guides
  const deviceFeaturePages: MetadataRoute.Sitemap = deviceFeatureGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.deviceId}/features/${guide.featureId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Player troubleshooting guides
  const playerTroubleshootingPages: MetadataRoute.Sitemap = playerTroubleshooting.map((guide) => ({
    url: `${baseUrl}/troubleshooting/${guide.playerId}/${guide.issueId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Device troubleshooting guides
  const deviceTroubleshootingPages: MetadataRoute.Sitemap = deviceTroubleshooting.map((guide) => ({
    url: `${baseUrl}/troubleshooting/${guide.deviceId}/${guide.issueId}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Player comparisons
  const playerComparisonPages: MetadataRoute.Sitemap = playerComparisons.map((comp) => ({
    url: `${baseUrl}/compare/players/${comp.player1Id}/vs/${comp.player2Id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Device comparisons
  const deviceComparisonPages: MetadataRoute.Sitemap = deviceComparisons.map((comp) => ({
    url: `${baseUrl}/compare/devices/${comp.device1Id}/vs/${comp.device2Id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Best-for pages
  const bestForPages: MetadataRoute.Sitemap = bestPages.map((page) => ({
    url: `${baseUrl}/best/${page.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Use case pages
  const useCasePages: MetadataRoute.Sitemap = useCases.map((page) => ({
    url: `${baseUrl}/use-cases/${page.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Technical guide pages
  const technicalGuidePages: MetadataRoute.Sitemap = technicalGuides.map((guide) => ({
    url: `${baseUrl}/technical/${guide.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Learn article pages
  const learnPages: MetadataRoute.Sitemap = learnArticles.map((article) => ({
    url: `${baseUrl}/learn/${article.slug}`,
    lastModified: article.lastUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...playerPages,
    ...playerAlternativesPages,
    ...devicePages,
    ...featurePages,
    ...issuePages,
    ...setupGuidePages,
    ...playerFeaturePages,
    ...deviceFeaturePages,
    ...playerTroubleshootingPages,
    ...deviceTroubleshootingPages,
    ...playerComparisonPages,
    ...deviceComparisonPages,
    ...bestForPages,
    ...useCasePages,
    ...technicalGuidePages,
    ...blogPages,
    ...learnPages,
  ];
}
