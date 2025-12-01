#!/usr/bin/env node
/**
 * Generate Player + Device Setup Guides
 * Creates guides like "How to Setup TiviMate on Firestick"
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Load master data
const players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players.json'), 'utf-8'));
const devices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devices.json'), 'utf-8'));

// Platform mapping for compatibility checks
const platformToDevice = {
  'android': ['android-tv', 'nvidia-shield'],
  'firestick': ['firestick', 'fire-tv-cube'],
  'android-tv': ['android-tv', 'chromecast', 'sony-tv', 'nvidia-shield'],
  'ios': ['ios'],
  'apple-tv': ['apple-tv'],
  'windows': ['windows'],
  'mac': ['mac'],
  'linux': ['linux'],
  'smart-tv': ['samsung-tv', 'lg-tv'],
  'samsung-tv': ['samsung-tv'],
  'lg-tv': ['lg-tv'],
  'nvidia-shield': ['nvidia-shield'],
};

function isCompatible(player, device) {
  // Check if player supports this device
  for (const platform of player.platforms) {
    const compatibleDevices = platformToDevice[platform] || [platform];
    if (compatibleDevices.includes(device.id)) {
      return true;
    }
  }
  // Also check device's supported players
  if (device.supportedPlayers && device.supportedPlayers.includes(player.id)) {
    return true;
  }
  return false;
}

function generateSteps(player, device) {
  const steps = [];

  // Device-specific installation steps
  if (['firestick', 'fire-tv-cube'].includes(device.id)) {
    if (player.category === 'free' || player.category === 'open-source') {
      steps.push({
        stepNumber: 1,
        title: 'Enable Apps from Unknown Sources',
        description: `Go to Settings > My Fire TV > Developer Options and enable "Apps from Unknown Sources" to allow sideloading ${player.name}.`,
        tips: ['You may need to enable Developer Options first by clicking on "About" 7 times'],
      });
      steps.push({
        stepNumber: 2,
        title: 'Install Downloader App',
        description: 'Search for "Downloader" in the Amazon App Store and install it. This app lets you download APK files.',
      });
      steps.push({
        stepNumber: 3,
        title: `Download ${player.name}`,
        description: `Open Downloader and enter the URL for ${player.name} APK. Download and install the application.`,
        tips: ['Use a URL shortener for easier typing', 'Make sure to download from official sources only'],
      });
    } else {
      steps.push({
        stepNumber: 1,
        title: `Search for ${player.name}`,
        description: `From the Fire TV home screen, go to the Search icon and type "${player.name}". Select the app from the results.`,
      });
      steps.push({
        stepNumber: 2,
        title: 'Download and Install',
        description: `Click "Get" or "Download" to install ${player.name} on your ${device.shortName}.`,
        tips: ['Installation may take 1-2 minutes depending on your internet speed'],
      });
    }
  } else if (['android-tv', 'chromecast', 'nvidia-shield', 'sony-tv'].includes(device.id)) {
    steps.push({
      stepNumber: 1,
      title: 'Open Google Play Store',
      description: `On your ${device.shortName}, navigate to the Google Play Store from the home screen.`,
    });
    steps.push({
      stepNumber: 2,
      title: `Search for ${player.name}`,
      description: `Use the search function to find "${player.name}" and select it from the results.`,
    });
    steps.push({
      stepNumber: 3,
      title: 'Install the App',
      description: `Click "Install" and wait for the download to complete. ${player.name} will appear in your apps.`,
    });
  } else if (['ios', 'apple-tv'].includes(device.id)) {
    steps.push({
      stepNumber: 1,
      title: 'Open App Store',
      description: `On your ${device.shortName}, open the App Store application.`,
    });
    steps.push({
      stepNumber: 2,
      title: `Search for ${player.name}`,
      description: `Tap the search tab and type "${player.name}". Select the correct app from the results.`,
    });
    steps.push({
      stepNumber: 3,
      title: 'Download and Install',
      description: `Tap "Get" to download ${player.name}. You may need to authenticate with Face ID, Touch ID, or your Apple ID password.`,
    });
  } else if (['windows', 'mac', 'linux'].includes(device.id)) {
    steps.push({
      stepNumber: 1,
      title: 'Download the Installer',
      description: `Visit the official ${player.name} website and download the ${device.shortName} installer.`,
      tips: ['Always download from official sources to avoid malware'],
    });
    steps.push({
      stepNumber: 2,
      title: 'Run the Installer',
      description: `Open the downloaded file and follow the installation wizard to install ${player.name}.`,
    });
    steps.push({
      stepNumber: 3,
      title: 'Launch the Application',
      description: `Find ${player.name} in your applications folder or start menu and launch it.`,
    });
  } else if (['samsung-tv', 'lg-tv'].includes(device.id)) {
    steps.push({
      stepNumber: 1,
      title: 'Open the App Store',
      description: `On your ${device.shortName}, navigate to the built-in app store (${device.id === 'samsung-tv' ? 'Samsung Apps' : 'LG Content Store'}).`,
    });
    steps.push({
      stepNumber: 2,
      title: `Search for ${player.name}`,
      description: `Use the search function to find "${player.name}". Note that Smart TV app availability may be limited.`,
      tips: ['If the app is not available, consider using a streaming device like Firestick'],
    });
  }

  // Common playlist setup steps
  const playlistStep = steps.length + 1;
  steps.push({
    stepNumber: playlistStep,
    title: 'Add Your IPTV Playlist',
    description: `Open ${player.name} and navigate to the playlist or settings section. You can add your M3U playlist URL or Xtream Codes credentials here.`,
    tips: [
      'Have your M3U URL or Xtream login details ready',
      'Some players support both M3U and Xtream formats',
    ],
  });

  // EPG setup if supported
  if (player.features.includes('epg')) {
    steps.push({
      stepNumber: playlistStep + 1,
      title: 'Configure EPG (TV Guide)',
      description: `In ${player.name} settings, find the EPG section and add your EPG URL. This will show program schedules for your channels.`,
      tips: ['EPG URL is usually provided by your IPTV service', 'Allow time for EPG data to load (can take several minutes)'],
    });
  }

  // Final step
  steps.push({
    stepNumber: steps.length + 1,
    title: 'Start Watching',
    description: `Once your playlist is loaded, browse through the channel categories and start watching your favorite content on ${player.name}!`,
    tips: ['Mark frequently watched channels as favorites', 'Explore the settings for more customization options'],
  });

  return steps;
}

function generateFAQs(player, device) {
  return [
    {
      question: `Is ${player.name} free on ${device.shortName}?`,
      answer: player.pricing.model === 'free'
        ? `Yes, ${player.name} is completely free to use on ${device.shortName}.`
        : player.pricing.model === 'freemium'
        ? `${player.name} offers a free version with basic features. Premium features require a ${player.pricing.price} purchase.`
        : `${player.name} is a paid app costing ${player.pricing.price} on ${device.shortName}.`,
    },
    {
      question: `Does ${player.name} support EPG on ${device.shortName}?`,
      answer: player.features.includes('epg')
        ? `Yes, ${player.name} fully supports EPG (Electronic Program Guide) on ${device.shortName}. You can add your EPG URL in the settings.`
        : `Unfortunately, ${player.name} does not have built-in EPG support.`,
    },
    {
      question: `Can I record with ${player.name} on ${device.shortName}?`,
      answer: player.features.includes('recording')
        ? `Yes, ${player.name} supports recording functionality on ${device.shortName}. You'll need sufficient storage space.`
        : `No, ${player.name} does not currently support recording on ${device.shortName}.`,
    },
    {
      question: `Why is ${player.name} buffering on my ${device.shortName}?`,
      answer: `Buffering on ${device.shortName} is usually caused by slow internet, server issues, or ISP throttling. Try using ethernet instead of Wi-Fi, or use a VPN to bypass throttling.`,
    },
  ];
}

function generateGuide(player, device) {
  const slug = `${player.slug}-setup-${device.slug}`;
  const year = new Date().getFullYear();

  return {
    slug,
    playerId: player.id,
    deviceId: device.id,
    playerName: player.name,
    deviceName: device.name,
    deviceShortName: device.shortName,
    title: `How to Setup ${player.name} on ${device.shortName}`,
    metaTitle: `${player.name} on ${device.shortName} - Setup Guide ${year} | Step-by-Step`,
    description: `Complete guide to install and configure ${player.name} on ${device.name}. Step-by-step instructions for ${year} with troubleshooting tips.`,
    content: {
      intro: `Looking to set up ${player.name} on your ${device.name}? This comprehensive guide walks you through the complete installation process, from downloading the app to configuring your first IPTV playlist. ${player.name} is ${player.shortDescription.toLowerCase()}, and it works great on ${device.shortName}.`,
      requirements: [
        `${device.name} device`,
        'Active internet connection',
        'IPTV subscription with M3U or Xtream credentials',
        ...(player.features.includes('epg') ? ['EPG URL (optional, for TV guide)'] : []),
      ],
      steps: generateSteps(player, device),
      troubleshooting: [
        'If the app won\'t install, check your device storage space',
        'For playback issues, try clearing the app cache',
        'If channels don\'t load, verify your playlist URL is correct',
        'For buffering, use ethernet instead of Wi-Fi when possible',
      ],
      faqs: generateFAQs(player, device),
      conclusion: `You've successfully set up ${player.name} on your ${device.shortName}! With ${player.features.length} key features including ${player.features.slice(0, 3).join(', ')}, you're ready to enjoy your IPTV content. If you experience any issues, check our troubleshooting section or explore our other guides.`,
    },
    relatedGuides: [],
    tags: [player.slug, device.slug, 'setup', 'iptv', 'guide', ...player.keywords.slice(0, 3)],
    keywords: [
      `${player.slug} ${device.slug}`,
      `${player.name} on ${device.shortName}`,
      `install ${player.name} ${device.shortName}`,
      `${player.name} setup guide`,
      `${device.shortName} iptv player`,
      ...player.keywords,
    ],
    lastUpdated: new Date().toISOString(),
    playerRating: player.rating,
    playerPricing: player.pricing,
  };
}

// Generate all compatible combinations
const guides = [];

players.forEach((player) => {
  devices.forEach((device) => {
    if (isCompatible(player, device)) {
      guides.push(generateGuide(player, device));
    }
  });
});

// Add related guides
guides.forEach((guide) => {
  // Find other guides for same player
  const samePlayer = guides
    .filter((g) => g.playerId === guide.playerId && g.slug !== guide.slug)
    .slice(0, 3)
    .map((g) => g.slug);

  // Find other guides for same device
  const sameDevice = guides
    .filter((g) => g.deviceId === guide.deviceId && g.slug !== guide.slug)
    .slice(0, 3)
    .map((g) => g.slug);

  guide.relatedGuides = [...new Set([...samePlayer, ...sameDevice])].slice(0, 5);
});

// Write output
const outputPath = path.join(DATA_DIR, 'player-device-guides.json');
fs.writeFileSync(outputPath, JSON.stringify(guides, null, 2));

console.log(`Generated ${guides.length} pages`);
console.log(`Output: ${outputPath}`);
