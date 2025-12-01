#!/usr/bin/env node
/**
 * Generate Comparison Pages
 * Creates Player vs Player and Device vs Device comparisons
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players.json'), 'utf-8'));
const devices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devices.json'), 'utf-8'));

function generatePlayerComparison(player1, player2) {
  const slug = `${player1.slug}-vs-${player2.slug}`;
  const year = new Date().getFullYear();

  // Determine winner for different categories
  const ratingWinner = player1.rating >= player2.rating ? player1 : player2;
  const featureWinner = player1.features.length >= player2.features.length ? player1 : player2;

  const sharedFeatures = player1.features.filter((f) => player2.features.includes(f));
  const player1Only = player1.features.filter((f) => !player2.features.includes(f));
  const player2Only = player2.features.filter((f) => !player1.features.includes(f));

  return {
    slug,
    type: 'player',
    player1Id: player1.id,
    player2Id: player2.id,
    player1Name: player1.name,
    player2Name: player2.name,
    title: `${player1.name} vs ${player2.name} - Which IPTV Player is Better? ${year}`,
    metaTitle: `${player1.name} vs ${player2.name} Comparison ${year} | Best IPTV Player`,
    description: `Detailed comparison of ${player1.name} and ${player2.name} IPTV players. Features, pricing, pros & cons for ${year}.`,
    content: {
      intro: `Choosing between ${player1.name} and ${player2.name}? Both are popular IPTV players, but they have different strengths. This comparison helps you decide which one is right for you.`,
      comparison: {
        rating: {
          player1: player1.rating,
          player2: player2.rating,
          winner: ratingWinner.name,
        },
        pricing: {
          player1: player1.pricing,
          player2: player2.pricing,
          winner:
            player1.pricing.model === 'free'
              ? player1.name
              : player2.pricing.model === 'free'
              ? player2.name
              : 'Tie',
        },
        features: {
          shared: sharedFeatures,
          player1Only,
          player2Only,
          winner: featureWinner.name,
        },
        platforms: {
          player1: player1.platforms,
          player2: player2.platforms,
        },
      },
      player1Summary: {
        name: player1.name,
        description: player1.description,
        pros: player1.pros,
        cons: player1.cons,
        bestFor: `Best for users who need ${player1Only.slice(0, 2).join(' and ') || 'a solid IPTV experience'}`,
      },
      player2Summary: {
        name: player2.name,
        description: player2.description,
        pros: player2.pros,
        cons: player2.cons,
        bestFor: `Best for users who need ${player2Only.slice(0, 2).join(' and ') || 'a reliable player'}`,
      },
      verdict: `${ratingWinner.name} edges out slightly with a ${ratingWinner.rating} rating. However, your choice depends on your specific needs. Choose ${player1.name} if you need ${player1Only[0] || 'its specific features'}. Choose ${player2.name} if ${player2Only[0] || 'cross-platform support'} is important.`,
      faqs: [
        {
          question: `Is ${player1.name} better than ${player2.name}?`,
          answer: `It depends on your needs. ${player1.name} excels at ${player1.pros[0].toLowerCase()}, while ${player2.name} is better for ${player2.pros[0].toLowerCase()}.`,
        },
        {
          question: `Which is cheaper, ${player1.name} or ${player2.name}?`,
          answer:
            player1.pricing.model === 'free'
              ? `${player1.name} is completely free.`
              : player2.pricing.model === 'free'
              ? `${player2.name} is completely free.`
              : `${player1.name} costs ${player1.pricing.price}, while ${player2.name} costs ${player2.pricing.price}.`,
        },
      ],
    },
    relatedGuides: [],
    tags: [player1.slug, player2.slug, 'comparison', 'vs', 'iptv'],
    keywords: [
      `${player1.slug} vs ${player2.slug}`,
      `${player1.name} vs ${player2.name}`,
      `${player1.name} or ${player2.name}`,
      'best iptv player',
      'iptv player comparison',
    ],
    lastUpdated: new Date().toISOString(),
  };
}

function generateDeviceComparison(device1, device2) {
  const slug = `${device1.slug}-vs-${device2.slug}-for-iptv`;
  const year = new Date().getFullYear();

  const player1Count = device1.supportedPlayers.length;
  const player2Count = device2.supportedPlayers.length;
  const appWinner = player1Count >= player2Count ? device1 : device2;

  return {
    slug,
    type: 'device',
    device1Id: device1.id,
    device2Id: device2.id,
    device1Name: device1.name,
    device1ShortName: device1.shortName,
    device2Name: device2.name,
    device2ShortName: device2.shortName,
    title: `${device1.shortName} vs ${device2.shortName} for IPTV - Which is Better? ${year}`,
    metaTitle: `${device1.shortName} vs ${device2.shortName} for IPTV ${year} | Comparison`,
    description: `Compare ${device1.name} and ${device2.name} for IPTV streaming. App support, features, and recommendations for ${year}.`,
    content: {
      intro: `Deciding between ${device1.shortName} and ${device2.shortName} for IPTV? This comparison covers app availability, performance, and which device is better for streaming.`,
      comparison: {
        appSupport: {
          device1: player1Count,
          device2: player2Count,
          winner: appWinner.shortName,
        },
        os: {
          device1: device1.os,
          device2: device2.os,
        },
        pricing: {
          device1: device1.pricing,
          device2: device2.pricing,
        },
        specs: {
          device1: device1.specs,
          device2: device2.specs,
        },
      },
      device1Summary: {
        name: device1.shortName,
        description: device1.description,
        pros: device1.pros,
        cons: device1.cons,
        supportedPlayers: device1.supportedPlayers.slice(0, 5),
      },
      device2Summary: {
        name: device2.shortName,
        description: device2.description,
        pros: device2.pros,
        cons: device2.cons,
        supportedPlayers: device2.supportedPlayers.slice(0, 5),
      },
      verdict: `For IPTV, ${appWinner.shortName} has better app support with ${Math.max(player1Count, player2Count)} compatible players. However, consider ${device1.shortName} for ${device1.pros[0].toLowerCase()} or ${device2.shortName} for ${device2.pros[0].toLowerCase()}.`,
      faqs: [
        {
          question: `Is ${device1.shortName} or ${device2.shortName} better for IPTV?`,
          answer: `${appWinner.shortName} generally has more IPTV app options, but both can work well depending on your needs.`,
        },
        {
          question: `Can I use TiviMate on ${device1.shortName} and ${device2.shortName}?`,
          answer: `TiviMate is available on ${
            device1.supportedPlayers.includes('tivimate') ? device1.shortName : 'Android devices'
          }${device2.supportedPlayers.includes('tivimate') ? ` and ${device2.shortName}` : ''}.`,
        },
      ],
    },
    relatedGuides: [],
    tags: [device1.slug, device2.slug, 'comparison', 'vs', 'iptv', 'streaming'],
    keywords: [
      `${device1.slug} vs ${device2.slug}`,
      `${device1.shortName} vs ${device2.shortName} iptv`,
      `best device for iptv`,
      'iptv streaming device',
    ],
    lastUpdated: new Date().toISOString(),
  };
}

const playerComparisons = [];
const deviceComparisons = [];

// Generate all player combinations (C(n,2))
for (let i = 0; i < players.length; i++) {
  for (let j = i + 1; j < players.length; j++) {
    playerComparisons.push(generatePlayerComparison(players[i], players[j]));
  }
}

// Generate all device combinations (C(n,2))
for (let i = 0; i < devices.length; i++) {
  for (let j = i + 1; j < devices.length; j++) {
    deviceComparisons.push(generateDeviceComparison(devices[i], devices[j]));
  }
}

// Add related guides
const allComparisons = [...playerComparisons, ...deviceComparisons];
allComparisons.forEach((guide) => {
  guide.relatedGuides = allComparisons
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 5)
    .map((g) => g.slug);
});

// Write outputs
fs.writeFileSync(
  path.join(DATA_DIR, 'player-comparisons.json'),
  JSON.stringify(playerComparisons, null, 2)
);
fs.writeFileSync(
  path.join(DATA_DIR, 'device-comparisons.json'),
  JSON.stringify(deviceComparisons, null, 2)
);

console.log(`Generated ${playerComparisons.length + deviceComparisons.length} pages`);
console.log(`  - Player comparisons: ${playerComparisons.length}`);
console.log(`  - Device comparisons: ${deviceComparisons.length}`);
