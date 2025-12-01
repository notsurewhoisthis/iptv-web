// IPTV Architecture Diagram - SVG Component
export function IptvArchitectureDiagram() {
  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        How IPTV Works
      </h3>
      <svg
        viewBox="0 0 800 320"
        className="w-full max-w-4xl mx-auto"
        aria-label="IPTV Architecture Diagram showing content flow from provider to viewer"
      >
        {/* Background */}
        <rect width="800" height="320" fill="transparent" />

        {/* Content Provider */}
        <g transform="translate(40, 100)">
          <rect x="0" y="0" width="120" height="80" rx="8" fill="#3B82F6" />
          <text x="60" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Content
          </text>
          <text x="60" y="52" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Provider
          </text>
          <text x="60" y="70" textAnchor="middle" fill="#BFDBFE" fontSize="10">
            (TV Channels, VOD)
          </text>
        </g>

        {/* Arrow 1 */}
        <g>
          <line x1="160" y1="140" x2="220" y2="140" stroke="#9CA3AF" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="190" y="125" textAnchor="middle" fill="#6B7280" fontSize="9">
            Encode
          </text>
        </g>

        {/* Head-End / Encoding */}
        <g transform="translate(220, 100)">
          <rect x="0" y="0" width="120" height="80" rx="8" fill="#8B5CF6" />
          <text x="60" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Head-End
          </text>
          <text x="60" y="52" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Server
          </text>
          <text x="60" y="70" textAnchor="middle" fill="#DDD6FE" fontSize="10">
            (Encoding, DRM)
          </text>
        </g>

        {/* Arrow 2 */}
        <g>
          <line x1="340" y1="140" x2="400" y2="140" stroke="#9CA3AF" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="370" y="125" textAnchor="middle" fill="#6B7280" fontSize="9">
            Stream
          </text>
        </g>

        {/* CDN / Internet */}
        <g transform="translate(400, 80)">
          <ellipse cx="60" cy="60" rx="60" ry="50" fill="#10B981" />
          <text x="60" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            Internet
          </text>
          <text x="60" y="68" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            (CDN)
          </text>
          <text x="60" y="85" textAnchor="middle" fill="#A7F3D0" fontSize="10">
            M3U / Xtream
          </text>
        </g>

        {/* Arrow 3 */}
        <g>
          <line x1="520" y1="140" x2="580" y2="140" stroke="#9CA3AF" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="550" y="125" textAnchor="middle" fill="#6B7280" fontSize="9">
            Deliver
          </text>
        </g>

        {/* IPTV Player */}
        <g transform="translate(580, 100)">
          <rect x="0" y="0" width="120" height="80" rx="8" fill="#F59E0B" />
          <text x="60" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            IPTV Player
          </text>
          <text x="60" y="52" textAnchor="middle" fill="#FEF3C7" fontSize="10">
            (TiviMate, VLC,
          </text>
          <text x="60" y="66" textAnchor="middle" fill="#FEF3C7" fontSize="10">
            JamRun, etc.)
          </text>
        </g>

        {/* Devices - branching down from player */}
        <g>
          {/* Lines to devices */}
          <line x1="640" y1="180" x2="640" y2="220" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="540" y1="220" x2="740" y2="220" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="540" y1="220" x2="540" y2="250" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="640" y1="220" x2="640" y2="250" stroke="#9CA3AF" strokeWidth="2" />
          <line x1="740" y1="220" x2="740" y2="250" stroke="#9CA3AF" strokeWidth="2" />
        </g>

        {/* Device Icons */}
        <g transform="translate(500, 250)">
          <rect x="0" y="0" width="80" height="50" rx="4" fill="#1F2937" />
          <text x="40" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            Smart TV
          </text>
          <text x="40" y="38" textAnchor="middle" fill="#9CA3AF" fontSize="9">
            Android TV
          </text>
        </g>

        <g transform="translate(600, 250)">
          <rect x="0" y="0" width="80" height="50" rx="4" fill="#1F2937" />
          <text x="40" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            Firestick
          </text>
          <text x="40" y="38" textAnchor="middle" fill="#9CA3AF" fontSize="9">
            Fire TV
          </text>
        </g>

        <g transform="translate(700, 250)">
          <rect x="0" y="0" width="80" height="50" rx="4" fill="#1F2937" />
          <text x="40" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            Apple TV
          </text>
          <text x="40" y="38" textAnchor="middle" fill="#9CA3AF" fontSize="9">
            iOS/tvOS
          </text>
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
          </marker>
        </defs>

        {/* Legend */}
        <g transform="translate(40, 280)">
          <text x="0" y="0" fill="#6B7280" fontSize="10" className="dark:fill-gray-400">
            Data Flow: Content → Encoding → Internet Delivery → Your Device
          </text>
        </g>
      </svg>
    </div>
  );
}

// Simple streaming flow diagram
export function StreamingFlowDiagram() {
  return (
    <div className="my-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">M3U/Xtream URL</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Your playlist</span>
        </div>

        <svg className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">IPTV Player</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Decodes stream</span>
        </div>

        <svg className="w-8 h-8 text-gray-400 rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Watch TV</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Live channels</span>
        </div>
      </div>
    </div>
  );
}

// M3U Playlist structure visualization
export function M3uStructureDiagram() {
  return (
    <div className="my-6 bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <div className="text-xs font-mono">
        <div className="text-green-400">#EXTM3U</div>
        <div className="text-gray-500 mt-2">{'// Channel entry format:'}</div>
        <div className="text-yellow-400">#EXTINF:-1 tvg-id=&quot;channel1&quot; tvg-logo=&quot;logo.png&quot; group-title=&quot;Sports&quot;,ESPN</div>
        <div className="text-blue-400">http://stream.example.com/live/espn.m3u8</div>
        <div className="mt-2 text-gray-500">{'// Another channel:'}</div>
        <div className="text-yellow-400">#EXTINF:-1 tvg-id=&quot;channel2&quot; tvg-logo=&quot;logo2.png&quot; group-title=&quot;News&quot;,CNN</div>
        <div className="text-blue-400">http://stream.example.com/live/cnn.m3u8</div>
      </div>
      <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <div><span className="text-green-400">#EXTM3U</span> - File header</div>
          <div><span className="text-yellow-400">#EXTINF</span> - Channel info</div>
          <div><span className="text-blue-400">URL</span> - Stream address</div>
          <div><span className="text-gray-500">tvg-*</span> - EPG metadata</div>
        </div>
      </div>
    </div>
  );
}
