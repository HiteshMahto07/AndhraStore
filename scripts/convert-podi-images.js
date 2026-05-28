'use strict';

/**
 * scripts/convert-podi-images.js
 *
 * Converts all podi product images from D:\my_projects\Andhra_Images
 * to optimised WebP, renames with SEO-friendly slugs, and saves to
 * public/images/podi/
 *
 * Also patches "image" array in data/podi.json automatically.
 *
 * Usage: node scripts/convert-podi-images.js
 * (must run inside WSL: wsl -e bash -c "cd /home/sagar/andhra_store/AndhraStore && node scripts/convert-podi-images.js")
 */

const sharp  = require('sharp');
const fs     = require('fs');
const path   = require('path');

const SOURCE_DIR = '/mnt/d/my_projects/Andhra_Images';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'podi');

// ── Product map ───────────────────────────────────────────────────────────────
// keyword        — matches hero/infographic/serving filenames
// ingredientKw   — matches ingredient filename (describes bowl/ingredient content)
const PRODUCTS = [
  { type: 'KandiPodi',           slug: 'andhra-kandi-podi',             keyword: 'kandi podi',                 ingredientKw: 'toor dal (pigeon peas)'       },
  { type: 'IdlyPodi',            slug: 'andhra-idly-podi',              keyword: 'idly podi',                  ingredientKw: 'roasted urad dal'             },
  { type: 'NuvvulaPodi',         slug: 'andhra-nuvvula-podi',           keyword: 'sesame seeds podi',          ingredientKw: 'dark gray ceramic bowl'       },
  { type: 'NalaKaram',           slug: 'andhra-nala-karam',             keyword: 'reddish-brown sesame spice', ingredientKw: 'filled with reddis'           },
  { type: 'PeanutPodi',          slug: 'andhra-peanut-podi',            keyword: 'peanut podi',                ingredientKw: 'roasted peanuts'              },
  { type: 'CoconutPodi',         slug: 'andhra-coconut-podi',           keyword: 'coconut podi',               ingredientKw: 'fresh grated coconut'         },
  { type: 'MoringaPodi',         slug: 'andhra-moringa-podi',           keyword: 'moringa leaves podi',        ingredientKw: 'moringa leaves (drumstick'    },
  { type: 'RedChilliGarlicPodi', slug: 'andhra-red-chilli-garlic-podi', keyword: 'red chilli garlic podi',     ingredientKw: 'red chilli garlic podi'       },
  { type: 'KakarakayaPodi',      slug: 'andhra-kakarakaya-podi',        keyword: 'bitter gourd powder',        ingredientKw: 'bitter gourd (karela) sliced' },
];

// ── Image slots ───────────────────────────────────────────────────────────────
const IMAGE_SLOTS = [
  {
    suffix:   'hero',
    prefixes: ['Hero Product Image_'],
    alt:      (name) => `${name} — Andhra Store ceramic bowl on white background, product photography`,
  },
  {
    suffix:   'infographic',
    prefixes: ['Benefits & Premium Presentation Image_'],
    alt:      (name) => `${name} infographic — traditional recipe, no preservatives, handcrafted Andhra style`,
  },
  {
    suffix:   'serving',
    prefixes: ['Serving Suggestion Image_'],
    alt:      (name) => `${name} serving suggestion — South Indian breakfast or meal with ghee`,
  },
  {
    suffix:          'ingredients',
    prefixes:        ['Ingredient Composition Image_'],
    useIngredientKw: true,
    alt:             (name) => `Fresh ingredients for Andhra Store ${name} — roasted lentils, Guntur chilli and whole spices`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function findSourceFile(files, prefixes, keyword, excludeKeyword) {
  return files.find(f => {
    const nameUpper      = f.toUpperCase();
    const matchesPrefix  = prefixes.some(p => f.startsWith(p));
    const matchesKeyword = nameUpper.includes(keyword.toUpperCase());
    const excluded       = excludeKeyword && nameUpper.includes(excludeKeyword.toUpperCase());
    return matchesPrefix && matchesKeyword && !excluded;
  }) || null;
}

async function convertImage(srcFile, destFile) {
  await sharp(srcFile)
    .webp({ quality: 85, effort: 4 })
    .toFile(destFile);
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allFiles    = fs.readdirSync(SOURCE_DIR);
  const jsonUpdates = {};
  const errors      = [];

  console.log('\n┌─ Podi Image Converter ────────────────────────────────────────┐\n');

  for (const product of PRODUCTS) {
    const { type, slug, keyword } = product;
    const displayName = keyword;
    const imageArray  = [];

    process.stdout.write(`  ${type.padEnd(20)} `);

    for (const slot of IMAGE_SLOTS) {
      const searchKw = slot.useIngredientKw ? product.ingredientKw : keyword;
      const srcName  = findSourceFile(allFiles, slot.prefixes, searchKw, slot.excludeKeyword);

      if (!srcName) {
        process.stdout.write(`[MISS:${slot.suffix}] `);
        errors.push(`${type} — missing: ${slot.suffix} (kw="${searchKw}")`);
        continue;
      }

      const srcPath  = path.join(SOURCE_DIR, srcName);
      const destName = `${slug}-${slot.suffix}.webp`;
      const destPath = path.join(OUTPUT_DIR, destName);

      try {
        await convertImage(srcPath, destPath);
        process.stdout.write(`✓`);
        imageArray.push({
          name: `/images/podi/${destName}`,
          alt:  slot.alt(displayName),
        });
      } catch (err) {
        process.stdout.write(`✗`);
        errors.push(`${type}/${slot.suffix} — ${err.message}`);
      }
    }

    console.log(`  → ${imageArray.length} images`);
    jsonUpdates[type] = imageArray;
  }

  console.log('\n└────────────────────────────────────────────────────────────────┘\n');

  // ── Patch podi.json ──────────────────────────────────────────────────────────
  const jsonPath   = path.join(__dirname, '..', 'data', 'podi.json');
  const podis      = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let   patchCount = 0;

  for (const podi of podis) {
    if (jsonUpdates[podi.type] && jsonUpdates[podi.type].length > 0) {
      podi.image = jsonUpdates[podi.type];
      patchCount++;
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(podis, null, 2), 'utf8');
  console.log(`  ✓  podi.json patched — ${patchCount} products updated\n`);

  if (errors.length > 0) {
    console.log('  ⚠  Warnings / missing files:');
    errors.forEach(e => console.log(`     • ${e}`));
    console.log('');
  }

  console.log(`  Done. Images saved to: ${OUTPUT_DIR}\n`);
})();
