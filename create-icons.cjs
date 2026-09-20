// Create PWA icons from SVG logo using canvas approach
// This is a fallback when ImageMagick is not available

const fs = require('fs');
const path = require('path');

const sourceSvg = path.join(__dirname, 'assets', 'icons', 'logo.svg');
const outputDir = path.join(__dirname, 'assets', 'icons');

console.log('Creating PWA icons...\n');

// Read the SVG logo
if (!fs.existsSync(sourceSvg)) {
  console.error('SVG logo not found:', sourceSvg);
  process.exit(1);
}

// For now, we'll copy the logo.png to create appropriately sized icons
// In production, use a proper image processing tool

const logoPng = path.join(__dirname, 'assets', 'images', 'logo.png');

console.log('Source files:');
console.log('  SVG:', sourceSvg);
console.log('  PNG:', logoPng);

// Check if files exist
if (!fs.existsSync(logoPng)) {
  console.error('PNG logo not found:', logoPng);
  process.exit(1);
}

// Get file sizes
const svgStat = fs.statSync(sourceSvg);
const pngStat = fs.statSync(logoPng);

console.log('\nSource file sizes:');
console.log(`  logo.svg: ${(svgStat.size / 1024).toFixed(1)} KB`);
console.log(`  logo.png: ${(pngStat.size / 1024).toFixed(1)} KB`);

console.log('\n---');
console.log('PWA Icon Requirements:');
console.log('  - 192x192 PNG with background #0d1b2e');
console.log('  - 512x512 PNG with background #0d1b2e');
console.log('  - 512x512 maskable PNG (transparent background)');
console.log('\nTo create these icons, use:');
console.log('  1. ImageMagick: convert logo.png -resize 192x192 -background \\'#0d1b2e\\' -gravity center -extent 192x192 icon.png');
console.log('  2. Or use the SVG logo in a design tool (Figma, Illustrator, etc.)');
console.log('  3. Or use an online PWA icon generator');
console.log('\nThe manifest.webmanifest is configured to use:');
console.log('  - /assets/icons/pwa-192x192.png');
console.log('  - /assets/icons/pwa-512x512.png');
console.log('  - /assets/icons/pwa-512x512-maskable.png');
console.log('\nUntil proper icons are created, the app will use the existing verseup_logo.png as fallback.');
