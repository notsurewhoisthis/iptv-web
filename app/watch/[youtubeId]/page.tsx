import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVideoMappings, getBaseUrl } from '@/lib/data-loader';
import { VideoObjectSchema } from '@/components/JsonLd';
import type { VideoData, VideoMappings } from '@/lib/types';

interface PageProps {
  params: Promise<{ youtubeId: string }>;
}

export const dynamicParams = true;

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
        const entityType = parts[0]; // players | devices
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

async function findVideoEntry(youtubeId: string): Promise<VideoEntry | null> {
  const mappings = (await getVideoMappings()) as VideoMappings;

  for (const [section, map] of Object.entries(mappings) as [
    keyof VideoMappings,
    Record<string, VideoData>
  ][]) {
    for (const [key, video] of Object.entries(map)) {
      if (video.youtubeId === youtubeId) {
        return { video, sourcePath: getSourcePath(section, key) };
      }
    }
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { youtubeId } = await params;
  const entry = await findVideoEntry(youtubeId);
  if (!entry) return { title: 'Video Not Found' };

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/watch/${youtubeId}`;

  return {
    title: entry.video.title,
    description: entry.video.description,
    alternates: { canonical: url },
    openGraph: {
      title: entry.video.title,
      description: entry.video.description,
      type: 'video.other',
      url,
      images: [
        {
          url:
            entry.video.thumbnailUrl ||
            `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          alt: entry.video.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.video.title,
      description: entry.video.description,
      images: [
        entry.video.thumbnailUrl ||
          `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      ],
    },
  };
}

export default async function WatchPage({ params }: PageProps) {
  const { youtubeId } = await params;
  const entry = await findVideoEntry(youtubeId);

  if (!entry) notFound();

  const video = entry.video;
  const thumbnail =
    video.thumbnailUrl ||
    `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <VideoObjectSchema
        name={video.title}
        description={video.description}
        thumbnailUrl={thumbnail}
        uploadDate={video.uploadDate}
        duration={video.duration}
        contentUrl={`https://www.youtube.com/watch?v=${video.youtubeId}`}
        embedUrl={`https://www.youtube.com/embed/${video.youtubeId}`}
      />

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          {entry.sourcePath ? (
            <Link
              href={entry.sourcePath}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to article
            </Link>
          ) : (
            <span />
          )}
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Watch on YouTube
          </a>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {video.title}
        </h1>

        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {video.description && (
          <p className="mt-4 text-gray-600 leading-relaxed">
            {video.description}
          </p>
        )}

        {video.channelName && (
          <p className="mt-3 text-sm text-gray-500">
            Video by{' '}
            {video.channelUrl ? (
              <a
                href={video.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {video.channelName}
              </a>
            ) : (
              <span>{video.channelName}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
