#!/usr/bin/env node
/**
 * Generate Troubleshooting Guides
 * Creates guides for Player + Issue and Device + Issue combinations
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players.json'), 'utf-8'));
const devices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devices.json'), 'utf-8'));
const issues = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'issues.json'), 'utf-8'));

function generatePlayerIssueGuide(player, issue) {
  const slug = `${player.slug}-${issue.slug}`;
  const year = new Date().getFullYear();

  return {
    slug,
    type: 'player',
    playerId: player.id,
    issueId: issue.id,
    playerName: player.name,
    issueName: issue.name,
    title: `Fix ${player.name} ${issue.name} - Troubleshooting Guide ${year}`,
    metaTitle: `${player.name} ${issue.name} Fix ${year} | Troubleshooting`,
    description: `Experiencing ${issue.name.toLowerCase()} with ${player.name}? This guide provides solutions to fix ${issue.slug} issues in ${year}.`,
    content: {
      intro: `${issue.name} in ${player.name} can be frustrating, but most issues are easy to fix. This guide covers the most common causes and solutions specific to ${player.name}.`,
      severity: issue.severity,
      commonCauses: issue.commonCauses,
      solutions: [
        ...issue.generalSolutions,
        `Clear ${player.name} cache: Go to Settings > Apps > ${player.name} > Clear Cache`,
        `Update ${player.name} to the latest version`,
        `Try reinstalling ${player.name} if issues persist`,
      ],
      playerSpecificTips: [
        player.features.includes('external-player')
          ? `Try using ${player.name}'s external player option if playback issues persist`
          : null,
        `Check ${player.name} settings for buffer size adjustments`,
        `Visit ${player.officialUrl || 'the official website'} for known issues`,
      ].filter(Boolean),
      faqs: [
        {
          question: `Why does ${player.name} keep ${issue.slug.replace(/-/g, ' ')}?`,
          answer: `${issue.name} in ${player.name} is usually caused by: ${issue.commonCauses.slice(0, 3).join(', ')}. Check our solutions above.`,
        },
        {
          question: `How do I fix ${issue.slug.replace(/-/g, ' ')} in ${player.name}?`,
          answer: `Start by clearing the app cache, then check your internet connection. If the issue persists, try the solutions listed in this guide.`,
        },
      ],
      conclusion: `Most ${issue.name.toLowerCase()} issues in ${player.name} can be resolved with the solutions above. If problems continue, consider contacting your IPTV provider or trying an alternative player.`,
    },
    relatedGuides: [],
    tags: [player.slug, issue.slug, 'troubleshooting', 'fix', 'iptv'],
    keywords: [
      `${player.name} ${issue.slug}`,
      `fix ${player.name} ${issue.slug}`,
      `${player.name} not working`,
      ...issue.keywords,
    ],
    lastUpdated: new Date().toISOString(),
  };
}

function generateDeviceIssueGuide(device, issue) {
  const slug = `${device.slug}-${issue.slug}`;
  const year = new Date().getFullYear();

  return {
    slug,
    type: 'device',
    deviceId: device.id,
    issueId: issue.id,
    deviceName: device.name,
    deviceShortName: device.shortName,
    issueName: issue.name,
    title: `Fix IPTV ${issue.name} on ${device.shortName} - ${year} Guide`,
    metaTitle: `${device.shortName} IPTV ${issue.name} Fix ${year} | Solutions`,
    description: `Having ${issue.name.toLowerCase()} with IPTV on ${device.name}? Complete troubleshooting guide with solutions for ${year}.`,
    content: {
      intro: `${issue.name} when using IPTV on ${device.shortName} is a common problem. This guide covers ${device.shortName}-specific solutions to get your streaming working smoothly.`,
      severity: issue.severity,
      commonCauses: issue.commonCauses,
      solutions: [
        ...issue.generalSolutions,
        `Restart your ${device.shortName}`,
        `Check ${device.shortName} for system updates`,
        device.specs.connectivity.includes('Ethernet')
          ? 'Use ethernet instead of Wi-Fi for better stability'
          : 'Move closer to your Wi-Fi router',
      ],
      deviceSpecificTips: [
        ['firestick', 'fire-tv-cube'].includes(device.id)
          ? 'Clear Fire TV cache: Settings > Applications > Manage Installed Applications'
          : null,
        ['android-tv', 'nvidia-shield', 'sony-tv'].includes(device.id)
          ? 'Try Developer Options > Force GPU rendering'
          : null,
        ['samsung-tv', 'lg-tv'].includes(device.id)
          ? 'Smart TVs have limited troubleshooting options - consider a streaming device'
          : null,
      ].filter(Boolean),
      recommendedPlayers: device.supportedPlayers.slice(0, 3),
      faqs: [
        {
          question: `Why is IPTV ${issue.slug.replace(/-/g, ' ')} on my ${device.shortName}?`,
          answer: `${issue.name} on ${device.shortName} is typically caused by: ${issue.commonCauses.slice(0, 3).join(', ')}.`,
        },
        {
          question: `What's the best IPTV player to avoid ${issue.slug.replace(/-/g, ' ')} on ${device.shortName}?`,
          answer: `For ${device.shortName}, we recommend ${device.supportedPlayers[0] || 'checking our player guides'} for the most stable experience.`,
        },
      ],
      conclusion: `${issue.name} on ${device.shortName} can usually be fixed with the solutions above. If issues persist, try a different IPTV player or contact your service provider.`,
    },
    relatedGuides: [],
    tags: [device.slug, issue.slug, 'troubleshooting', 'fix', 'iptv'],
    keywords: [
      `${device.shortName} iptv ${issue.slug}`,
      `fix iptv ${issue.slug} ${device.shortName}`,
      `${device.shortName} streaming issues`,
      ...issue.keywords,
    ],
    lastUpdated: new Date().toISOString(),
  };
}

const playerGuides = [];
const deviceGuides = [];

// Generate player + issue combinations
players.forEach((player) => {
  issues.forEach((issue) => {
    if (issue.affectedPlayers.includes(player.id)) {
      playerGuides.push(generatePlayerIssueGuide(player, issue));
    }
  });
});

// Generate device + issue combinations
devices.forEach((device) => {
  issues.forEach((issue) => {
    if (issue.affectedDevices.includes(device.id)) {
      deviceGuides.push(generateDeviceIssueGuide(device, issue));
    }
  });
});

// Add related guides
[...playerGuides, ...deviceGuides].forEach((guide) => {
  const allGuides = [...playerGuides, ...deviceGuides];
  guide.relatedGuides = allGuides
    .filter((g) => g.issueId === guide.issueId && g.slug !== guide.slug)
    .slice(0, 5)
    .map((g) => g.slug);
});

// Write outputs
fs.writeFileSync(
  path.join(DATA_DIR, 'player-troubleshooting.json'),
  JSON.stringify(playerGuides, null, 2)
);
fs.writeFileSync(
  path.join(DATA_DIR, 'device-troubleshooting.json'),
  JSON.stringify(deviceGuides, null, 2)
);

console.log(`Generated ${playerGuides.length + deviceGuides.length} pages`);
console.log(`  - Player troubleshooting: ${playerGuides.length}`);
console.log(`  - Device troubleshooting: ${deviceGuides.length}`);
