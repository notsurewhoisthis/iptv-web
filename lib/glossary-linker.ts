import { glossaryTerms, type GlossaryTerm } from './glossary';

export interface GlossaryMatch {
  term: string;
  slug: string;
  definition: string;
}

// Build lookup maps for efficient term matching
const termMap = new Map<string, GlossaryMatch>();
const abbreviationMap = new Map<string, GlossaryMatch>();

// Initialize maps on module load
glossaryTerms.forEach((t) => {
  const match: GlossaryMatch = {
    term: t.term,
    slug: t.slug,
    definition: t.definition,
  };

  // Add full term (lowercase for matching)
  termMap.set(t.term.toLowerCase(), match);

  // Extract abbreviations like "EPG" from "EPG (Electronic Program Guide)"
  const abbrevMatch = t.term.match(/^([A-Z0-9]+)\s*\(/);
  if (abbrevMatch) {
    abbreviationMap.set(abbrevMatch[1].toLowerCase(), match);
  }

  // Also add slug as a key for simple terms
  if (!t.term.includes('(')) {
    termMap.set(t.slug.toLowerCase(), match);
  }
});

// Common IPTV terms to look for (mapped to their glossary slugs)
const commonTerms: Record<string, string> = {
  'm3u': 'm3u',
  'm3u8': 'm3u',
  'epg': 'epg',
  'electronic program guide': 'epg',
  'xtream codes': 'xtream-codes',
  'xtream': 'xtream-codes',
  'vod': 'vod',
  'video on demand': 'vod',
  'catchup': 'catchup',
  'catch-up': 'catchup',
  'timeshift': 'catchup',
  'hls': 'hls',
  'http live streaming': 'hls',
  'rtmp': 'rtmp',
  'buffer': 'buffering',
  'buffering': 'buffering',
  'codec': 'codec',
  'hevc': 'hevc',
  'h.265': 'hevc',
  'h265': 'hevc',
  'dvr': 'dvr',
  'pvr': 'pvr',
  'subtitle': 'subtitles',
  'subtitles': 'subtitles',
  'parental control': 'parental-control',
  'vpn': 'vpn',
  'playlist': 'playlist',
  'xmltv': 'xmltv',
  'multiscreen': 'multiscreen',
  'multi-screen': 'multiscreen',
};

/**
 * Find glossary terms mentioned in the given text
 * @param text - The text to search for glossary terms
 * @param limit - Maximum number of terms to return (default: 5)
 * @returns Array of matching glossary terms
 */
export function findGlossaryTerms(text: string, limit = 5): GlossaryMatch[] {
  if (!text) return [];

  const found: GlossaryMatch[] = [];
  const foundSlugs = new Set<string>();
  const lowerText = text.toLowerCase();

  // First, check for common terms
  for (const [searchTerm, slug] of Object.entries(commonTerms)) {
    if (found.length >= limit) break;

    // Match whole words only
    const regex = new RegExp(`\\b${escapeRegex(searchTerm)}\\b`, 'i');
    if (regex.test(lowerText) && !foundSlugs.has(slug)) {
      const term = glossaryTerms.find((t) => t.slug === slug);
      if (term) {
        found.push({
          term: term.term,
          slug: term.slug,
          definition: term.definition,
        });
        foundSlugs.add(slug);
      }
    }
  }

  // Then check abbreviation map
  for (const [abbrev, match] of abbreviationMap) {
    if (found.length >= limit) break;
    if (foundSlugs.has(match.slug)) continue;

    const regex = new RegExp(`\\b${escapeRegex(abbrev)}\\b`, 'i');
    if (regex.test(lowerText)) {
      found.push(match);
      foundSlugs.add(match.slug);
    }
  }

  // Finally check full term map
  for (const [termKey, match] of termMap) {
    if (found.length >= limit) break;
    if (foundSlugs.has(match.slug)) continue;

    const regex = new RegExp(`\\b${escapeRegex(termKey)}\\b`, 'i');
    if (regex.test(lowerText)) {
      found.push(match);
      foundSlugs.add(match.slug);
    }
  }

  return found;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get a glossary term by slug
 */
export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}
