import {
  getPlayers,
  getDevices,
  getBlogPosts,
  getPlayerDeviceGuides,
  getStremioArticles,
  getLegalIptvData,
} from '@/lib/data-loader';
import { Search } from './Search';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'player' | 'device' | 'guide' | 'blog' | 'stremio' | 'legal';
  keywords?: string[];
}

export async function SearchWrapper() {
  // Load all data for search index
  const [players, devices, blogPosts, guides, stremioArticles, legalIptvData] = await Promise.all([
    getPlayers(),
    getDevices(),
    getBlogPosts(),
    getPlayerDeviceGuides(),
    getStremioArticles(),
    getLegalIptvData(),
  ]);

  // Build search index
  const searchItems: SearchItem[] = [
    // Players
    ...players.map((player) => ({
      id: `player-${player.id}`,
      title: player.name,
      description: player.shortDescription,
      url: `/players/${player.slug}`,
      type: 'player' as const,
      keywords: player.keywords,
    })),
    // Devices
    ...devices.map((device) => ({
      id: `device-${device.id}`,
      title: device.name,
      description: device.shortDescription,
      url: `/devices/${device.slug}`,
      type: 'device' as const,
      keywords: device.keywords,
    })),
    // Blog posts
    ...blogPosts.map((post) => ({
      id: `blog-${post.slug}`,
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'blog' as const,
      keywords: post.keywords,
    })),
    // Stremio knowledge base
    ...stremioArticles.map((article) => ({
      id: `stremio-${article.slug}`,
      title: article.title,
      description: article.description,
      url: `/stremio/${article.slug}`,
      type: 'stremio' as const,
      keywords: article.keywords,
    })),
    // Legal IPTV hubs (avoid indexing every country/language for payload size)
    {
      id: 'legal-iptv-hub',
      title: 'Legal IPTV Playlists',
      description: 'Browse public, legal IPTV playlists by category, country, language, and FAST services.',
      url: '/legal-iptv',
      type: 'legal' as const,
      keywords: ['legal iptv', 'public iptv', 'm3u', 'fast channels', 'playlists'],
    },
    {
      id: 'legal-iptv-categories',
      title: 'Legal IPTV by Category',
      description: 'Find public playlists grouped by content category.',
      url: '/legal-iptv/categories',
      type: 'legal' as const,
      keywords: ['legal iptv', 'categories', 'm3u', 'public playlists'],
    },
    {
      id: 'legal-iptv-countries',
      title: 'Legal IPTV by Country',
      description: 'Browse public playlists by country code.',
      url: '/legal-iptv/countries',
      type: 'legal' as const,
      keywords: ['legal iptv', 'countries', 'm3u', 'public playlists'],
    },
    {
      id: 'legal-iptv-languages',
      title: 'Legal IPTV by Language',
      description: 'Browse public playlists by language.',
      url: '/legal-iptv/languages',
      type: 'legal' as const,
      keywords: ['legal iptv', 'languages', 'm3u', 'public playlists'],
    },
    {
      id: 'legal-iptv-fast',
      title: 'FAST Services (Legal)',
      description: 'Official free ad-supported streaming TV services and their public playlists.',
      url: '/legal-iptv/fast',
      type: 'legal' as const,
      keywords: ['fast', 'free streaming tv', 'legal iptv', 'public playlists'],
    },
    // Legal IPTV categories (small list; safe to index)
    ...(legalIptvData.categories || []).map((c) => ({
      id: `legal-cat-${c.id}`,
      title: `Legal IPTV: ${c.label}`,
      description: `Public playlists for ${c.label} channels (where available).`,
      url: `/legal-iptv/categories/${c.id}`,
      type: 'legal' as const,
      keywords: ['legal iptv', 'public playlists', 'm3u', c.label],
    })),
    // FAST services (small list; safe to index)
    ...(legalIptvData.fastServices || []).map((s) => ({
      id: `legal-fast-${s.id}`,
      title: `${s.name} (FAST)`,
      description: s.description,
      url: `/legal-iptv/fast/${s.id}`,
      type: 'legal' as const,
      keywords: ['fast', 'legal iptv', 'public playlists', s.name],
    })),
    // Player-Device guides (limit to most common)
    ...guides.slice(0, 50).map((guide) => ({
      id: `guide-${guide.slug}`,
      title: guide.title,
      description: guide.description,
      url: `/guides/${guide.playerId}/${guide.deviceId}`,
      type: 'guide' as const,
      keywords: guide.keywords,
    })),
  ];

  return <Search items={searchItems} />;
}
