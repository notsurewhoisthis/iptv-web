import fs from 'fs/promises';
import path from 'path';
import type {
  Player,
  Device,
  Feature,
  Issue,
  PlayerDeviceGuide,
  PlayerFeatureGuide,
  DeviceFeatureGuide,
  PlayerTroubleshootingGuide,
  DeviceTroubleshootingGuide,
  PlayerComparison,
  DeviceComparison,
  BestForPage,
  BlogPost,
  UseCasePage,
  TechnicalGuide,
  BenchmarkData,
  PlayerBenchmark,
  VideoData,
  VideoMappings,
  StremioArticle,
  LegalIptvData,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_DIR = path.join(process.cwd(), 'public', 'blog-data');

// Cache for data to avoid repeated file reads
const cache: Record<string, unknown> = {};

async function loadJSON<T>(filename: string): Promise<T> {
  const cacheKey = filename;
  if (cache[cacheKey]) {
    return cache[cacheKey] as T;
  }

  const filePath = path.join(DATA_DIR, filename);
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content) as T;
  cache[cacheKey] = data;
  return data;
}

// Master data loaders
export async function getPlayers(): Promise<Player[]> {
  return loadJSON<Player[]>('players.json');
}

export async function getDevices(): Promise<Device[]> {
  return loadJSON<Device[]>('devices.json');
}

export async function getFeatures(): Promise<Feature[]> {
  return loadJSON<Feature[]>('features.json');
}

export async function getIssues(): Promise<Issue[]> {
  return loadJSON<Issue[]>('issues.json');
}

// Individual item loaders
export async function getPlayer(id: string): Promise<Player | null> {
  const players = await getPlayers();
  return players.find((p) => p.id === id || p.slug === id) || null;
}

export async function getDevice(id: string): Promise<Device | null> {
  const devices = await getDevices();
  return devices.find((d) => d.id === id || d.slug === id) || null;
}

export async function getFeature(id: string): Promise<Feature | null> {
  const features = await getFeatures();
  return features.find((f) => f.id === id || f.slug === id) || null;
}

export async function getIssue(id: string): Promise<Issue | null> {
  const issues = await getIssues();
  return issues.find((i) => i.id === id || i.slug === id) || null;
}

// Generated data loaders
export async function getPlayerDeviceGuides(): Promise<PlayerDeviceGuide[]> {
  return loadJSON<PlayerDeviceGuide[]>('player-device-guides.json');
}

export async function getPlayerDeviceGuide(
  player: string,
  device: string
): Promise<PlayerDeviceGuide | null> {
  const guides = await getPlayerDeviceGuides();
  return (
    guides.find((g) => g.playerId === player && g.deviceId === device) || null
  );
}

export async function getPlayerFeatureGuides(): Promise<PlayerFeatureGuide[]> {
  return loadJSON<PlayerFeatureGuide[]>('player-feature-guides.json');
}

export async function getPlayerFeatureGuide(
  player: string,
  feature: string
): Promise<PlayerFeatureGuide | null> {
  const guides = await getPlayerFeatureGuides();
  return guides.find((g) => g.playerId === player && g.featureId === feature) || null;
}

export async function getDeviceFeatureGuides(): Promise<DeviceFeatureGuide[]> {
  return loadJSON<DeviceFeatureGuide[]>('device-feature-guides.json');
}

export async function getDeviceFeatureGuide(
  device: string,
  feature: string
): Promise<DeviceFeatureGuide | null> {
  const guides = await getDeviceFeatureGuides();
  return guides.find((g) => g.deviceId === device && g.featureId === feature) || null;
}

export async function getPlayerTroubleshooting(): Promise<PlayerTroubleshootingGuide[]> {
  return loadJSON<PlayerTroubleshootingGuide[]>('player-troubleshooting.json');
}

export async function getDeviceTroubleshooting(): Promise<DeviceTroubleshootingGuide[]> {
  return loadJSON<DeviceTroubleshootingGuide[]>('device-troubleshooting.json');
}

export async function getPlayerTroubleshootingGuide(
  playerId: string,
  issueId: string
): Promise<PlayerTroubleshootingGuide | null> {
  const guides = await getPlayerTroubleshooting();
  return guides.find((g) => g.playerId === playerId && g.issueId === issueId) || null;
}

export async function getDeviceTroubleshootingGuide(
  deviceId: string,
  issueId: string
): Promise<DeviceTroubleshootingGuide | null> {
  const guides = await getDeviceTroubleshooting();
  return guides.find((g) => g.deviceId === deviceId && g.issueId === issueId) || null;
}

export async function getPlayerComparisons(): Promise<PlayerComparison[]> {
  return loadJSON<PlayerComparison[]>('player-comparisons.json');
}

export async function getDeviceComparisons(): Promise<DeviceComparison[]> {
  return loadJSON<DeviceComparison[]>('device-comparisons.json');
}

export async function getPlayerComparison(
  player1Id: string,
  player2Id: string
): Promise<PlayerComparison | null> {
  const comparisons = await getPlayerComparisons();
  return comparisons.find(
    (c) => (c.player1Id === player1Id && c.player2Id === player2Id) ||
           (c.player1Id === player2Id && c.player2Id === player1Id)
  ) || null;
}

export async function getDeviceComparison(
  device1Id: string,
  device2Id: string
): Promise<DeviceComparison | null> {
  const comparisons = await getDeviceComparisons();
  return comparisons.find(
    (c) => (c.device1Id === device1Id && c.device2Id === device2Id) ||
           (c.device1Id === device2Id && c.device2Id === device1Id)
  ) || null;
}

export async function getBestPlayerDevice(): Promise<BestForPage[]> {
  return loadJSON<BestForPage[]>('best-player-device.json');
}

export async function getBestForPage(slug: string): Promise<BestForPage | null> {
  const pages = await getBestPlayerDevice();
  return pages.find((p) => p.slug === slug) || null;
}

// Use-case pages (GEO-optimized)
export async function getUseCases(): Promise<UseCasePage[]> {
  return loadJSON<UseCasePage[]>('use-cases.json');
}

export async function getUseCase(slug: string): Promise<UseCasePage | null> {
  const pages = await getUseCases();
  return pages.find((p) => p.slug === slug) || null;
}

// Technical guides (troubleshooting, setup)
export async function getTechnicalGuides(): Promise<TechnicalGuide[]> {
  return loadJSON<TechnicalGuide[]>('technical-guides.json');
}

export async function getTechnicalGuide(slug: string): Promise<TechnicalGuide | null> {
  const guides = await getTechnicalGuides();
  return guides.find((g) => g.slug === slug) || null;
}

// Stremio knowledge base (programmatic articles)
export async function getStremioArticles(): Promise<StremioArticle[]> {
  return loadJSON<StremioArticle[]>('stremio-articles.json');
}

export async function getStremioArticle(slug: string): Promise<StremioArticle | null> {
  const articles = await getStremioArticles();
  return articles.find((a) => a.slug === slug) || null;
}

// Legal IPTV playlists (iptv-org/iptv derived)
export async function getLegalIptvData(): Promise<LegalIptvData> {
  return loadJSON<LegalIptvData>('legal-iptv.json');
}

// Blog data loaders
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    const posts = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8');
        return JSON.parse(content) as BlogPost;
      })
    );

    // Sort by date, newest first
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as BlogPost;
  } catch {
    return null;
  }
}

// Benchmark data loaders
export async function getBenchmarkData(): Promise<BenchmarkData> {
  return loadJSON<BenchmarkData>('benchmarks.json');
}

export async function getPlayerBenchmark(playerId: string): Promise<PlayerBenchmark | null> {
  const data = await getBenchmarkData();
  return data.playerBenchmarks.find((b) => b.playerId === playerId) || null;
}

export async function getPlayerBenchmarks(): Promise<PlayerBenchmark[]> {
  const data = await getBenchmarkData();
  return data.playerBenchmarks;
}

// Video mappings loaders
export async function getVideoMappings(): Promise<VideoMappings> {
  return loadJSON<VideoMappings>('video-mappings.json');
}

export async function getVideoForPage(
  pageType: keyof VideoMappings,
  pageKey: string
): Promise<VideoData | null> {
  try {
    const mappings = await getVideoMappings();
    return mappings[pageType]?.[pageKey] || null;
  } catch {
    return null;
  }
}

export async function getSetupGuideVideo(
  playerId: string,
  deviceId: string
): Promise<VideoData | null> {
  return getVideoForPage('setup-guides', `${playerId}-${deviceId}`);
}

export async function getTroubleshootingVideo(
  entityType: 'players' | 'devices',
  entityId: string,
  issueId: string
): Promise<VideoData | null> {
  return getVideoForPage('troubleshooting', `${entityType}-${entityId}-${issueId}`);
}

// Utility functions
export function getBaseUrl(): string {
  // SITE_URL is for server-side routes (read at runtime)
  // NEXT_PUBLIC_URL is for client-side (baked in at build time)
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://localhost:3000';
}
