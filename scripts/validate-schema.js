/**
 * scripts/validate-schema.js — Andhra Store
 *
 * Standalone UCP schema validator.  Runs independently of the Next.js build.
 * Usage : node scripts/validate-schema.js
 *         npm run validate:schema
 *
 * ─── Why this file mirrors lib/schema.js rather than require()ing it ──────────
 * lib/schema.js uses ES-module "export" syntax and the Next.js "@/" path alias.
 * Plain Node.js treats .js files as CommonJS (no "type":"module" in package.json),
 * so require('../lib/schema.js') throws "SyntaxError: Unexpected token 'export'".
 * Transpiling it at runtime adds a heavy toolchain dependency (babel-register /
 * ts-node) that is overkill for a 50-line validation script.
 *
 * Instead, buildProductSchema is re-implemented here as a CJS function that is
 * kept in sync with lib/schema.js.  Both files produce identical JSON-LD output.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const Ajv = require('ajv');

// ─── ANSI colour helpers ───────────────────────────────────────────────────────
const c = {
  green     : (s) => `\x1b[32m${s}\x1b[0m`,
  red       : (s) => `\x1b[31m${s}\x1b[0m`,
  dim       : (s) => `\x1b[2m${s}\x1b[0m`,
  greenBold : (s) => `\x1b[1;32m${s}\x1b[0m`,
  redBold   : (s) => `\x1b[1;31m${s}\x1b[0m`,
  bold      : (s) => `\x1b[1m${s}\x1b[0m`,
};

// ─── Constants (mirrors lib/schema.js) ────────────────────────────────────────
const SITE_URL    = 'https://andhrastore.com';
const RETURN_ID   = `${SITE_URL}/#returnpolicy`;
const SHIPPING_ID = `${SITE_URL}/#shippingpolicy`;
const ORG_ID      = `${SITE_URL}/#organization`;
const BRAND_ID    = `${SITE_URL}/#brand`;

// Rolling 12-month price validity — identical logic to lib/schema.js
const PRICE_VALID_UNTIL = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
})();

// ─── CJS mirror of buildProductSchema (lib/schema.js) ─────────────────────────
// Keep this in sync whenever lib/schema.js is updated.
//
// Fulfillment model: base unit is always 250g (product.amount).
//   500g → 2 × 250g packs  (price × 2)
//   1kg  → 4 × 250g packs  (price × 4)
// Represented as a single Offer + priceSpecification array.
//
function buildProductSchema({
  product,
  pageUrl,
  category,
  additionalType,
  name,
  description,
  rating,
  additionalProp = [],
  sku,
  reviews = [],
}) {
  const basePrice = product.amount;   // 250g unit price — the only real inventory SKU

  return {
    '@context' : 'https://schema.org',
    '@type'    : 'Product',
    '@id'      : `${pageUrl}#product`,

    name        : name        || product.name,
    description : description || product.desc || product.shortDesc,
    image       : product.image.map(img => `${SITE_URL}${img.name}`),
    sku         : sku || product.sku,
    mpn         : sku || product.sku,
    url         : pageUrl,

    category,
    ...(additionalType ? { additionalType } : {}),

    brand: {
      '@type' : 'Brand',
      '@id'   : BRAND_ID,
      name    : 'Andhra Store',
      url     : SITE_URL,
    },

    countryOfOrigin : { '@type': 'Country', name: 'India' },
    itemCondition   : 'https://schema.org/NewCondition',

    inventoryLevel: {
      '@type'      : 'QuantitativeValue',
      value        : 100,
      unitCode     : 'EA',
      unitText     : 'units',
      description  : 'In Stock — made to order in small batches',
    },

    additionalProperty: [
      ...additionalProp,
      { '@type': 'PropertyValue', name: 'Preservatives', value: 'None — no artificial preservatives' },
      { '@type': 'PropertyValue', name: 'Made In',       value: 'Andhra Pradesh, India'               },
    ],

    offers: {
      '@type'    : 'Offer',
      '@id'      : `${pageUrl}#offer`,

      priceCurrency   : 'INR',
      price           : basePrice,           // 250g — lowest entry price (Google primary signal)
      priceValidUntil : PRICE_VALID_UNTIL,

      availability  : 'https://schema.org/InStock',
      itemCondition : 'https://schema.org/NewCondition',
      url           : pageUrl,

      eligibleRegion   : { '@type': 'Country',           name: 'India', identifier: 'IN'                        },
      eligibleQuantity : { '@type': 'QuantitativeValue', minValue: 1, maxValue: 50, unitCode: 'EA', unitText: '250g pack' },

      seller: {
        '@type' : 'Organization',
        '@id'   : ORG_ID,
        name    : 'Andhra Store',
        url     : SITE_URL,
      },

      hasMerchantReturnPolicy : { '@id': RETURN_ID   },
      shippingDetails         : { '@id': SHIPPING_ID },

      // Quantity-based price tiers — referenceQuantity.value = number of 250g packs
      priceSpecification: [
        {
          '@type'        : 'UnitPriceSpecification',
          price          : basePrice,
          priceCurrency  : 'INR',
          name           : '250g',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'EA', unitText: '250g pack' },
        },
        {
          '@type'        : 'UnitPriceSpecification',
          price          : basePrice * 2,
          priceCurrency  : 'INR',
          name           : '500g (2 × 250g packs)',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 2, unitCode: 'EA', unitText: '250g pack' },
        },
        {
          '@type'        : 'UnitPriceSpecification',
          price          : basePrice * 4,
          priceCurrency  : 'INR',
          name           : '1kg (4 × 250g packs)',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 4, unitCode: 'EA', unitText: '250g pack' },
        },
      ],
    },

    // Individual reviews
    ...(reviews.length > 0 ? { review: reviews } : {}),

    aggregateRating: {
      '@type'      : 'AggregateRating',
      ratingValue  : String(rating?.rating ?? 4.5),
      reviewCount  : String(rating?.count  ?? 80),
      bestRating   : '5',
      worstRating  : '1',
    },
  };
}

// ─── Mock products — one per category ─────────────────────────────────────────
const MOCK_PRODUCTS = [

  // ── PICKLES ────────────────────────────────────────────────────────────────
  {
    label : 'Pickle  — Andhra Mango Pickle (Avakaya)',
    opts  : {
      product: {
        name      : 'Andhra Mango Pickle',
        amount    : 220,
        sku       : 'AS-MANGO-250',
        shortDesc : 'Chunky raw mango with Guntur red chilli and cold-pressed groundnut oil.',
        image     : [{ name: '/images/pickles/mango.jpg' }],
      },
      pageUrl        : `${SITE_URL}/pickles/andhra-mango-pickle-avakaya`,
      category       : 'Andhra Veg Pickle',
      additionalType : 'https://schema.org/FoodProduct',
      name           : 'Andhra Mango Pickle — Avakaya',
      description    : 'Traditional Avakaya made with raw Totapuri mangoes, Guntur red chilli powder, and cold-pressed groundnut oil. No vinegar, no preservatives.',
      rating         : { rating: 4.8, count: 142 },
      additionalProp : [
        { '@type': 'PropertyValue', name: 'Spice Level', value: 'Extra Hot'                   },
        { '@type': 'PropertyValue', name: 'Net Weight',  value: '250g'                        },
        { '@type': 'PropertyValue', name: 'Oil Type',    value: 'Cold-Pressed Groundnut Oil'  },
        { '@type': 'PropertyValue', name: 'Origin',      value: 'East Godavari, Andhra Pradesh' },
      ],
      sku : 'AS-MANGO-250',
    },
  },

  // ── PODI ───────────────────────────────────────────────────────────────────
  {
    label : 'Podi    — Andhra Kandi Podi (Toor Dal Powder)',
    opts  : {
      product: {
        name      : 'Andhra Kandi Podi',
        amount    : 160,
        sku       : 'AS-KANDI-100',
        shortDesc : 'Stone-ground kandi podi with roasted toor dal and dried red chillies.',
        image     : [{ name: '/images/podi/kandi.jpg' }],
      },
      pageUrl        : `${SITE_URL}/podi/andhra-kandi-podi`,
      category       : 'Food > Podi > Andhra Podi',
      additionalType : 'https://schema.org/FoodProduct',
      name           : 'Andhra Kandi Podi',
      description    : 'Stone-ground kandi podi from roasted toor dal, dried red chillies, garlic, and cumin. Mix with rice and ghee.',
      rating         : { rating: 4.6, count: 87 },
      additionalProp : [
        { '@type': 'PropertyValue', name: 'Spice Level', value: 'Hot' },
        { '@type': 'PropertyValue', name: 'Net Weight',  value: '100g / 200g' },
      ],
      sku : 'AS-KANDI-100',
    },
  },

  // ── SNACKS ─────────────────────────────────────────────────────────────────
  {
    label : 'Snack   — Chegodi (Andhra Rice Flour Rings)',
    opts  : {
      product: {
        name      : 'Chegodi',
        amount    : 180,
        sku       : 'AS-CHEGODI-150',
        shortDesc : 'Traditional Andhra chegodi — crispy rice flour rings with sesame and cumin.',
        image     : [{ name: '/images/snacks/chegodi.jpg' }],
      },
      pageUrl        : `${SITE_URL}/snacks/chegodi`,
      category       : 'Food > Snacks > Traditional Indian Snacks',
      additionalType : 'https://schema.org/FoodProduct',
      name           : 'Chegodi — Andhra Rice Flour Rings',
      description    : 'Deep-fried chegodi made from rice flour, sesame seeds, and cumin. A staple Andhra teatime snack.',
      rating         : { rating: 4.5, count: 63 },
      sku            : 'AS-CHEGODI-150',
    },
  },

  // ── SWEETS ─────────────────────────────────────────────────────────────────
  {
    label : 'Sweet   — Ariselu (Jaggery Rice Cake)',
    opts  : {
      product: {
        name      : 'Ariselu',
        amount    : 280,
        sku       : 'AS-ARISELU-250',
        shortDesc : 'Traditional Andhra ariselu with rice flour and unrefined jaggery, fried in sesame oil.',
        image     : [{ name: '/images/sweets/ariselu.jpg' }],
      },
      pageUrl        : `${SITE_URL}/sweets/ariselu`,
      category       : 'Food > Sweets > Traditional Indian Sweets',
      additionalType : 'https://schema.org/FoodProduct',
      name           : 'Ariselu — Traditional Andhra Jaggery Rice Cake',
      description    : 'Ariselu made with freshly ground rice flour, unrefined jaggery syrup (bellam), and fried in pure sesame oil. A Sankranti festival staple.',
      rating         : { rating: 4.7, count: 95 },
      sku            : 'AS-ARISELU-250',
    },
  },

];

// ─── AJV schema — mandatory UCP fields ────────────────────────────────────────
//
// Validates the subset of fields required for UCP commerce discovery:
//   @context  @type  name  sku  inventoryLevel  offers.price
//   offers.priceCurrency  offers.priceValidUntil  offers.availability
//   offers.seller.name  offers.seller.url
//
const ucpSchema = {
  type     : 'object',
  required : ['@context', '@type', 'name', 'sku', 'inventoryLevel', 'offers'],
  properties: {

    '@context' : { type: 'string', const: 'https://schema.org'     },
    '@type'    : { type: 'string', const: 'Product'                 },
    name       : { type: 'string', minLength: 1                     },
    sku        : { type: 'string', minLength: 1                     },

    inventoryLevel: {
      type     : 'object',
      required : ['value'],
      properties: {
        value : { type: 'number', minimum: 0 },
      },
      additionalProperties: true,
    },

    offers: {
      type     : 'object',
      required : ['price', 'priceCurrency', 'priceValidUntil', 'availability', 'seller'],
      properties: {

        price : {
          type    : 'number',
          minimum : 0,
        },
        priceCurrency: {
          type  : 'string',
          const : 'INR',
        },
        priceValidUntil: {
          type    : 'string',
          pattern : '^\\d{4}-\\d{2}-\\d{2}$',   // YYYY-MM-DD
        },
        availability: {
          type : 'string',
          // must be a full schema.org URL, not a bare word
          pattern : '^https://schema\\.org/',
        },

        seller: {
          type     : 'object',
          required : ['name', 'url'],
          properties: {
            name : { type: 'string', minLength: 1 },
            url  : { type: 'string', minLength: 1 },
          },
          additionalProperties: true,
        },

      },
      additionalProperties: true,
    },

  },
  additionalProperties: true,
};

// ─── Compile validator ─────────────────────────────────────────────────────────
const ajv      = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(ucpSchema);

// ─── Run validation suite ──────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

console.log('');
console.log(c.bold('┌─ Andhra Store  UCP Schema Validator ──────────────────────────────┐'));
console.log('');

for (const { label, opts } of MOCK_PRODUCTS) {
  const generated = buildProductSchema(opts);
  const valid     = validate(generated);

  if (valid) {
    console.log(`  ${c.green('✓')}  ${c.bold('[SUCCESS]')}  ${label}`);
    const tiers = (generated.offers.priceSpecification || [])
      .map(t => `${t.name} ₹${t.price}`).join(' · ');
    console.log(c.dim(`         @id            : ${generated['@id']}`));
    console.log(c.dim(`         base price     : ₹${generated.offers.price} (250g)  |  currency: ${generated.offers.priceCurrency}`));
    console.log(c.dim(`         price tiers    : ${tiers || '—'}`));
    console.log(c.dim(`         priceValidUntil: ${generated.offers.priceValidUntil}`));
    console.log(c.dim(`         sku            : ${generated.sku}  |  inventoryLevel: ${generated.inventoryLevel.value} ${generated.inventoryLevel.unitCode}`));
    console.log(c.dim(`         seller         : ${generated.offers.seller.name}  (${generated.offers.seller.url})`));
    console.log('');
    passed++;
  } else {
    console.log(`  ${c.red('✗')}  ${c.bold('[FAILED]')}   ${label}`);
    for (const err of validate.errors) {
      const field = err.instancePath || '(root)';
      console.log(c.red(`         • ${field}  →  ${err.message}`));
      if (err.params && Object.keys(err.params).length) {
        console.log(c.red(`           params: ${JSON.stringify(err.params)}`));
      }
    }
    console.log('');
    failed++;
  }
}

console.log(c.bold('└────────────────────────────────────────────────────────────────────┘'));
console.log('');

if (failed === 0) {
  console.log(c.greenBold(`  ✓  All ${passed}/${passed} schemas valid — safe to deploy.`));
} else {
  console.log(c.redBold(`  ✗  ${failed} schema(s) failed  /  ${passed} passed.`));
  console.log(c.red('     Fix the errors above before deploying.'));
  process.exit(1);
}

console.log('');
