#!/usr/bin/env node
/**
 * Generate Device + Feature Guides
 * Creates guides like "How to Record IPTV on Firestick"
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const devices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devices.json'), 'utf-8'));
const features = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'features.json'), 'utf-8'));

function generateGuide(device, feature) {
  const slug = `${device.slug}-${feature.slug}`;
  const year = new Date().getFullYear();

  const isSupported = feature.supportedDevices.includes(device.id);
  const recommendedPlayers = device.supportedPlayers.filter((p) =>
    feature.supportedPlayers.includes(p)
  );

  return {
    slug,
    deviceId: device.id,
    featureId: feature.id,
    deviceName: device.name,
    deviceShortName: device.shortName,
    featureName: feature.name,
    featureShortName: feature.shortName,
    isSupported,
    title: isSupported
      ? `${feature.shortName} on ${device.shortName} - Complete Guide ${year}`
      : `Can You Use ${feature.shortName} on ${device.shortName}?`,
    metaTitle: `${feature.shortName} on ${device.shortName} Guide ${year} | IPTV Tutorial`,
    description: isSupported
      ? `Learn how to use ${feature.name} on your ${device.name}. Best apps and settings for ${year}.`
      : `Discover if ${device.name} supports ${feature.name} and what alternatives exist.`,
    content: {
      intro: isSupported
        ? `Want to use ${feature.name} on your ${device.shortName}? This guide covers the best apps and settings to get ${feature.shortName} working perfectly on ${device.name}.`
        : `${device.name} has limited support for ${feature.name}. Let's explore what options are available.`,
      recommendedPlayers: recommendedPlayers,
      benefits: feature.benefits,
      requirements: [
        device.name,
        ...feature.requirements,
        ...(recommendedPlayers.length > 0 ? [`One of: ${recommendedPlayers.join(', ')}`] : []),
      ],
      steps: isSupported
        ? [
            {
              stepNumber: 1,
              title: 'Install a Compatible IPTV Player',
              description: `For ${feature.shortName} on ${device.shortName}, we recommend: ${recommendedPlayers.slice(0, 3).join(', ') || 'Check our player guides'}.`,
            },
            {
              stepNumber: 2,
              title: 'Configure Your IPTV Service',
              description: `Add your M3U playlist or Xtream credentials to the player.`,
            },
            {
              stepNumber: 3,
              title: `Enable ${feature.shortName}`,
              description: `Navigate to the player's settings and look for ${feature.shortName} options. Enable and configure as needed.`,
            },
            {
              stepNumber: 4,
              title: 'Test the Feature',
              description: `Try using ${feature.shortName} to make sure everything is working correctly.`,
            },
          ]
        : [
            {
              stepNumber: 1,
              title: 'Consider Alternative Devices',
              description: `Devices that support ${feature.name} include: ${feature.supportedDevices.slice(0, 5).join(', ')}.`,
            },
          ],
      faqs: [
        {
          question: `Can I use ${feature.shortName} on ${device.shortName}?`,
          answer: isSupported
            ? `Yes! ${device.shortName} supports ${feature.name} through apps like ${recommendedPlayers[0] || 'various IPTV players'}.`
            : `${device.shortName} has limited support for ${feature.name}. Consider using ${feature.supportedDevices[0]} instead.`,
        },
        {
          question: `What's the best app for ${feature.shortName} on ${device.shortName}?`,
          answer: recommendedPlayers.length > 0
            ? `For ${feature.shortName} on ${device.shortName}, we recommend ${recommendedPlayers[0]}. It has excellent ${feature.shortName} support.`
            : `Check our player comparison guides to find the best option for your needs.`,
        },
      ],
      conclusion: isSupported
        ? `${feature.name} works great on ${device.shortName} with the right app. Follow our steps above to get started.`
        : `While ${device.shortName} doesn't fully support ${feature.name}, there are alternatives worth considering.`,
    },
    relatedGuides: [],
    tags: [device.slug, feature.slug, 'guide', 'iptv', 'how-to'],
    keywords: [
      `${feature.slug} ${device.slug}`,
      `${feature.shortName} on ${device.shortName}`,
      `${device.shortName} ${feature.shortName}`,
      ...feature.keywords,
    ],
    lastUpdated: new Date().toISOString(),
    difficulty: feature.difficulty,
  };
}

const guides = [];

devices.forEach((device) => {
  features.forEach((feature) => {
    guides.push(generateGuide(device, feature));
  });
});

guides.forEach((guide) => {
  const related = guides
    .filter((g) => (g.deviceId === guide.deviceId || g.featureId === guide.featureId) && g.slug !== guide.slug)
    .slice(0, 5)
    .map((g) => g.slug);
  guide.relatedGuides = related;
});

const outputPath = path.join(DATA_DIR, 'device-feature-guides.json');
fs.writeFileSync(outputPath, JSON.stringify(guides, null, 2));

console.log(`Generated ${guides.length} pages`);
