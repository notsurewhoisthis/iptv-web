'use client';

import { useState } from 'react';
import { VideoObjectSchema } from './JsonLd';
import { Play } from 'lucide-react';

export interface VideoData {
  youtubeId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate: string;
  duration: string;
  channelName?: string;
  channelUrl?: string;
}

interface VideoEmbedProps {
  video: VideoData;
  className?: string;
  showSchema?: boolean;
}

// NOTE: We only emit VideoObject structured data on dedicated watch pages.
export function VideoEmbed({ video, className = '', showSchema = false }: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-generate YouTube thumbnail if not provided
  const thumbnail = video.thumbnailUrl ||
    `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  // Use privacy-enhanced mode for GDPR compliance
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`;

  // Don't render anything if video is unavailable
  if (hasError) return null;

  return (
    <>
      {showSchema && (
        <VideoObjectSchema
          name={video.title}
          description={video.description}
          thumbnailUrl={thumbnail}
          uploadDate={video.uploadDate}
          duration={video.duration}
          contentUrl={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          embedUrl={`https://www.youtube.com/embed/${video.youtubeId}`}
        />
      )}

      <div className={`relative aspect-video bg-gray-900 rounded-lg overflow-hidden ${className}`}>
        {!isLoaded ? (
          <button
            onClick={() => setIsLoaded(true)}
            className="w-full h-full group cursor-pointer"
            aria-label={`Play video: ${video.title}`}
          >
            {/* Thumbnail image with fallback */}
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Video title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
            </div>
          </button>
        ) : (
          <iframe
            src={embedUrl}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>

      {/* Channel attribution */}
      {video.channelName && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Video by{' '}
          {video.channelUrl ? (
            <a
              href={video.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {video.channelName}
            </a>
          ) : (
            <span>{video.channelName}</span>
          )}
        </p>
      )}
    </>
  );
}

// Wrapper component for multiple videos
interface VideoGalleryProps {
  videos: VideoData[];
  title?: string;
  className?: string;
}

export function VideoGallery({ videos, title, className = '' }: VideoGalleryProps) {
  if (videos.length === 0) return null;

  return (
    <section className={`${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      )}
      <div className={`grid gap-4 ${videos.length === 1 ? '' : 'md:grid-cols-2'}`}>
        {videos.map((video, index) => (
          <VideoEmbed
            key={video.youtubeId}
            video={video}
            showSchema={index === 0} // Only first video gets schema to avoid duplicates
          />
        ))}
      </div>
    </section>
  );
}
