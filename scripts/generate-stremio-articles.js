#!/usr/bin/env node
/**
 * Generates `data/stremio-articles.json`.
 *
 * These are Stremio-focused knowledge-base articles written to be:
 * - SEO-friendly (clear intent + internal linking)
 * - Safe (no instructions for accessing pirated content)
 * - Practical (step-by-step, troubleshooting, best practices)
 */

const fs = require('fs/promises');
const path = require('path');

const OUT_FILE = path.join(process.cwd(), 'data', 'stremio-articles.json');
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

function wordsToKeywords(title, extra = []) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .split(/\\s+/)
    .filter(Boolean)
    .slice(0, 10);
  return Array.from(new Set(['stremio', ...base, ...extra.map((s) => s.toLowerCase())]));
}

function md(strings, ...values) {
  let out = '';
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) out += values[i];
  }
  return out.trim() + '\n';
}

function article({
  slug,
  title,
  metaTitle,
  description,
  category,
  keywords = [],
  content,
  faqs,
  relatedSlugs = [],
}) {
  return {
    slug,
    title,
    metaTitle,
    description,
    category,
    keywords: keywords.length ? keywords : wordsToKeywords(title),
    content,
    faqs,
    lastUpdated: LAST_UPDATED,
    relatedSlugs,
  };
}

const articles = [
  article({
    slug: 'what-is-stremio',
    title: 'What is Stremio? (Beginner Guide)',
    metaTitle: 'What is Stremio? How It Works + Safe Setup (2025)',
    description:
      'Learn what Stremio is, how it works, what “addons” mean, and how to set it up safely using legal sources on any device.',
    category: 'basics',
    keywords: wordsToKeywords('What is Stremio', ['addons', 'setup', 'legal sources', 'stremio app']),
    content: md`
## What Stremio is (in one sentence)
Stremio is a media center that organizes movies, series, live channels, and your library in one place using catalogs and addons.

## How Stremio works (simple explanation)
Stremio has three parts:
1) **The app** (player + library + search)
2) **Catalogs** (what you can browse)
3) **Addons** (connect catalogs to sources and features)

Stremio itself does not “own” content. What you can watch depends on the addons you choose and the services you’re signed into.

## The safe way to use Stremio
Use Stremio with:
- **Official streaming services** you subscribe to (where supported)
- **Public domain / free-to-watch catalogs**
- **Your own local files** (personal media library)

Avoid any addon that claims to unlock paid channels/movies for free. If it sounds too good to be true, it usually is.

## Quick setup checklist
- Create/sign in to your Stremio account
- Install Stremio on your device(s)
- Add only addons you trust and understand
- Test playback with a known-legal title
- If you hit errors, use the troubleshooting guides on this site

## Helpful next steps on IPTV Guide
- Stremio player overview: [Stremio review](/players/stremio)
- Device setup guides: [Stremio setup guides](/guides/stremio/setup/firestick)
- Troubleshooting hub: [Stremio troubleshooting](/troubleshooting/players/stremio/stremio-internal-server-error)
`,
    faqs: [
      {
        question: 'Is Stremio legal?',
        answer:
          'Stremio as an app is legal. Legality depends on the sources and addons you use—stick to legal services, public domain content, and your own media.',
      },
      {
        question: 'Does Stremio support M3U IPTV playlists?',
        answer:
          'Stremio does not natively support M3U/Xtream playlists like IPTV players do. If you want M3U playlists, use an IPTV player such as VLC or Kodi.',
      },
      {
        question: 'Do I need a powerful device for Stremio?',
        answer:
          'For smooth HD/4K playback, a modern streaming device (Android TV box, Fire TV, recent phone/PC) is recommended. Network stability matters as much as hardware.',
      },
    ],
    relatedSlugs: ['stremio-vs-iptv-player', 'stremio-addons-explained', 'stremio-buffering-fixes'],
  }),

  article({
    slug: 'stremio-vs-iptv-player',
    title: 'Stremio vs IPTV Players: What’s the Difference?',
    metaTitle: 'Stremio vs IPTV Player (M3U/Xtream): Which One to Use?',
    description:
      'Stremio is a media center with addons; IPTV players focus on M3U/Xtream playlists. This guide explains what each is best for.',
    category: 'basics',
    keywords: wordsToKeywords('Stremio vs IPTV Player', ['m3u', 'xtream', 'kodi', 'vlc']),
    content: md`
## Quick answer
Use **Stremio** when you want a modern media library experience with catalogs and addons. Use an **IPTV player** when you have an **M3U** or **Xtream** playlist and want channel-first navigation.

## What IPTV players are best at
IPTV players are purpose-built for:
- M3U playlists and Xtream portals
- Channel lists, EPG (TV guide), catch‑up, and favorites
- Fast channel switching and buffer controls

Try these on IPTV Guide:
- [VLC](/players/vlc)
- [Kodi](/players/kodi)
- [IPTV Smarters](/players/iptv-smarters)

## What Stremio is best at
Stremio shines for:
- Browsing a library-style catalog (movies/series)
- Syncing watch progress across devices
- A clean, modern interface for media discovery

## Common confusion: “Can I use IPTV with Stremio?”
Stremio isn’t a traditional IPTV app and doesn’t directly take M3U/Xtream. If your goal is IPTV channels + EPG, you’ll have a better experience with a dedicated IPTV player.

## Where “legal IPTV” fits
If you’re looking for **free, publicly available playlists**, start here:
- [Public playlists directory (iptv-org)](/legal-iptv)

Then open the playlist in an IPTV player (VLC/Kodi/TiviMate).
`,
    faqs: [
      {
        question: 'Can Stremio replace my IPTV app?',
        answer:
          'Usually no. If you rely on M3U/Xtream + EPG, you’ll want a dedicated IPTV player. Stremio is better as a media-center style app.',
      },
      {
        question: 'Which is easier for beginners?',
        answer:
          'If you already have an M3U/Xtream playlist, IPTV players are simpler. If you want a library experience, Stremio’s interface is very beginner-friendly.',
      },
    ],
    relatedSlugs: ['what-is-stremio', 'legal-iptv-playlists-how-to-use'],
  }),

  article({
    slug: 'stremio-account-sync',
    title: 'Stremio Account & Sync: How It Works',
    metaTitle: 'Stremio Account Sync Explained (Library, Addons, Progress)',
    description:
      'Understand what Stremio syncs across devices (library, addons, watch progress), what does not sync, and how to fix sync issues.',
    category: 'setup',
    keywords: wordsToKeywords('Stremio Account Sync', ['sync', 'library', 'watch progress']),
    content: md`
## What Stremio syncs (and why it matters)
When you sign into Stremio on multiple devices, it can keep your experience consistent:
- Installed addons (in many cases)
- Library / watchlist
- Watch progress (where supported)

## What might not sync perfectly
Some items are device-specific:
- Player output settings (audio passthrough, subtitles styling)
- Casting device pairing
- OS-level permissions and storage limits

## Step-by-step: get sync working
1) Confirm you are signed into the **same account** on every device
2) On each device, restart Stremio after installing or removing addons
3) If one device lags behind, sign out → sign in again
4) If a specific addon isn’t appearing, reinstall it and refresh catalogs

## Best practice
Pick a “primary” device to manage addons (desktop is easiest), then let other devices sync.

## Related
- Learn addon basics: [Stremio addons explained](/stremio/stremio-addons-explained)
- Troubleshooting playback errors: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Do addons sync across devices?',
        answer:
          'Often yes, but not always instantly. Give it a few minutes, restart the app, and verify you’re logged into the same account.',
      },
      {
        question: 'Does Stremio sync subtitle settings?',
        answer:
          'Subtitle appearance and player toggles can be device-specific. Expect to configure subtitle defaults on each device.',
      },
    ],
    relatedSlugs: ['stremio-addons-explained', 'stremio-subtitles-not-working'],
  }),

  article({
    slug: 'stremio-addons-explained',
    title: 'Stremio Addons Explained (Safe + Legal Checklist)',
    metaTitle: 'Stremio Addons Explained: Safe Setup + Legal Checklist',
    description:
      'Learn what Stremio addons do, how to evaluate them safely, and how to avoid risky addons that may provide unlicensed content.',
    category: 'addons',
    keywords: wordsToKeywords('Stremio Addons Explained', ['safe addons', 'legal', 'catalogs']),
    content: md`
## What an addon is
In Stremio, an addon is a plugin that can add:
- A catalog (what you can browse)
- A provider connection (where content comes from)
- Metadata (posters, descriptions) and quality filters

## Safe addon checklist (use this every time)
Before installing an addon:
1) **Read what it does** (catalog only vs provider)
2) Prefer **official** or well-known, transparent addons
3) Avoid addons promising “premium content for free”
4) If an addon is vague about sources, skip it
5) Keep your addon list minimal — fewer moving parts means fewer errors

## Legal note (important)
Stremio is a tool. You’re responsible for using legal sources and respecting content rights in your country.

## Practical setup pattern
Use this approach:
- One or two trusted catalogs
- One player configuration you can reproduce on every device
- Test playback with a known-legal stream before adding more

## Related guides
- Improve reliability: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
- Casting: [Stremio Chromecast guide](/stremio/stremio-chromecast-guide)
`,
    faqs: [
      {
        question: 'Are all Stremio addons legal?',
        answer:
          'No. Some addons may point to sources that are not licensed. Only install addons that you understand and that provide legal content.',
      },
      {
        question: 'Why do some addons stop working?',
        answer:
          'Addons depend on third-party services and APIs. If a provider changes or goes offline, the addon can break until updated.',
      },
    ],
    relatedSlugs: ['what-is-stremio', 'stremio-buffering-fixes', 'stremio-no-streams-found'],
  }),

  article({
    slug: 'how-to-install-stremio-addons',
    title: 'How to Install Stremio Addons (Beginner Steps)',
    metaTitle: 'How to Install Stremio Addons (Step-by-Step, Safe Setup)',
    description:
      'Step-by-step instructions to install and manage Stremio addons, keep your setup clean, and avoid common beginner mistakes.',
    category: 'addons',
    keywords: wordsToKeywords('How to Install Stremio Addons', ['install addons', 'beginner']),
    content: md`
## Step-by-step: install an addon
1) Open Stremio and go to the **Addons** section
2) Browse or search for an addon
3) Click **Install**
4) Return to the home screen and refresh catalogs

## Keep your addon setup clean
- Remove addons you don’t use
- Avoid installing multiple addons that do the same job
- Test after every change so you know what caused a new issue

## Troubleshooting if catalogs don’t update
1) Restart Stremio
2) Confirm you’re signed in
3) Remove and reinstall the addon

## Related
- What addons are: [Stremio addons explained](/stremio/stremio-addons-explained)
- When nothing plays: [No streams found fixes](/stremio/stremio-no-streams-found)
`,
    faqs: [
      {
        question: 'Do I need to install addons on every device?',
        answer:
          'If you use an account, addons often sync. If a device doesn’t show them, restart the app and confirm you’re signed in.',
      },
    ],
    relatedSlugs: ['stremio-addons-explained', 'stremio-account-sync'],
  }),

  article({
    slug: 'stremio-web-vs-app',
    title: 'Stremio Web vs App: Which Should You Use?',
    metaTitle: 'Stremio Web vs App (Desktop/Mobile): Best Choice in 2025',
    description:
      'Compare Stremio Web and the native app: device compatibility, playback reliability, casting support, and best use cases.',
    category: 'basics',
    keywords: wordsToKeywords('Stremio Web vs App', ['stremio web', 'desktop', 'mobile']),
    content: md`
## Quick answer
Use the **native app** when you want the most reliable playback and device integration. Use **Stremio Web** when you need quick access on a browser-first workflow.

## When Stremio Web is great
- Browsing your library quickly on desktop
- Managing catalogs and exploring titles
- Lightweight access on shared computers

## When the native app is better
- Casting (Chromecast/AirPlay) workflows
- Device-level player settings (audio/subtitles)
- More consistent performance on TVs/streaming devices

## Recommended setup
Use desktop (web or app) as your “management” device, and a TV device for playback.

## Related
- Casting: [Stremio Chromecast guide](/stremio/stremio-chromecast-guide)
- Performance: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Can I cast from Stremio Web?',
        answer:
          'Casting features can vary by browser and platform. If casting is a priority, the native app is usually more consistent.',
      },
    ],
    relatedSlugs: ['stremio-account-sync', 'stremio-chromecast-guide'],
  }),

  article({
    slug: 'stremio-chromecast-guide',
    title: 'Stremio Chromecast Guide (Casting Tips)',
    metaTitle: 'Stremio Chromecast Guide: How to Cast Smoothly (2025)',
    description:
      'Fix common casting problems: devices not showing, stutter, audio delay, and subtitle issues when casting Stremio to Chromecast.',
    category: 'best-practices',
    keywords: wordsToKeywords('Stremio Chromecast Guide', ['cast', 'chromecast', 'stutter']),
    content: md`
## Before you start (most common mistake)
Casting works best when:
- Your phone/PC and Chromecast are on the **same Wi‑Fi network**
- Your Wi‑Fi is stable (5GHz preferred)

## Step-by-step: cast Stremio
1) Start playing a title
2) Tap the **Cast** icon
3) Choose your Chromecast device
4) Wait for the connection to complete before changing quality/subtitles

## If your Chromecast doesn’t appear
- Confirm both devices are on the same network
- Reboot your Chromecast
- Restart Stremio
- Disable VPN temporarily (if it breaks local discovery)

## Reduce stutter and buffering while casting
- Use 5GHz Wi‑Fi or Ethernet (if your Chromecast supports it)
- Move closer to the router
- Reduce other heavy network usage while testing

## Related
- General buffering: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Why does casting buffer more than playing on my phone?',
        answer:
          'Casting adds another hop and can expose Wi‑Fi issues. Improve your network and keep the casting device close to the router.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes'],
  }),

  article({
    slug: 'stremio-buffering-fixes',
    title: 'Stremio Buffering Fixes (10 Practical Steps)',
    metaTitle: 'Stremio Buffering Fix: 10 Steps for Smooth Playback',
    description:
      'Reduce buffering in Stremio with network checks, device performance tips, and settings that improve playback stability.',
    category: 'troubleshooting',
    keywords: wordsToKeywords('Stremio Buffering Fixes', ['buffering', 'stutter', 'slow']),
    content: md`
## Quick answer
Most buffering issues come from **network instability**, **device limitations**, or an **overloaded source**. Fix the basics first, then refine.

## 10 steps that solve most buffering
1) Restart your device and router
2) Prefer **Ethernet** or **5GHz Wi‑Fi**
3) Test your speed near the device (not just on your phone)
4) Close background apps and free device memory
5) Update Stremio to the latest version
6) Try a different title to see if it’s source-specific
7) Reduce casting complexity (test on-device playback first)
8) Reinstall the addon(s) involved (if playback depends on them)
9) If subtitles cause stutter, test with subtitles off
10) If the problem is consistent at a specific time, it may be network congestion

## Pro tip: isolate where the problem is
If *everything* buffers, it’s likely your network/device.
If *one title* buffers, it’s likely the source.

## Related
- Subtitles: [Stremio subtitles not working](/stremio/stremio-subtitles-not-working)
- Casting: [Stremio Chromecast guide](/stremio/stremio-chromecast-guide)
`,
    faqs: [
      {
        question: 'Does a VPN fix Stremio buffering?',
        answer:
          'Sometimes a VPN can help if your ISP is throttling certain traffic, but it can also add latency. Test with and without to confirm.',
      },
      {
        question: 'Why does buffering happen only at night?',
        answer:
          'Evening congestion on your ISP or local Wi‑Fi channel interference can reduce throughput. Try Ethernet or change Wi‑Fi channels.',
      },
    ],
    relatedSlugs: ['stremio-chromecast-guide', 'stremio-subtitles-not-working'],
  }),

  article({
    slug: 'stremio-no-streams-found',
    title: 'Stremio “No Streams Found”: Fixes That Work',
    metaTitle: 'Fix Stremio “No Streams Found” (Safe Troubleshooting)',
    description:
      'Solve the common “No streams found” message in Stremio by checking addons, account sync, app state, and network issues.',
    category: 'troubleshooting',
    keywords: wordsToKeywords('Stremio No Streams Found', ['no streams', 'addons']),
    content: md`
## What “No streams found” usually means
Stremio can’t find a playable source for the title *with your current addon setup*.

## Fix checklist
1) Confirm you installed at least one addon that provides sources
2) Restart Stremio
3) Sign out → sign back in (to refresh sync)
4) Reinstall the addon(s) you rely on
5) Try a different title (to confirm it’s not title-specific)

## Keep it safe
Only use addons that provide legal sources.

## Related
- Addons explained: [Stremio addons explained](/stremio/stremio-addons-explained)
- Sync: [Stremio account sync](/stremio/stremio-account-sync)
`,
    faqs: [
      {
        question: 'Why do I get “No streams found” on every title?',
        answer:
          'You likely don’t have any source-providing addon installed, or the installed addons are failing. Reinstall addons and confirm account sync.',
      },
    ],
    relatedSlugs: ['stremio-addons-explained', 'stremio-account-sync'],
  }),

  article({
    slug: 'stremio-subtitles-not-working',
    title: 'Stremio Subtitles Not Working (Fix + Best Practices)',
    metaTitle: 'Stremio Subtitles Not Working? Fixes + Best Practices',
    description:
      'Fix missing subtitles in Stremio: check subtitle settings, language preferences, and platform-specific playback quirks.',
    category: 'troubleshooting',
    keywords: wordsToKeywords('Stremio Subtitles Not Working', ['subtitles', 'opensubtitles']),
    content: md`
## Common causes
- Subtitles are disabled in the player
- Wrong subtitle language is selected
- The title simply has no subtitles available for your chosen language

## Fix checklist
1) Toggle subtitles off/on while playing
2) Switch subtitle language (try English as a test)
3) Restart Stremio and retry playback
4) If casting, test on-device playback first (casting can behave differently)

## Best practice
Set a default subtitle language, then only change per-title when needed.

## Related
- Buffering: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Why do subtitles work on my phone but not my TV?',
        answer:
          'Playback and subtitle rendering can differ by platform and casting mode. Test on-device playback and verify subtitle settings on that device.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes', 'stremio-chromecast-guide'],
  }),

  article({
    slug: 'stremio-audio-out-of-sync',
    title: 'Stremio Audio Out of Sync: How to Fix It',
    metaTitle: 'Stremio Audio Out of Sync? Fix on TV, Phone, and PC',
    description:
      'Fix audio delay and lip-sync issues in Stremio with device checks, casting tips, and practical troubleshooting steps.',
    category: 'troubleshooting',
    keywords: wordsToKeywords('Stremio Audio Out of Sync', ['audio delay', 'lip sync']),
    content: md`
## Quick answer
Audio sync problems are usually caused by casting, Bluetooth audio latency, or TV audio processing.

## Fix checklist
1) If casting, test playback on the device first
2) Disable Bluetooth audio (as a test) and use TV speakers
3) Disable heavy TV audio processing (surround enhancements)
4) Reboot the playback device

## Related
- Casting tips: [Stremio Chromecast guide](/stremio/stremio-chromecast-guide)
`,
    faqs: [
      {
        question: 'Why does Bluetooth cause delay?',
        answer:
          'Bluetooth codecs add latency. Some speakers/headphones handle sync better than others, but it’s common to see a small delay.',
      },
    ],
    relatedSlugs: ['stremio-chromecast-guide', 'stremio-buffering-fixes'],
  }),

  article({
    slug: 'stremio-on-firestick-setup',
    title: 'Stremio on Firestick: What to Know (Quick Checklist)',
    metaTitle: 'Stremio on Firestick: Quick Setup Checklist + Tips',
    description:
      'A quick, safe checklist for using Stremio on Firestick: performance tips, casting basics, and where to find full setup guides.',
    category: 'setup',
    keywords: wordsToKeywords('Stremio on Firestick', ['fire tv', 'firestick']),
    content: md`
## Use the full Firestick guide
This page is a checklist. For the full step-by-step walkthrough, use:
- [Stremio Firestick setup guide](/guides/stremio/setup/firestick)

## Firestick checklist (fast)
- Keep at least 1–2GB free storage
- Reboot weekly if you stream daily
- Prefer 5GHz Wi‑Fi (or Ethernet via adapter)
- Test playback on-device before casting

## Related
- General buffering: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Does Stremio run well on older Firesticks?',
        answer:
          'Newer Fire TV devices handle HD/4K better. Older models may struggle with heavy playback and multitasking.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes'],
  }),

  article({
    slug: 'stremio-on-android-tv-setup',
    title: 'Stremio on Android TV: Best Settings (2025)',
    metaTitle: 'Stremio on Android TV: Best Settings + Setup Guide (2025)',
    description:
      'Optimize Stremio on Android TV: stability tips, playback settings, and a simple checklist for smooth performance.',
    category: 'setup',
    keywords: wordsToKeywords('Stremio on Android TV', ['android tv', 'settings']),
    content: md`
## Use the full Android TV guide
- [Stremio Android TV setup guide](/guides/stremio/setup/android-tv)

## Best settings checklist
- Keep the OS updated
- Close background apps
- Prefer Ethernet if possible
- Use a stable Wi‑Fi channel (avoid crowded channels)

## Related
- Troubleshooting: [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
`,
    faqs: [
      {
        question: 'Is an Android TV box better than built-in Smart TV apps?',
        answer:
          'Often yes. Dedicated Android TV boxes typically have better performance and longer support than many built-in TV operating systems.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes'],
  }),

  article({
    slug: 'stremio-external-player',
    title: 'Stremio External Player: When to Use One',
    metaTitle: 'Stremio External Player: When It Helps + Setup Tips',
    description:
      'When Stremio playback is unstable, an external player can help. Learn when it matters and what to test first.',
    category: 'best-practices',
    keywords: wordsToKeywords('Stremio External Player', ['vlc', 'player settings']),
    content: md`
## When an external player helps
An external player can help if you’re dealing with:
- Codec compatibility problems
- Subtitle rendering issues
- Audio passthrough quirks

## What to do first
1) Update Stremio
2) Test a different title
3) Confirm your device network is stable

## IPTV Guide players to consider
- [VLC](/players/vlc)
- [Kodi](/players/kodi)

## Related
- Subtitles: [Stremio subtitles not working](/stremio/stremio-subtitles-not-working)
`,
    faqs: [
      {
        question: 'Does an external player fix buffering?',
        answer:
          'Sometimes, but buffering is more often network or source related. Use an external player when you suspect codec/subtitle/player issues.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes', 'stremio-subtitles-not-working'],
  }),

  article({
    slug: 'stremio-local-files',
    title: 'Stremio Local Files: How to Use Your Personal Library',
    metaTitle: 'Stremio Local Files: Organize and Play Personal Media',
    description:
      'Use Stremio as a media center for your personal library: local files basics, best folder structure, and playback tips.',
    category: 'resources',
    keywords: wordsToKeywords('Stremio Local Files', ['personal media', 'local library']),
    content: md`
## What “Local Files” means
Stremio can act as a front-end for media you already own (personal videos, home movies, legally obtained files).

## Best folder structure (simple)
- Movies/
  - Movie Title (Year).mp4
- Series/
  - Show Name/
    - Season 01/
      - S01E01 - Episode Title.mkv

## Playback tips
- Prefer wired storage or fast local network
- Keep filenames consistent
- If subtitles are separate files, keep them next to the video with matching names

## Related
- Subtitles: [Stremio subtitles not working](/stremio/stremio-subtitles-not-working)
`,
    faqs: [
      {
        question: 'Can Stremio replace Plex for a local library?',
        answer:
          'It depends on your needs. Plex is a full media server. Stremio is a lighter media center experience and may be enough for simple local playback.',
      },
    ],
    relatedSlugs: ['stremio-subtitles-not-working'],
  }),

  article({
    slug: 'stremio-privacy-and-safety',
    title: 'Stremio Privacy & Safety Basics',
    metaTitle: 'Stremio Privacy & Safety: What to Check (2025)',
    description:
      'A practical privacy checklist for Stremio users: account security, addon hygiene, and safe streaming habits.',
    category: 'best-practices',
    keywords: wordsToKeywords('Stremio Privacy and Safety', ['privacy', 'security', 'account']),
    content: md`
## Security basics
- Use a strong, unique password
- Keep your devices updated
- Install only addons you trust

## Privacy basics
- Be cautious with third-party addons that request broad permissions
- Prefer minimal addon setups
- Avoid sharing account credentials

## Legal reminder
Use Stremio with legal sources and respect rights in your country.

## Related
- Addons: [Stremio addons explained](/stremio/stremio-addons-explained)
`,
    faqs: [
      {
        question: 'Should I use a VPN with Stremio?',
        answer:
          'A VPN can improve privacy in some scenarios, but it can also reduce speed. Test performance and follow local laws and service terms.',
      },
    ],
    relatedSlugs: ['stremio-addons-explained'],
  }),

  article({
    slug: 'stremio-common-errors',
    title: 'Stremio Common Errors: Quick Fix Index',
    metaTitle: 'Stremio Common Errors (Fix Index): Buffering, Catalog, Sync',
    description:
      'A quick index of common Stremio problems and the fastest fixes: buffering, “no streams found”, subtitle issues, and casting.',
    category: 'troubleshooting',
    keywords: wordsToKeywords('Stremio Common Errors', ['errors', 'fixes']),
    content: md`
## Quick index
- Buffering / stutter → [Stremio buffering fixes](/stremio/stremio-buffering-fixes)
- “No streams found” → [No streams found fixes](/stremio/stremio-no-streams-found)
- Subtitles missing → [Subtitles not working](/stremio/stremio-subtitles-not-working)
- Casting issues → [Chromecast guide](/stremio/stremio-chromecast-guide)
- Account sync weirdness → [Account sync explained](/stremio/stremio-account-sync)

## Need device-specific setup?
Use the Stremio setup guides:
- [Stremio setup for Firestick](/guides/stremio/setup/firestick)
- [Stremio setup for Android TV](/guides/stremio/setup/android-tv)
`,
    faqs: [
      {
        question: 'Where should I start troubleshooting?',
        answer:
          'Start with network and device basics, then isolate whether the issue is title-specific or affects everything.',
      },
    ],
    relatedSlugs: ['stremio-buffering-fixes', 'stremio-no-streams-found', 'stremio-subtitles-not-working'],
  }),

  article({
    slug: 'stremio-resources',
    title: 'Stremio Resources: Official Links + Help',
    metaTitle: 'Stremio Resources: Official Downloads, Help, and Status',
    description:
      'A curated list of official Stremio resources: downloads, support, and helpful links (plus guides on IPTV Guide).',
    category: 'resources',
    keywords: wordsToKeywords('Stremio Resources', ['official', 'download', 'help']),
    content: md`
## Official Stremio links
- Official site: https://www.stremio.com
- Downloads: https://www.stremio.com/downloads

## IPTV Guide shortcuts
- Player overview: [Stremio review](/players/stremio)
- Setup guides: [Stremio setup for Firestick](/guides/stremio/setup/firestick)
- Fixes: [Stremio common errors](/stremio/stremio-common-errors)

## Tip
Bookmark this page and keep your addon list small and intentional.
`,
    faqs: [
      {
        question: 'Where do I find the safest setup?',
        answer:
          'Use official downloads, keep addons minimal, and stick to legal sources. This site’s guides focus on safe, repeatable setups.',
      },
    ],
    relatedSlugs: ['what-is-stremio', 'stremio-addons-explained'],
  }),

  article({
    slug: 'legal-iptv-playlists-how-to-use',
    title: 'How to Use Public IPTV Playlists (M3U) — Legal Basics',
    metaTitle: 'How to Use Public IPTV M3U Playlists (Legal Basics + Steps)',
    description:
      'Learn how to open public M3U playlists in VLC/Kodi, what to check for legality, and how to troubleshoot common playback errors.',
    category: 'resources',
    keywords: wordsToKeywords('How to Use Public IPTV Playlists', ['m3u', 'vlc', 'kodi', 'legal']),
    content: md`
## Quick answer
Public IPTV playlists are just lists of stream URLs. Some are legal, some aren’t. Always verify rights and prefer well-known free streaming TV services.

## Step-by-step (VLC)
1) Copy the M3U URL
2) Open VLC → Media → Open Network Stream
3) Paste the URL → Play

## Step-by-step (Kodi)
Kodi can use IPTV playlists via PVR addons. Use:
- [Kodi player overview](/players/kodi)

## Where to find public playlists
Browse this directory:
- [Public playlists (iptv-org)](/legal-iptv)

## Troubleshooting
- If one channel fails, it may be offline
- If everything fails, it may be a network/device issue
`,
    faqs: [
      {
        question: 'Are public IPTV playlists always legal?',
        answer:
          'No. “Public” means accessible, not automatically licensed. Verify rights and use official FAST services where possible.',
      },
    ],
    relatedSlugs: ['stremio-vs-iptv-player'],
  }),
];

async function main() {
  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(articles, null, 2) + '\n', 'utf-8');
  console.log(`Generated ${articles.length} Stremio articles -> ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
