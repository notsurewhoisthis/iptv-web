import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema } from '@/components/JsonLd';
import { getBaseUrl } from '@/lib/data-loader';

export const metadata: Metadata = {
  title: 'IPTV Glossary - Terms & Definitions Explained',
  description:
    'Complete glossary of IPTV terminology. Learn what EPG, M3U, catchup, VOD, and other streaming terms mean with clear explanations.',
  keywords:
    'IPTV glossary, IPTV terms, EPG meaning, M3U playlist, IPTV definitions, streaming terminology, Xtream Codes, catchup TV',
};

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  relatedTerms?: string[];
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'M3U / M3U8',
    slug: 'm3u',
    definition:
      'M3U is a playlist file format used to organize media files. M3U8 is the UTF-8 encoded version. In IPTV, M3U playlists contain URLs to live TV channels and VOD content. Most IPTV providers deliver their channel lists in this format.',
    relatedTerms: ['Playlist', 'Xtream Codes'],
  },
  {
    term: 'EPG (Electronic Program Guide)',
    slug: 'epg',
    definition:
      'An Electronic Program Guide displays TV schedules and program information for channels. EPG data is typically provided as an XML file (XMLTV format) and shows what is currently playing and upcoming programs with descriptions, times, and categories.',
    relatedTerms: ['XMLTV', 'TV Guide'],
  },
  {
    term: 'Xtream Codes API',
    slug: 'xtream-codes',
    definition:
      'Xtream Codes is a popular API protocol used by IPTV services. It uses a server URL, username, and password for authentication. Many IPTV players support Xtream Codes login, which provides organized channel categories, EPG data, and catchup functionality.',
    relatedTerms: ['M3U', 'API'],
  },
  {
    term: 'VOD (Video on Demand)',
    slug: 'vod',
    definition:
      'Video on Demand refers to content that can be watched at any time, rather than scheduled broadcasts. VOD includes movies, TV series, and other pre-recorded content available through your IPTV service.',
    relatedTerms: ['Catchup', 'Series'],
  },
  {
    term: 'Catchup / Timeshift',
    slug: 'catchup',
    definition:
      'Catchup (also called timeshift) allows you to watch previously aired content. If you missed a live broadcast, catchup lets you go back and watch it for a limited period (usually 3-7 days). Not all channels or providers support this feature.',
    relatedTerms: ['VOD', 'DVR'],
  },
  {
    term: 'HLS (HTTP Live Streaming)',
    slug: 'hls',
    definition:
      'HLS is a streaming protocol developed by Apple. It breaks video into small segments and delivers them over HTTP. HLS is widely supported and adapts quality based on your internet connection speed.',
    relatedTerms: ['Streaming Protocol', 'Adaptive Bitrate'],
  },
  {
    term: 'RTMP (Real-Time Messaging Protocol)',
    slug: 'rtmp',
    definition:
      'RTMP is a streaming protocol originally developed by Adobe. While less common today, some IPTV streams still use RTMP. It provides low-latency streaming but requires specific player support.',
    relatedTerms: ['HLS', 'Streaming Protocol'],
  },
  {
    term: 'Buffer / Buffering',
    slug: 'buffering',
    definition:
      'Buffering occurs when your device downloads and stores video data before playback. A buffer helps ensure smooth playback by having content ready. Excessive buffering usually indicates slow internet or server issues.',
    relatedTerms: ['Streaming', 'Connection'],
  },
  {
    term: 'Codec',
    slug: 'codec',
    definition:
      'A codec (coder-decoder) compresses and decompresses video and audio data. Common video codecs include H.264, H.265 (HEVC), and AV1. Your IPTV player must support the codec used by the stream to play it properly.',
    relatedTerms: ['H.264', 'H.265', 'HEVC'],
  },
  {
    term: 'H.264 / AVC',
    slug: 'h264',
    definition:
      'H.264 (also called AVC) is the most widely used video codec. It offers good compression with broad device compatibility. Most IPTV streams use H.264 encoding.',
    relatedTerms: ['Codec', 'H.265'],
  },
  {
    term: 'H.265 / HEVC',
    slug: 'h265',
    definition:
      'H.265 (High Efficiency Video Coding) provides better compression than H.264, delivering similar quality at half the file size. It is commonly used for 4K content but requires more processing power to decode.',
    relatedTerms: ['Codec', 'H.264', '4K'],
  },
  {
    term: 'Hardware Decoding',
    slug: 'hardware-decoding',
    definition:
      'Hardware decoding uses your device dedicated video processor (GPU) to decode video streams. This is more efficient than software decoding and reduces CPU usage, resulting in smoother playback and lower power consumption.',
    relatedTerms: ['Software Decoding', 'Codec'],
  },
  {
    term: 'Software Decoding',
    slug: 'software-decoding',
    definition:
      'Software decoding uses your device CPU to decode video streams. While more flexible than hardware decoding, it uses more power and may struggle with high-resolution content on older devices.',
    relatedTerms: ['Hardware Decoding', 'Codec'],
  },
  {
    term: 'Multi-screen / Picture-in-Picture',
    slug: 'multi-screen',
    definition:
      'Multi-screen allows viewing multiple channels simultaneously on one screen. Picture-in-Picture (PiP) shows a smaller video window over the main content. Useful for watching multiple sports events at once.',
    relatedTerms: ['Player Feature'],
  },
  {
    term: 'External Player',
    slug: 'external-player',
    definition:
      'An external player is a separate video player app (like VLC or MX Player) that can be used to play streams from your IPTV app. This is useful when the built-in player has compatibility issues with certain streams.',
    relatedTerms: ['VLC', 'MX Player'],
  },
  {
    term: 'Favorites / Bookmarks',
    slug: 'favorites',
    definition:
      'Favorites (or bookmarks) let you save frequently watched channels for quick access. Most IPTV players support creating custom favorite lists to organize your preferred channels.',
    relatedTerms: ['Channel Management'],
  },
  {
    term: 'Channel Groups / Categories',
    slug: 'channel-groups',
    definition:
      'Channels are often organized into groups or categories like Sports, Movies, News, Entertainment, etc. This organization makes it easier to find specific content among thousands of channels.',
    relatedTerms: ['Favorites', 'EPG'],
  },
  {
    term: 'Auto-start / Boot Launch',
    slug: 'auto-start',
    definition:
      'Auto-start (or boot launch) configures your IPTV player to open automatically when you turn on your device. Useful for dedicated IPTV setups where you want immediate access to live TV.',
    relatedTerms: ['Player Settings'],
  },
  {
    term: 'Parental Controls',
    slug: 'parental-controls',
    definition:
      'Parental controls allow you to restrict access to certain channels or content. You can set a PIN code to lock adult content or limit viewing based on content ratings.',
    relatedTerms: ['PIN', 'Content Filtering'],
  },
  {
    term: 'DVR / Recording',
    slug: 'dvr',
    definition:
      'DVR (Digital Video Recording) capability allows you to record live TV streams for later viewing. Not all IPTV players support recording, and storage space on your device is required.',
    relatedTerms: ['Catchup', 'Local Recording'],
  },
  {
    term: 'Aspect Ratio',
    slug: 'aspect-ratio',
    definition:
      'Aspect ratio is the proportional relationship between video width and height. Common ratios include 16:9 (widescreen) and 4:3 (standard). IPTV players let you adjust aspect ratio to fit your screen.',
    relatedTerms: ['Video Settings', 'Zoom'],
  },
  {
    term: 'Subtitles / Closed Captions',
    slug: 'subtitles',
    definition:
      'Subtitles display text translations or transcriptions of audio content. IPTV streams may include embedded subtitles in various languages. Most players allow you to toggle subtitles on/off and adjust their appearance.',
    relatedTerms: ['Accessibility'],
  },
  {
    term: 'Audio Track',
    slug: 'audio-track',
    definition:
      'Many streams include multiple audio tracks for different languages or audio formats (stereo, 5.1 surround). Your IPTV player should allow switching between available audio tracks.',
    relatedTerms: ['Subtitles', 'Multi-language'],
  },
  {
    term: 'Stream URL',
    slug: 'stream-url',
    definition:
      'A stream URL is the web address pointing to a video stream. IPTV playlists contain stream URLs for each channel. URLs typically start with http://, https://, or specific protocols like rtmp://.',
    relatedTerms: ['M3U', 'Playlist'],
  },
  {
    term: 'User Agent',
    slug: 'user-agent',
    definition:
      'A user agent is a string that identifies your device/browser to the server. Some IPTV streams require specific user agents to work. Advanced players allow you to customize the user agent string.',
    relatedTerms: ['Headers', 'Stream Settings'],
  },
  {
    term: 'VPN (Virtual Private Network)',
    slug: 'vpn',
    definition:
      'A VPN encrypts your internet connection and routes it through servers in different locations. VPNs can help with privacy and accessing geo-restricted content, though they may affect streaming speed.',
    relatedTerms: ['Privacy', 'Geo-blocking'],
  },
  {
    term: 'Stalker Portal / MAC Address',
    slug: 'stalker-portal',
    definition:
      'Stalker Portal (also called Ministra) is an IPTV middleware platform. It uses MAC address authentication instead of username/password. Some IPTV services provide portal URLs that require a registered MAC address.',
    relatedTerms: ['Xtream Codes', 'Portal'],
  },
  {
    term: 'XMLTV',
    slug: 'xmltv',
    definition:
      'XMLTV is an XML-based format for TV listings data. EPG information is commonly distributed in XMLTV format. Your IPTV player parses this file to display program schedules.',
    relatedTerms: ['EPG', 'TV Guide'],
  },
  {
    term: 'Bitrate',
    slug: 'bitrate',
    definition:
      'Bitrate measures the amount of data processed per second in a stream, typically in Mbps (megabits per second). Higher bitrates generally mean better quality but require faster internet connections.',
    relatedTerms: ['Quality', 'Bandwidth'],
  },
  {
    term: 'Adaptive Bitrate Streaming',
    slug: 'adaptive-bitrate',
    definition:
      'Adaptive bitrate streaming automatically adjusts video quality based on your internet speed and device capabilities. This ensures smooth playback by lowering quality during congestion rather than buffering.',
    relatedTerms: ['HLS', 'Bitrate', 'Quality'],
  },
];

// Sort terms alphabetically
const sortedTerms = [...glossaryTerms].sort((a, b) =>
  a.term.localeCompare(b.term)
);

// Group terms by first letter
const groupedTerms = sortedTerms.reduce(
  (acc, term) => {
    const firstChar = term.term[0].toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  },
  {} as Record<string, GlossaryTerm[]>
);

const letters = Object.keys(groupedTerms).sort();

export default function GlossaryPage() {
  const baseUrl = getBaseUrl();

  // Convert glossary terms to FAQ format for schema
  const faqItems = sortedTerms.slice(0, 20).map((term) => ({
    question: `What does ${term.term} mean in IPTV?`,
    answer: term.definition,
  }));

  return (
    <div className="min-h-screen">
      {/* JSON-LD */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Glossary', url: `${baseUrl}/glossary` },
        ]}
      />
      <FAQSchema faqs={faqItems} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-gray-900 font-medium">Glossary</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              IPTV Glossary
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Understanding IPTV terminology can be confusing. This glossary
            explains common terms you will encounter when setting up and using
            IPTV players.
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Jump to Letter
          </h2>
          <div className="flex flex-wrap gap-2">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
              >
                {letter}
              </a>
            ))}
          </div>
        </nav>

        {/* Terms */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                {letter}
              </h2>
              <dl className="space-y-6">
                {groupedTerms[letter].map((item) => (
                  <div
                    key={item.slug}
                    id={item.slug}
                    className="scroll-mt-20"
                  >
                    <dt className="text-lg font-semibold text-gray-900 mb-2">
                      {item.term}
                    </dt>
                    <dd className="text-gray-700 leading-relaxed">
                      {item.definition}
                    </dd>
                    {item.relatedTerms && item.relatedTerms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Related:</span>
                        {item.relatedTerms.map((related) => (
                          <span
                            key={related}
                            className="text-sm text-blue-600"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-4">
            Now that you understand the terminology, explore our player reviews
            and setup guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/players"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Players
            </Link>
            <Link
              href="/guides"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition"
            >
              View Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
