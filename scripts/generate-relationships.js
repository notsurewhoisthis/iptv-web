const fs = require('fs');
const path = require('path');

// Read JSON files
const playersPath = path.join(__dirname, '../data/players.json');
const devicesPath = path.join(__dirname, '../data/devices.json');
const guidesPath = path.join(__dirname, '../data/technical-guides.json');

const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
const devices = JSON.parse(fs.readFileSync(devicesPath, 'utf8'));
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

// Helper: Calculate platform overlap between two players
function platformOverlap(p1, p2) {
  const set1 = new Set(p1.platforms || []);
  return (p2.platforms || []).filter(p => set1.has(p)).length;
}

// Helper: Calculate feature overlap
function featureOverlap(p1, p2) {
  const set1 = new Set(p1.features || []);
  return (p2.features || []).filter(f => set1.has(f)).length;
}

// Generate related players for each player
function generateRelatedPlayers() {
  console.log('Generating related players...');

  players.forEach(player => {
    const scores = players
      .filter(p => p.id !== player.id)
      .map(p => {
        let score = 0;

        // Same category = +3
        if (p.category === player.category) score += 3;

        // Platform overlap = +2 per platform
        score += platformOverlap(player, p) * 2;

        // Feature overlap = +1 per feature
        score += featureOverlap(player, p);

        return { id: p.id, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.id);

    player.relatedPlayers = scores;

    // Also determine best devices for this player based on platforms
    const platformToDevice = {
      'ios': 'ios',
      'apple-tv': 'apple-tv',
      'mac': 'mac',
      'android': 'android-tv',
      'firestick': 'firestick',
      'android-tv': 'android-tv',
      'nvidia-shield': 'nvidia-shield',
      'windows': 'windows',
      'linux': 'linux',
      'smart-tv': 'samsung-tv',
      'samsung-tv': 'samsung-tv',
      'lg-tv': 'lg-tv',
    };

    const relatedDevices = [...new Set(
      (player.platforms || [])
        .map(p => platformToDevice[p])
        .filter(Boolean)
    )].slice(0, 5);

    player.relatedDevices = relatedDevices;
  });

  console.log(`  Added relationships to ${players.length} players`);
}

// Generate related devices for each device
function generateRelatedDevices() {
  console.log('Generating related devices...');

  devices.forEach(device => {
    const scores = devices
      .filter(d => d.id !== device.id)
      .map(d => {
        let score = 0;

        // Same category = +5
        if (d.category === device.category) score += 5;

        // Same brand = +3
        if (d.brand === device.brand) score += 3;

        // Same OS = +2
        if (d.os === device.os) score += 2;

        return { id: d.id, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.id);

    device.relatedDevices = scores;

    // Determine relevant guides for this device
    const guideKeywords = {
      'firestick': ['sideload-apps-firestick', 'fix-iptv-buffering', 'setup-epg-guide'],
      'fire-tv-cube': ['sideload-apps-firestick', 'fix-iptv-buffering', 'setup-epg-guide'],
      'apple-tv': ['fix-iptv-buffering', 'setup-epg-guide', 'stremio-apple-tv-complete-guide'],
      'android-tv': ['fix-iptv-buffering', 'setup-epg-guide', 'google-tv-iptv'],
      'nvidia-shield': ['fix-iptv-buffering', 'setup-epg-guide', 'google-tv-iptv'],
      'samsung-tv': ['iptv-samsung-smart-tv', 'fix-iptv-buffering', 'setup-epg-guide'],
      'lg-tv': ['iptv-lg-smart-tv', 'fix-iptv-buffering', 'setup-epg-guide'],
      'chromecast': ['cast-iptv-to-chromecast', 'chromecast-iptv', 'tivimate-chromecast'],
      'google-tv': ['google-tv-iptv', 'fix-iptv-buffering', 'setup-epg-guide'],
      'windows': ['fix-iptv-buffering', 'setup-epg-guide', 'm3u-playlist-complete-guide'],
      'mac': ['fix-iptv-buffering', 'setup-epg-guide', 'm3u-playlist-complete-guide'],
      'linux': ['iptv-linux-setup', 'best-iptv-player-linux', 'fix-iptv-buffering'],
      'ios': ['fix-iptv-buffering', 'setup-epg-guide', 'stremio-ios-complete-guide'],
      'mag-box': ['mag-box-setup-guide', 'fix-iptv-buffering', 'xtream-codes-setup'],
      'roku': ['fix-iptv-buffering', 'setup-epg-guide'],
    };

    // Get category-based guides
    const categoryGuides = {
      'streaming-box': ['fix-iptv-buffering', 'setup-epg-guide', 'xtream-codes-complete-guide'],
      'smart-tv': ['fix-iptv-buffering', 'setup-epg-guide', 'xtream-codes-complete-guide'],
      'iptv-box': ['fix-iptv-buffering', 'setup-epg-guide', 'xtream-codes-complete-guide', 'mag-box-setup-guide'],
      'mobile': ['fix-iptv-buffering', 'setup-epg-guide'],
      'computer': ['fix-iptv-buffering', 'setup-epg-guide', 'm3u-playlist-complete-guide'],
      'gaming-console': ['fix-iptv-buffering'],
    };

    const deviceGuides = guideKeywords[device.slug] || categoryGuides[device.category] || ['fix-iptv-buffering', 'setup-epg-guide'];
    device.relatedGuides = [...new Set(deviceGuides)].slice(0, 4);
  });

  console.log(`  Added relationships to ${devices.length} devices`);
}

// Generate relationships for technical guides
function generateGuideRelationships() {
  console.log('Generating guide relationships...');

  const guideCategories = {
    'setup': ['xtream-codes-complete-guide', 'm3u-playlist-complete-guide', 'xtream-codes-setup', 'setup-epg-guide', 'setup-vpn-for-iptv', 'sideload-apps-firestick'],
    'troubleshooting': ['fix-iptv-buffering', 'm3u-playlist-not-working', 'xtream-codes-errors', 'iptv-no-channels-fix'],
    'platform-specific': ['iptv-samsung-smart-tv', 'iptv-lg-smart-tv', 'iptv-linux-setup', 'google-tv-iptv', 'chromecast-iptv', 'tivimate-chromecast', 'mag-box-setup-guide'],
    'stremio': ['stremio-android-complete-guide', 'stremio-ios-complete-guide', 'stremio-apple-tv-complete-guide'],
    'advanced': ['record-iptv-guide', 'multi-room-iptv-setup', 'cast-iptv-to-chromecast'],
  };

  // Determine which players are relevant to each guide
  const guideToPlayers = {
    'tivimate-chromecast': ['tivimate'],
    'stremio-android-complete-guide': ['stremio'],
    'stremio-ios-complete-guide': ['stremio'],
    'stremio-apple-tv-complete-guide': ['stremio'],
    'xtream-codes-complete-guide': ['tivimate', 'iptv-smarters', 'ott-navigator', 'duplex-iptv'],
    'm3u-playlist-complete-guide': ['vlc', 'kodi', 'iptv-smarters', 'tivimate'],
    'setup-epg-guide': ['tivimate', 'iptv-smarters', 'perfect-player', 'ott-navigator'],
    'fix-iptv-buffering': ['tivimate', 'kodi', 'vlc', 'iptv-smarters'],
    'record-iptv-guide': ['tivimate', 'kodi', 'perfect-player'],
  };

  // Determine which devices are relevant to each guide
  const guideToDevices = {
    'sideload-apps-firestick': ['firestick', 'fire-tv-cube'],
    'iptv-samsung-smart-tv': ['samsung-tv'],
    'iptv-lg-smart-tv': ['lg-tv'],
    'iptv-linux-setup': ['linux'],
    'best-iptv-player-linux': ['linux'],
    'google-tv-iptv': ['google-tv', 'chromecast'],
    'chromecast-iptv': ['chromecast', 'google-tv'],
    'tivimate-chromecast': ['chromecast', 'firestick', 'android-tv'],
    'cast-iptv-to-chromecast': ['chromecast', 'google-tv'],
    'stremio-android-complete-guide': ['android-tv', 'firestick', 'nvidia-shield'],
    'stremio-ios-complete-guide': ['ios'],
    'stremio-apple-tv-complete-guide': ['apple-tv'],
    'mag-box-setup-guide': ['mag-box'],
    'multi-room-iptv-setup': ['firestick', 'android-tv', 'apple-tv', 'smart-tv'],
  };

  guides.forEach(guide => {
    // Find related guides by category
    let category = 'setup';
    for (const [cat, slugs] of Object.entries(guideCategories)) {
      if (slugs.includes(guide.slug)) {
        category = cat;
        break;
      }
    }

    const relatedGuides = guideCategories[category]
      ?.filter(s => s !== guide.slug)
      .slice(0, 4) || [];

    guide.relatedGuides = relatedGuides;
    guide.relatedPlayers = guideToPlayers[guide.slug] || ['tivimate', 'kodi', 'iptv-smarters'];
    guide.relatedDevices = guideToDevices[guide.slug] || ['firestick', 'android-tv', 'samsung-tv'];
  });

  console.log(`  Added relationships to ${guides.length} guides`);
}

// Run all generators
generateRelatedPlayers();
generateRelatedDevices();
generateGuideRelationships();

// Write back to files
fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
fs.writeFileSync(devicesPath, JSON.stringify(devices, null, 2));
fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));

console.log('\n✅ All relationships generated and saved!');
console.log(`   - Players: ${players.length} entries with relatedPlayers & relatedDevices`);
console.log(`   - Devices: ${devices.length} entries with relatedDevices & relatedGuides`);
console.log(`   - Guides: ${guides.length} entries with relatedGuides, relatedPlayers & relatedDevices`);
