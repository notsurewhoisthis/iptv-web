import type { Metadata } from 'next';
import Link from 'next/link';
import { getBaseUrl, getVideoMappings } from '@/lib/data-loader';
import type { VideoData, VideoMappings } from '@/lib/types';

export const metadata: Metadata = {
  title: 'IPTV Video Library',
  description: 'Browse IPTV setup, troubleshooting, and player videos from our guides.',
  alternates: {
    canonical: `${getBaseUrl()}/watch`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

type VideoEntry = {
  video: VideoData;
  sourcePath?: string;
};

function getSourcePath(section: string, key: string): string | undefined {
  switch (section) {
    case 'players':
      return `/players/${key}`;
    case 'devices':
      return `/devices/${key}`;
    case 'technical-guides':
      return `/guides/technical/${key}`;
    case 'learn-articles':
      return `/learn/${key}`;
    case 'setup-guides': {
      const parts = key.split('-');
      if (parts.length >= 2) {
        const playerId = parts[0];
        const deviceId = parts.slice(1).join('-');
        return `/guides/${playerId}/setup/${deviceId}`;
      }
      return undefined;
    }
    case 'troubleshooting': {
      const parts = key.split('-');
      if (parts.length >= 3) {
        const entityType = parts[0];
        const entityId = parts[1];
        const issueId = parts.slice(2).join('-');
        return `/troubleshooting/${entityType}/${entityId}/${issueId}`;
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

function collectVideos(mappings: VideoMappings): VideoEntry[] {
  const videosById = new Map<string, VideoEntry>();

  const addVideo = (section: string, key: string, video: VideoData) => {
    if (!video?.youtubeId || videosById.has(video.youtubeId)) return;
    videosById.set(video.youtubeId, { video, sourcePath: getSourcePath(section, key) });
  };

  (Object.entries(mappings) as [keyof VideoMappings, Record<string, VideoData>][]).forEach(
    ([section, map]) => {
      Object.entries(map || {}).forEach(([key, video]) => addVideo(section, key, video));
    }
  );

  return Array.from(videosById.values())
    .sort((a, b) =>
      new Date(b.video.uploadDate).getTime() - new Date(a.video.uploadDate).getTime()
    );
}

export default async function WatchIndexPage() {
  const mappings = await getVideoMappings();
  const videos = collectVideos(mappings).slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Video library</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">IPTV video guides</h1>
          <p className="text-gray-600">
            Watch setup, troubleshooting, and player walkthroughs. Full video pages are
            linked below.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(({ video, sourcePath }) => (
            <article
              key={video.youtubeId}
              className="border border-gray-200 rounded-xl bg-white p-4 hover:shadow-sm transition"
            >
              <Link href={`/watch/${video.youtubeId}`} className="block">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      video.thumbnailUrl ||
                      `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
                    }
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h2 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {video.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
              {sourcePath && (
                <Link
                  href={sourcePath}
                  className="inline-flex text-sm text-blue-600 hover:underline mt-3"
                >
                  Related guide →
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
