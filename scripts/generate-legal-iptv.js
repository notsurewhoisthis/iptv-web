#!/usr/bin/env node
/**
 * Generates `data/legal-iptv.json` from iptv-org/iptv (gh-pages branch).
 *
 * Goal: provide a safe, navigable directory of publicly available IPTV playlists.
 * Note: availability and rights vary by stream/provider/region — the site UI adds disclaimers.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const REPO_URL = 'https://github.com/iptv-org/iptv.git';
const BRANCH = 'gh-pages';
const SITE_URL = 'https://iptv-org.github.io/iptv';

const repoDir = path.join(os.tmpdir(), 'iptv-org-iptv-gh-pages');
const outFile = path.join(process.cwd(), 'data', 'legal-iptv.json');

function ensureRepo() {
  if (fs.existsSync(path.join(repoDir, '.git'))) {
    try {
      execSync(`git -C "${repoDir}" fetch --depth 1 origin ${BRANCH}`, {
        stdio: 'ignore',
      });
      execSync(`git -C "${repoDir}" checkout -f ${BRANCH}`, { stdio: 'ignore' });
      execSync(`git -C "${repoDir}" reset --hard origin/${BRANCH}`, { stdio: 'ignore' });
      return;
    } catch {
      // fallthrough to re-clone if update fails
    }
  }

  fs.rmSync(repoDir, { recursive: true, force: true });
  execSync(`git clone --depth 1 -b ${BRANCH} ${REPO_URL} "${repoDir}"`, {
    stdio: 'inherit',
  });
}

function toTitleCase(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function listM3uFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.m3u'))
    .sort((a, b) => a.localeCompare(b));
}

function safeDisplayName(displayNames, code, fallback) {
  try {
    const name = displayNames.of(code);
    return name || fallback;
  } catch {
    return fallback;
  }
}

function buildFastServices(sourceFiles) {
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

  const services = [
    {
      id: 'pluto-tv',
      name: 'Pluto TV',
      officialUrl: 'https://pluto.tv',
      description:
        'Free, ad‑supported live TV (FAST) channels. Availability varies by country.',
      suffixes: new Set(['pluto', 'plutotv']),
      playlists: [],
    },
    {
      id: 'samsung-tv-plus',
      name: 'Samsung TV Plus',
      officialUrl: 'https://www.samsungtvplus.com',
      description:
        'Free, ad‑supported live TV on supported Samsung devices (and web in some regions).',
      suffixes: new Set(['samsung']),
      playlists: [],
    },
    {
      id: 'rakuten-tv',
      name: 'Rakuten TV',
      officialUrl: 'https://rakuten.tv',
      description:
        'Free, ad‑supported live channels in supported regions. Availability varies by country.',
      suffixes: new Set(['rakuten']),
      playlists: [],
    },
    {
      id: 'plex',
      name: 'Plex Live TV',
      officialUrl: 'https://www.plex.tv/watch-free-live-tv/',
      description: 'Free, ad‑supported live channels inside Plex. Availability varies by region.',
      suffixes: new Set(['plex']),
      playlists: [],
    },
    {
      id: 'roku-channel',
      name: 'The Roku Channel',
      officialUrl: 'https://therokuchannel.roku.com/',
      description: 'Free, ad‑supported channels where available. Availability varies by region.',
      suffixes: new Set(['roku']),
      playlists: [],
    },
    {
      id: 'tubi',
      name: 'Tubi',
      officialUrl: 'https://tubitv.com',
      description: 'Free streaming (FAST) where available. Availability varies by country.',
      suffixes: new Set(['tubi']),
      playlists: [],
    },
    {
      id: 'xumo',
      name: 'Xumo Play',
      officialUrl: 'https://play.xumo.com/',
      description: 'Free, ad‑supported channels where available. Availability varies by region.',
      suffixes: new Set(['xumo']),
      playlists: [],
    },
    {
      id: 'stirr',
      name: 'STIRR',
      officialUrl: 'https://stirr.com/',
      description: 'Free, ad‑supported live channels where available. Availability varies by region.',
      suffixes: new Set(['stirr']),
      playlists: [],
    },
    {
      id: 'vizio-watchfree',
      name: 'VIZIO WatchFree+',
      officialUrl: 'https://www.vizio.com/en/watchfreeplus',
      description: 'Free, ad‑supported live channels where available. Availability varies by region.',
      suffixes: new Set(['vizio']),
      playlists: [],
    },
  ];

  const bySuffix = new Map();
  for (const svc of services) {
    for (const suf of svc.suffixes) bySuffix.set(suf, svc);
  }

  for (const file of sourceFiles) {
    const base = file.replace(/\.m3u$/i, '');
    const idx = base.indexOf('_');
    if (idx === -1) continue;

    const countryCode = base.slice(0, idx);
    const suffix = base.slice(idx + 1);
    const svc = bySuffix.get(suffix);
    if (!svc) continue;

    const ccUpper = countryCode.toUpperCase();
    const countryLabel = safeDisplayName(regionNames, ccUpper, ccUpper);

    svc.playlists.push({
      id: base,
      label: `${countryLabel} (${svc.name})`,
      url: `${SITE_URL}/sources/${file}`,
      countryCode,
      countryLabel,
    });
  }

  // Sort playlists by country then label
  for (const svc of services) {
    svc.playlists.sort((a, b) =>
      (a.countryLabel || '').localeCompare(b.countryLabel || '') ||
      a.label.localeCompare(b.label)
    );
  }

  return services.filter((s) => s.playlists.length > 0);
}

async function main() {
  ensureRepo();

  const commit = execSync(`git -C "${repoDir}" rev-parse HEAD`, {
    encoding: 'utf-8',
  }).trim();

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

  const categoriesDir = path.join(repoDir, 'categories');
  const countriesDir = path.join(repoDir, 'countries');
  const languagesDir = path.join(repoDir, 'languages');
  const sourcesDir = path.join(repoDir, 'sources');

  const excludedCategories = new Set(['xxx', 'undefined']);

  const categories = listM3uFiles(categoriesDir)
    .map((file) => file.replace(/\.m3u$/i, ''))
    .filter((slug) => !excludedCategories.has(slug))
    .map((slug) => ({
      id: slug,
      label: toTitleCase(slug),
      url: `${SITE_URL}/categories/${slug}.m3u`,
    }));

  const countries = listM3uFiles(countriesDir)
    .map((file) => file.replace(/\.m3u$/i, ''))
    .map((code) => {
      const cc = code.toUpperCase();
      const label = safeDisplayName(regionNames, cc, cc);
      return { code, label, url: `${SITE_URL}/countries/${code}.m3u` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const languages = listM3uFiles(languagesDir)
    .map((file) => file.replace(/\.m3u$/i, ''))
    .map((code) => {
      const label = safeDisplayName(languageNames, code, code);
      return { code, label, url: `${SITE_URL}/languages/${code}.m3u` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const sourceFiles = listM3uFiles(sourcesDir);
  const fastServices = buildFastServices(sourceFiles);

  const data = {
    generatedAt: new Date().toISOString(),
    source: {
      name: 'iptv-org/iptv',
      repoUrl: REPO_URL,
      branch: BRANCH,
      commit,
      siteUrl: SITE_URL,
      license: 'Unlicense',
      licenseUrl: 'https://github.com/iptv-org/iptv/blob/master/LICENSE',
    },
    indexes: {
      all: `${SITE_URL}/index.m3u`,
      categories: `${SITE_URL}/index.category.m3u`,
      countries: `${SITE_URL}/index.country.m3u`,
      languages: `${SITE_URL}/index.language.m3u`,
    },
    categories,
    countries,
    languages,
    fastServices,
  };

  await fsp.mkdir(path.dirname(outFile), { recursive: true });
  await fsp.writeFile(outFile, JSON.stringify(data, null, 2) + '\n', 'utf-8');

  console.log('Generated legal IPTV data:');
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Countries: ${countries.length}`);
  console.log(`- Languages: ${languages.length}`);
  console.log(`- FAST services: ${fastServices.length}`);
  console.log(`- Output: ${path.relative(process.cwd(), outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

