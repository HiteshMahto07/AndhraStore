/**
 * lib/metaCatalog.js — SERVER ONLY (imports full product JSON).
 *
 * Builds the Meta Commerce Manager product feed (Facebook / Instagram catalog)
 * from the same data files that render the product pages, so price, title and
 * availability can never drift from the site.
 *
 * Served at https://andhrastore.com/meta-catalog.xml
 *   (rewrite → pages/api/meta-catalog.js, see next.config.mjs)
 *
 * Format: RSS 2.0 + Google "g:" namespace — Meta's supported XML feed format.
 * Field reference: Meta Commerce Manager → Catalog → Data sources → "Data feed".
 *
 * Variants: a pickle sold in glass and pouch becomes two items sharing
 * item_group_id, differentiated by additional_variant_attribute "Packaging".
 * Ids come from lib/catalog.js so they match the Pixel's content_ids.
 */

import PickleData from '@/data/pickles.json';
import PodiData   from '@/data/podi.json';
import SnacksData from '@/data/snacks.json';
import SweetsData from '@/data/sweets.json';
import { SITE_URL, PRODUCT_SEO_NAMES } from '@/lib/seo';
import { hasPouch, packagingPrice, packagingImages, PACKAGING_LABELS } from '@/lib/packaging';
import { catalogId, catalogImagePath } from '@/lib/catalog';

const BRAND = 'Andhra Store';

// Meta limits: title ≤ 200 chars (≤ 65 shows untruncated), description ≤ 9999,
// additional_image_link ≤ 20. Instagram carousels show up to 10 images in total.
const MAX_TITLE = 150;
const MAX_DESC  = 9999;
const MAX_ADDITIONAL_IMAGES = 9;

// Per-collection settings. `size` is the unit the listed price buys —
// only stated where the site states it (pickles 250g pack, podi 100g pouch).
const COLLECTIONS = [
  {
    data: PickleData,
    path: '/pickles',
    label: 'Pickles',
    size: '250g',
    googleCategory: 'Food, Beverages & Tobacco > Food Items > Condiments & Sauces > Pickles & Relishes',
    productType: (p) => `Pickles > ${p.category === 'non-veg' ? 'Non-Veg Pickles' : 'Veg Pickles'}`,
    title: (p) => PRODUCT_SEO_NAMES[p.type] || p.name,
    packagings: (p) => (hasPouch(p) ? ['glass', 'pouch'] : ['glass']),
  },
  {
    data: PodiData,
    path: '/podi',
    label: 'Podi',
    size: '100g',
    googleCategory: 'Food, Beverages & Tobacco > Food Items > Seasonings & Spices > Herbs & Spices',
    productType: () => 'Podi',
    title: (p) => p.name,
    packagings: () => [null],
  },
  {
    data: SnacksData,
    path: '/snacks',
    label: 'Snacks',
    size: null,
    googleCategory: 'Food, Beverages & Tobacco > Food Items > Snack Foods',
    productType: () => 'Snacks',
    title: (p) => p.name,
    packagings: () => [null],
  },
  {
    data: SweetsData,
    path: '/sweets',
    label: 'Sweets',
    size: null,
    googleCategory: 'Food, Beverages & Tobacco > Food Items > Candy & Chocolate',
    productType: () => 'Sweets',
    title: (p) => p.name,
    packagings: () => [null],
  },
];

// ─── Build items ──────────────────────────────────────────────────────────────

/**
 * Returns one plain object per catalog item (field names = Meta feed fields).
 * Exported separately from the XML so it can be inspected / tested.
 */
export function buildMetaCatalogItems() {
  const items = [];

  for (const col of COLLECTIONS) {
    const products = [...col.data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    for (const p of products) {
      const variants = col.packagings(p);
      const isGrouped = variants.length > 1;

      for (const packaging of variants) {
        const pack   = packaging || 'glass';
        const images = (packaging ? packagingImages(p, pack) : p.image).map((img) => img.name);
        const pageUrl = `${SITE_URL}${col.path}/${p.slug}`;

        // "Andhra Mango Avakaya – 250g Glass Jar" / "Andhra Kandi Podi – 100g"
        const suffix = [col.size, packaging ? PACKAGING_LABELS[pack] : null].filter(Boolean).join(' ');
        const title  = truncate(suffix ? `${col.title(p)} – ${suffix}` : col.title(p), MAX_TITLE);

        items.push({
          id:                    catalogId(p.type, pack),
          title,
          description:           truncate([p.desc || p.shortDesc, p.desc2].filter(Boolean).join('\n\n'), MAX_DESC),
          availability:          'in stock',
          condition:             'new',
          price:                 `${packagingPrice(p, pack).toFixed(2)} INR`,
          link:                  pack === 'pouch' ? `${pageUrl}#pouch` : pageUrl,
          image_link:            absoluteImage(images[0]),
          additional_image_link: images.slice(1, 1 + MAX_ADDITIONAL_IMAGES).map(absoluteImage),
          brand:                 BRAND,
          mpn:                   pack === 'pouch' ? `${p.sku}-P` : p.sku,
          google_product_category: col.googleCategory,
          product_type:          col.productType(p),
          ...(col.size ? { size: col.size } : {}),
          ...(isGrouped ? {
            item_group_id: p.type,
            additional_variant_attribute: { label: 'Packaging', value: PACKAGING_LABELS[pack] },
          } : {}),
          // Custom labels → filterable product sets for ads and shop collections.
          custom_label_0: col.label,
          ...(p.badge      ? { custom_label_1: p.badge }      : {}),
          ...(p.spiceLevel ? { custom_label_2: p.spiceLevel } : {}),
          ...(packaging    ? { custom_label_3: PACKAGING_LABELS[pack] } : {}),
        });
      }
    }
  }

  return items;
}

// ─── XML serialisation ────────────────────────────────────────────────────────

export function buildMetaCatalogXml(items = buildMetaCatalogItems()) {
  const body = items.map(itemToXml).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${esc(BRAND)} Product Catalog</title>
<link>${SITE_URL}</link>
<description>Andhra pickles, podi, snacks and sweets from ${esc(BRAND)}</description>
${body}
</channel>
</rss>
`;
}

function itemToXml(item) {
  const lines = ['<item>'];
  for (const [key, value] of Object.entries(item)) {
    if (value == null || value === '') continue;
    if (key === 'additional_image_link') {
      value.forEach((url) => lines.push(`  <g:additional_image_link>${esc(url)}</g:additional_image_link>`));
    } else if (key === 'additional_variant_attribute') {
      lines.push(`  <g:additional_variant_attribute><g:label>${esc(value.label)}</g:label><g:value>${esc(value.value)}</g:value></g:additional_variant_attribute>`);
    } else {
      lines.push(`  <g:${key}>${esc(String(value))}</g:${key}>`);
    }
  }
  lines.push('</item>');
  return lines.join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function absoluteImage(src) {
  return `${SITE_URL}${encodeURI(catalogImagePath(src))}`;
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
