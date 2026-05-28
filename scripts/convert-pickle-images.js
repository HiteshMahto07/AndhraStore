'use strict';

/**
 * scripts/convert-pickle-images.js
 *
 * Converts all pickle product images from D:\my_projects\Andhra_Images
 * to optimised WebP, renames with SEO-friendly slugs, and saves to
 * public/images/pickles/
 *
 * Also prints the updated "image" array for each product so pickles.json
 * can be patched automatically.
 *
 * Usage: node scripts/convert-pickle-images.js
 */

const sharp  = require('sharp');
const fs     = require('fs');
const path   = require('path');

// Windows path via WSL mount: D:\my_projects\Andhra_Images → /mnt/d/my_projects/Andhra_Images
const SOURCE_DIR = '/mnt/d/my_projects/Andhra_Images';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'pickles');

// ── Product map: type → slug + keyword to match in source filename ────────────
// keyword        — matches hero/spoon/serving/lifestyle filenames (contain product name)
// ingredientKw   — matches ingredients filename (describes main ingredient, not product name)
const PRODUCTS = [
  { type: 'Mango',       slug: 'andhra-mango-pickle',        keyword: 'Mango Pickle',        ingredientKw: 'raw mango pieces'              },
  { type: 'Gongura',     slug: 'andhra-gongura-pickle',      keyword: 'Gongura Pickle',       ingredientKw: 'gongura leaves'                },
  { type: 'Garlic',      slug: 'andhra-garlic-pickle',       keyword: 'Garlic Pickle',        ingredientKw: 'of fresh garlic cloves, dried' },
  { type: 'Ginger',      slug: 'andhra-ginger-pickle',       keyword: 'Ginger Pickle',        ingredientKw: 'fresh ginger root'             },
  { type: 'RedChilli',   slug: 'andhra-red-chilli-pickle',   keyword: 'Red Chilli Pickle',    ingredientKw: 'fresh red chillies, dried red' },
  { type: 'Lemon',       slug: 'andhra-lemon-pickle',        keyword: 'Lemon Pickle',         ingredientKw: 'fresh lemons'                  },
  { type: 'Tomato',      slug: 'andhra-tomato-pickle',       keyword: 'Tomato Pickle',        ingredientKw: 'fresh red tomatoes'            },
  { type: 'Curry',       slug: 'andhra-curry-leaves-pickle', keyword: 'Curry Leaves Pickle',  ingredientKw: 'fresh curry leaves, dried red' },
  { type: 'GreenChilli', slug: 'andhra-green-chilli-pickle', keyword: 'Green Chilli Pickle',  ingredientKw: 'fresh green chillies'          },
  { type: 'Amla',        slug: 'andhra-amla-pickle',         keyword: 'Amla Pickle',          ingredientKw: 'green amla (Indian gooseber'   },
  { type: 'Karela',      slug: 'andhra-karela-pickle',       keyword: 'Karela Pickle',        ingredientKw: 'fresh karela (bitter gourd)'   },
  { type: 'Tamarind',    slug: 'andhra-tamarind-pickle',     keyword: 'Tamarind Pickle',      ingredientKw: 'fresh tamarind pods'           },
  { type: 'Chicken',     slug: 'andhra-chicken-pickle',      keyword: 'Chicken Pickle',       ingredientKw: 'raw chicken pieces'            },
  { type: 'Meat',        slug: 'andhra-meat-pickle',         keyword: 'Mutton Pickle',        ingredientKw: 'raw mutton pieces'             },
  { type: 'Prawns',      slug: 'andhra-prawns-pickle',       keyword: 'Prawn Pickle',         ingredientKw: 'fresh prawns'                  },
  { type: 'Fish',        slug: 'andhra-fish-pickle',         keyword: 'Fish Pickle',          ingredientKw: 'fresh fish pieces'             },
];

// ── Image slots: output suffix + filename prefix(es) to search for ───────────
const IMAGE_SLOTS = [
  {
    suffix:   'sealed',
    prefixes: ['Sealed Packaging Image_'],
    alt:      (name) => `${name} — Andhra Store sealed glass jar on white background, hygienically packed`,
  },
  {
    suffix:   'hero',
    prefixes: ['Hero Product Image_'],
    alt:      (name) => `${name} — Andhra Store glass jar, front view`,
  },
  {
    suffix:   'spoon',
    prefixes: ['Spoon Lift Close-Up_'],
    alt:      (name) => `${name} — close-up of spiced oil and pickle pieces on wooden spoon`,
  },
  {
    suffix:   'serving',
    prefixes: ['Serving Suggestion_', 'Serving Suggestion Image_'],
    // Exclude the generic "curry being prepared in kadai" image for Curry Leaves
    excludeKeyword: 'kadai',
    alt:      (name) => `${name} served on hot steaming rice on banana leaf — traditional Andhra style`,
  },
  {
    suffix:        'ingredients',
    prefixes:      ['Ingredients Composition_'],
    useIngredientKw: true,   // use product.ingredientKw instead of product.keyword
    alt:           (name) => `Fresh ingredients for Andhra Store ${name} — red chillies, garlic, curry leaves and whole spices`,
  },
  {
    suffix:   'lifestyle',
    prefixes: ['Hand-Held Lifestyle Image_'],
    alt:      (name) => `Hand holding Andhra Store ${name} jar outdoors — authentic homemade pickle`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function findSourceFile(files, prefixes, keyword, excludeKeyword) {
  return files.find(f => {
    const nameUpper = f.toUpperCase();
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
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allFiles    = fs.readdirSync(SOURCE_DIR);
  const jsonUpdates = {};   // type → image array
  const errors      = [];

  console.log('\n┌─ Pickle Image Converter ──────────────────────────────────────┐\n');

  for (const product of PRODUCTS) {
    const { type, slug, keyword } = product;
    const displayName = keyword.replace(' Pickle', '') + ' Pickle';
    const imageArray  = [];

    process.stdout.write(`  ${type.padEnd(12)} `);

    for (const slot of IMAGE_SLOTS) {
      const searchKw = slot.useIngredientKw ? product.ingredientKw : keyword;
      const srcName  = findSourceFile(allFiles, slot.prefixes, searchKw, slot.excludeKeyword);

      if (!srcName) {
        process.stdout.write(`[MISS:${slot.suffix}] `);
        errors.push(`${type} — missing: ${slot.suffix}`);
        continue;
      }

      const srcPath  = path.join(SOURCE_DIR, srcName);
      const destName = `${slug}-${slot.suffix}.webp`;
      const destPath = path.join(OUTPUT_DIR, destName);

      try {
        await convertImage(srcPath, destPath);
        process.stdout.write(`✓`);
        imageArray.push({
          name: `/images/pickles/${destName}`,
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

  // ── Patch pickles.json ──────────────────────────────────────────────────────
  const jsonPath   = path.join(__dirname, '..', 'data', 'pickles.json');
  const pickles    = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let   patchCount = 0;

  for (const pickle of pickles) {
    if (jsonUpdates[pickle.type] && jsonUpdates[pickle.type].length > 0) {
      pickle.image = jsonUpdates[pickle.type];
      patchCount++;
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(pickles, null, 2), 'utf8');
  console.log(`  ✓  pickles.json patched — ${patchCount} products updated\n`);

  if (errors.length > 0) {
    console.log('  ⚠  Warnings / missing files:');
    errors.forEach(e => console.log(`     • ${e}`));
    console.log('');
  }

  console.log(`  Done. Images saved to: ${OUTPUT_DIR}\n`);
})();
