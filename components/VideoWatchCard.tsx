import Link from 'next/link';
import { Play, ExternalLink } from 'lucide-react';
import type { VideoData } from '@/lib/types';

export function VideoWatchCard({
  video,
  className = '',
  cta = 'Watch the full video',
}: {
  video: VideoData;
  className?: string;
  cta?: string;
}) {
  const thumbnail =
    video.thumbnailUrl ||
    `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <div
      className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm ${className}`}
    >
      <Link href={`/watch/${video.youtubeId}`} className="block group">
        <div className="relative aspect-video bg-gray-900">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-lg">
              <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="font-semibold text-gray-900 line-clamp-2">{video.title}</p>
          {video.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {video.description}
            </p>
          )}
          <p className="mt-3 text-sm text-blue-600 group-hover:underline">{cta}</p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
        >
          Open on YouTube <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

