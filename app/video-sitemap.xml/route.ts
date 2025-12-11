import { NextResponse } from 'next/server';
import { getVideoMappings, getBaseUrl } from '@/lib/data-loader';
import type { VideoData } from '@/lib/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Convert ISO 8601 duration (PT12M30S) to seconds
function durationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 300; // default 5 min
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function ensureIsoDateWithTimezone(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  if (/[zZ]$/.test(dateStr) || /[+-]\d{2}:\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00Z`;
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) return `${dateStr}Z`;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? dateStr : parsed.toISOString();
}

export async function GET() {
  const baseUrl = getBaseUrl();
  const videoMappings = await getVideoMappings();

  // Deduplicate videos by YouTube ID and point each entry
  // to a dedicated watch page where the video is primary content.
  const videosById = new Map<string, VideoData>();

  const addVideo = (video: VideoData) => {
    if (!video?.youtubeId) return;
    if (videosById.has(video.youtubeId)) return;
    videosById.set(video.youtubeId, video);
  };

  Object.values(videoMappings.players || {}).forEach(addVideo);
  Object.values(videoMappings.devices || {}).forEach(addVideo);
  Object.values(videoMappings['setup-guides'] || {}).forEach(addVideo);
  Object.values(videoMappings['technical-guides'] || {}).forEach(addVideo);
  Object.values(videoMappings['learn-articles'] || {}).forEach(addVideo);
  Object.values(videoMappings.troubleshooting || {}).forEach(addVideo);

  const videoEntries: string[] = [];

  videosById.forEach((video) => {
    videoEntries.push(`
  <url>
    <loc>${baseUrl}/watch/${video.youtubeId}</loc>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>https://www.youtube.com/watch?v=${video.youtubeId}</video:content_loc>
      <video:player_loc allow_embed="yes">https://www.youtube.com/embed/${video.youtubeId}</video:player_loc>
      <video:duration>${durationToSeconds(video.duration)}</video:duration>
      <video:publication_date>${ensureIsoDateWithTimezone(video.uploadDate)}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries.join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
