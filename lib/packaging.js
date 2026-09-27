/**
 * lib/packaging.js
 *
 * Packaging options for pickles (glass jar vs stand-up pouch).
 * Single source of truth for pouch pricing — used by the product page,
 * the schema builder and server-side checkout totals.
 *
 * Data model: a pickle's `amount` and `image` describe the glass jar (default).
 * A pickle offers a pouch only when it has `pouch.image` in data/pickles.json.
 * Pouch price = glass price − POUCH_DISCOUNT (per 250g pack; 500g/1kg stay 2×/4×).
 */

export const POUCH_DISCOUNT = 50;

export const PACKAGING_LABELS = { glass: 'Glass Jar', pouch: 'Pouch' };

export function hasPouch(product) {
  return Boolean(product?.pouch?.image?.length);
}

export function isValidPackaging(product, packaging = 'glass') {
  if (packaging === 'glass') return true;
  return packaging === 'pouch' && hasPouch(product);
}

// Price of one 250g pack in the given packaging.
export function packagingPrice(product, packaging = 'glass') {
  return packaging === 'pouch' ? product.amount - POUCH_DISCOUNT : product.amount;
}

export function packagingImages(product, packaging = 'glass') {
  return packaging === 'pouch' && hasPouch(product) ? product.pouch.image : product.image;
}
