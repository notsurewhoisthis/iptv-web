#!/usr/bin/env node
/**
 * Generate "Best Player for Device" Pages
 * Creates pages like "Best IPTV Player for Firestick"
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const players = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players.json'), 'utf-8'));
const devices = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'devices.json'), 'utf-8'));

function generateBestForPage(device) {
  const slug = `best-iptv-player-${device.slug}`;
  const year = new Date().getFullYear();

  // Get compatible players and rank them
  const compatiblePlayers = players.filter((p) => device.supportedPlayers.includes(p.id));

  // Sort by rating and feature count
  const rankedPlayers = compatiblePlayers
    .map((p) => ({
      ...p,
      score: p.rating * 10 + p.features.length,
    }))
    .sort((a, b) => b.score - a.score);

  const topPick = rankedPlayers[0];
  const runnerUp = rankedPlayers[1];
  const budgetPick = rankedPlayers.find((p) => p.pricing.model === 'free') || rankedPlayers[rankedPlayers.length - 1];

  return {
    slug,
    deviceId: device.id,
    deviceName: device.name,
    deviceShortName: device.shortName,
    title: `Best IPTV Player for ${device.shortName} ${year} - Top ${Math.min(rankedPlayers.length, 5)} Picks`,
    metaTitle: `Best IPTV Player for ${device.shortName} ${year} | Top Picks Ranked`,
    description: `Find the best IPTV player for ${device.name} in ${year}. We compare ${rankedPlayers.length} apps and rank them by features, reliability, and value.`,
    content: {
      intro: `Looking for the best IPTV player for your ${device.shortName}? We've tested and ranked the top options available for ${device.name} to help you choose the perfect app for your streaming needs.`,
      topPick: topPick
        ? {
            name: topPick.name,
            slug: topPick.slug,
            rating: topPick.rating,
            description: topPick.description,
            features: topPick.features,
            pricing: topPick.pricing,
            pros: topPick.pros,
            cons: topPick.cons,
            whyTopPick: `${topPick.name} earns our top spot for ${device.shortName} thanks to ${topPick.pros[0].toLowerCase()} and ${topPick.pros[1]?.toLowerCase() || 'excellent overall performance'}.`,
          }
        : null,
      runnerUp: runnerUp
        ? {
            name: runnerUp.name,
            slug: runnerUp.slug,
            rating: runnerUp.rating,
            description: runnerUp.shortDescription,
            pricing: runnerUp.pricing,
            pros: runnerUp.pros.slice(0, 3),
          }
        : null,
      budgetPick:
        budgetPick && budgetPick.id !== topPick?.id
          ? {
              name: budgetPick.name,
              slug: budgetPick.slug,
              rating: budgetPick.rating,
              description: budgetPick.shortDescription,
              pricing: budgetPick.pricing,
              whyBudget:
                budgetPick.pricing.model === 'free'
                  ? `${budgetPick.name} is completely free and still offers solid features.`
                  : `${budgetPick.name} offers great value at ${budgetPick.pricing.price}.`,
            }
          : null,
      allRankings: rankedPlayers.slice(0, 10).map((p, index) => ({
        rank: index + 1,
        name: p.name,
        slug: p.slug,
        rating: p.rating,
        pricing: p.pricing.model === 'free' ? 'Free' : p.pricing.price,
        highlight: p.pros[0],
      })),
      deviceCompatibility: {
        totalApps: rankedPlayers.length,
        os: device.os,
        notes:
          device.category === 'smart-tv'
            ? `${device.shortName} has limited IPTV app options. Consider a streaming device for more choices.`
            : device.category === 'streaming-stick'
            ? `${device.shortName} supports most popular IPTV players through its app store.`
            : `${device.shortName} offers excellent IPTV app compatibility.`,
      },
      faqs: [
        {
          question: `What is the best IPTV player for ${device.shortName}?`,
          answer: topPick
            ? `${topPick.name} is our top pick for ${device.shortName} due to ${topPick.pros[0].toLowerCase()}.`
            : `Check our rankings above for the best options.`,
        },
        {
          question: `Is there a free IPTV player for ${device.shortName}?`,
          answer: budgetPick?.pricing.model === 'free'
            ? `Yes! ${budgetPick.name} is completely free and works great on ${device.shortName}.`
            : `Most players offer free versions with limited features. ${rankedPlayers.find((p) => p.pricing.model === 'freemium')?.name || 'Several options'} has a freemium model.`,
        },
        {
          question: `Does ${device.shortName} support TiviMate?`,
          answer: device.supportedPlayers.includes('tivimate')
            ? `Yes, TiviMate is available on ${device.shortName} and is one of our top recommendations.`
            : `Unfortunately, TiviMate is not available on ${device.shortName}. Consider ${topPick?.name || 'alternative players'} instead.`,
        },
      ],
      conclusion: topPick
        ? `For ${device.shortName}, we recommend ${topPick.name} as the best overall IPTV player. ${runnerUp ? `${runnerUp.name} is a solid alternative` : ''}${budgetPick && budgetPick.pricing.model === 'free' ? `, and ${budgetPick.name} is perfect if you want a free option` : ''}.`
        : `${device.shortName} has limited IPTV player options. Consider using a dedicated streaming device for better app support.`,
    },
    relatedGuides: [],
    tags: [device.slug, 'best', 'iptv-player', 'ranking', year.toString()],
    keywords: [
      `best iptv player ${device.slug}`,
      `best iptv app ${device.shortName}`,
      `${device.shortName} iptv player`,
      `top iptv apps ${device.shortName}`,
      `iptv ${device.shortName} ${year}`,
    ],
    lastUpdated: new Date().toISOString(),
  };
}

const guides = devices.map(generateBestForPage);

// Add related guides
guides.forEach((guide) => {
  guide.relatedGuides = guides
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 5)
    .map((g) => g.slug);
});

const outputPath = path.join(DATA_DIR, 'best-player-device.json');
fs.writeFileSync(outputPath, JSON.stringify(guides, null, 2));

console.log(`Generated ${guides.length} pages`);
