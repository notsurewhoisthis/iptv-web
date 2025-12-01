import { getPlayers, getDevices, getBlogPosts, getPlayerDeviceGuides } from '@/lib/data-loader';
import { Search } from './Search';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'player' | 'device' | 'guide' | 'blog';
  keywords?: string[];
}

export async function SearchWrapper() {
  // Load all data for search index
  const [players, devices, blogPosts, guides] = await Promise.all([
    getPlayers(),
    getDevices(),
    getBlogPosts(),
    getPlayerDeviceGuides(),
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
