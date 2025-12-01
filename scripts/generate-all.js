#!/usr/bin/env node
/**
 * Master generation script
 * Runs all page generators to create JSON data files
 */

const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  'generate-player-device.js',
  'generate-player-feature.js',
  'generate-device-feature.js',
  'generate-troubleshooting.js',
  'generate-comparisons.js',
  'generate-best-for.js',
];

console.log('🚀 Starting page generation...\n');

let totalPages = 0;

scripts.forEach((script) => {
  const scriptPath = path.join(__dirname, script);
  console.log(`📄 Running ${script}...`);

  try {
    const output = execSync(`node "${scriptPath}"`, { encoding: 'utf-8' });
    console.log(output);

    // Extract page count from output
    const match = output.match(/Generated (\d+) pages/);
    if (match) {
      totalPages += parseInt(match[1], 10);
    }
  } catch (error) {
    console.error(`❌ Error running ${script}:`, error.message);
    process.exit(1);
  }
});

console.log('\n✅ Generation complete!');
console.log(`📊 Total pages generated: ${totalPages}`);
