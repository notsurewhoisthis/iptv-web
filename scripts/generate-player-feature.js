#!/usr/bin/env node
/**
 * Generate Player + Feature Guides
 * Creates guides like "TiviMate EPG Setup Guide"
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players.json'), 'utf-8'));
const features = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'features.json'), 'utf-8'));

function generateGuide(player, feature) {
  const slug = `${player.slug}-${feature.slug}`;
  const year = new Date().getFullYear();

  const hasFeature = player.features.includes(feature.id);

  return {
    slug,
    playerId: player.id,
    featureId: feature.id,
    playerName: player.name,
    featureName: feature.name,
    featureShortName: feature.shortName,
    hasFeature,
    title: hasFeature
      ? `${player.name} ${feature.shortName} Guide - Complete Setup Tutorial`
      : `${feature.shortName} on ${player.name} - Alternatives & Solutions`,
    metaTitle: `${player.name} ${feature.shortName} Setup Guide ${year} | Tutorial`,
    description: hasFeature
      ? `Learn how to set up and use ${feature.name} in ${player.name}. Complete ${year} guide with step-by-step instructions.`
      : `${player.name} doesn't support ${feature.name}. Discover alternatives and workarounds in our ${year} guide.`,
    content: {
      intro: hasFeature
        ? `${player.name} offers excellent ${feature.name} support. This guide will show you how to configure and get the most out of ${feature.shortName} features in ${player.name}.`
        : `While ${player.name} is a great IPTV player, it currently doesn't support ${feature.name}. In this guide, we'll explore alternatives and workarounds.`,
      benefits: feature.benefits,
      requirements: hasFeature ? feature.requirements : ['Alternative IPTV player with this feature'],
      steps: hasFeature
        ? [
            {
              stepNumber: 1,
              title: `Open ${player.name} Settings`,
              description: `Launch ${player.name} and navigate to the Settings or Preferences menu.`,
            },
            {
              stepNumber: 2,
              title: `Find ${feature.shortName} Options`,
              description: `Look for the ${feature.shortName} section in the settings. This may be under Playback, Interface, or a dedicated section.`,
            },
            {
              stepNumber: 3,
              title: `Configure ${feature.shortName}`,
              description: `Adjust the ${feature.shortName} settings according to your preferences. Enable the feature if it's disabled.`,
            },
            {
              stepNumber: 4,
              title: 'Save and Test',
              description: `Save your settings and test the ${feature.shortName} functionality by playing a channel.`,
            },
          ]
        : [
            {
              stepNumber: 1,
              title: 'Consider Alternative Players',
              description: `Players that support ${feature.name} include: ${feature.supportedPlayers.slice(0, 5).join(', ')}.`,
            },
          ],
      faqs: [
        {
          question: `Does ${player.name} support ${feature.shortName}?`,
          answer: hasFeature
            ? `Yes, ${player.name} fully supports ${feature.name}. You can configure it in the settings.`
            : `No, ${player.name} currently doesn't support ${feature.name}. Consider using ${feature.supportedPlayers[0]} as an alternative.`,
        },
        {
          question: `How do I enable ${feature.shortName} in ${player.name}?`,
          answer: hasFeature
            ? `Go to Settings > ${feature.category === 'playback' ? 'Playback' : feature.category === 'management' ? 'Playlist' : 'Interface'} and look for the ${feature.shortName} option.`
            : `${feature.shortName} is not available in ${player.name}. You would need to use a different player.`,
        },
      ],
      conclusion: hasFeature
        ? `${feature.name} is a powerful feature in ${player.name} that enhances your viewing experience. Follow the steps above to get it configured properly.`
        : `While ${player.name} doesn't support ${feature.name}, there are excellent alternatives available. Check out ${feature.supportedPlayers[0]} for this functionality.`,
    },
    relatedGuides: [],
    tags: [player.slug, feature.slug, 'feature', 'tutorial', 'iptv'],
    keywords: [
      `${player.slug} ${feature.slug}`,
      `${player.name} ${feature.shortName}`,
      `${feature.shortName} ${player.name}`,
      ...feature.keywords,
    ],
    lastUpdated: new Date().toISOString(),
    difficulty: feature.difficulty,
  };
}

const guides = [];

players.forEach((player) => {
  features.forEach((feature) => {
    // Generate guide for all combinations (including unsupported for SEO)
    guides.push(generateGuide(player, feature));
  });
});

// Add related guides
guides.forEach((guide) => {
  const related = guides
    .filter((g) => (g.playerId === guide.playerId || g.featureId === guide.featureId) && g.slug !== guide.slug)
    .slice(0, 5)
    .map((g) => g.slug);
  guide.relatedGuides = related;
});

const outputPath = path.join(DATA_DIR, 'player-feature-guides.json');
fs.writeFileSync(outputPath, JSON.stringify(guides, null, 2));

console.log(`Generated ${guides.length} pages`);
