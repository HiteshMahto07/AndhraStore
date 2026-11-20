/**
 * scripts/generate-catalog-images.js — Andhra Store
 *
 * Meta Commerce Manager (Facebook / Instagram catalog) accepts JPEG or PNG
 * product images, minimum 500×500, and Instagram shows them square. The site
 * serves WebP, so this script writes a square JPEG twin of every product image
 * (glass + pouch) into public/catalog/, mirroring the original path:
 *
 *   /images/pickles/andhra-mango-pickle-hero.webp
 *     → /catalog/images/pickles/andhra-mango-pickle-hero.jpg
 *
 * Images are fitted onto a white square (no cropping). Sources smaller than
 * 500px are upscaled to the 600px minimum and reported — replace those photos.
 *
 * Runs automatically before `next build` (package.json "prebuild") and skips
 * images whose JPEG is already newer than the source.
 *
 * Usage: node scripts/generate-catalog-images.js [--force]
 */

'use strict';

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const ROOT   = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const FORCE  = process.argv.includes('--force');

const MIN_META = 500;   // Meta's minimum
const MIN_OUT  = 600;   // floor for upscaled small sources
const MAX_OUT  = 1080;  // Instagram's square feed size

// Mirrors catalogImagePath() in lib/catalog.js — keep identical.
function catalogImagePath(src) {
  return `/catalog${src.replace(/\.(webp|jpe?g|png)$/i, '.jpg')}`;
}

function collectSources() {
  const files = ['pickles', 'podi', 'snacks', 'sweets'];
  const set = new Set();
  for (const f of files) {
    for (const p of require(path.join(ROOT, 'data', `${f}.json`))) {
      for (const img of [...p.image, ...(p.pouch?.image || [])]) set.add(img.name);
    }
  }
  return [...set];
}

async function main() {
  const sources = collectSources();
  let written = 0, skipped = 0;
  const small = [], missing = [];

  for (const src of sources) {
    const inFile  = path.join(PUBLIC, src);
    const outFile = path.join(PUBLIC, catalogImagePath(src));

    if (!fs.existsSync(inFile)) { missing.push(src); continue; }

    const meta = await sharp(inFile).metadata();
    const longSide = Math.max(meta.width, meta.height);
    if (Math.min(meta.width, meta.height) < MIN_META) small.push(`${src} (${meta.width}×${meta.height})`);

    if (!FORCE && fs.existsSync(outFile) && fs.statSync(outFile).mtimeMs >= fs.statSync(inFile).mtimeMs) {
      skipped++;
      continue;
    }

    const side = Math.min(MAX_OUT, Math.max(MIN_OUT, longSide));
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    await sharp(inFile)
      .flatten({ background: '#ffffff' })
      .resize(side, side, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outFile);
    written++;
  }

  console.log(`[catalog-images] ${sources.length} images: ${written} written, ${skipped} up to date.`);
  if (small.length) {
    console.warn(`[catalog-images] ${small.length} source image(s) below Meta's ${MIN_META}px minimum were upscaled — replace with larger photos:`);
    small.forEach((s) => console.warn(`  - ${s}`));
  }
  if (missing.length) {
    console.error(`[catalog-images] Missing source images:\n  - ${missing.join('\n  - ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[catalog-images] Failed:', err);
  process.exit(1);
});
