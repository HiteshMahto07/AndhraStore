/**
 * lib/schema.js — Andhra Store
 *
 * Single source of truth for all JSON-LD structured data.
 *
 * UCP (Universal Commerce Protocol) compliance targets:
 *   - Schema.org Product with full Offer block incl. inventoryLevel
 *   - MerchantReturnPolicy linked via @id from every product Offer
 *   - Organization with full E-E-A-T signals (address, founding, catalog, knowledge)
 *   - WebSite with SearchAction and publisher @id link to Organization
 *   - Entity anchors (@id) on every block so AI agents can resolve the
 *     knowledge graph across pages without re-scraping
 *
 * Usage:
 *   import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, MERCHANT_RETURN_POLICY_SCHEMA, buildProductSchema } from '@/lib/schema';
 */

import { SITE_URL } from '@/lib/seo';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_NAME      = "Andhra Store";
const ORG_ID          = `${SITE_URL}/#organization`;
const WEBSITE_ID      = `${SITE_URL}/#website`;
const RETURN_ID       = `${SITE_URL}/#returnpolicy`;
const SHIPPING_ID     = `${SITE_URL}/#shippingpolicy`;

// Rolling 12-month price validity — keeps offers always valid
const PRICE_VALID_UNTIL = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
})();

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION  (E-E-A-T block — Experience, Expertise, Authority, Trust)
// ─────────────────────────────────────────────────────────────────────────────
//
// E — Experience:  foundingDate, areaServed, hasOfferCatalog, priceRange
// E — Expertise:   knowsAbout (specific to Andhra food culture)
// A — Authority:   sameAs (social profiles + Google Maps), aggregateRating
// T — Trust:       address, telephone, email, legalName, return/refund links
//
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    ["Organization", "FoodEstablishment"],
  "@id":      ORG_ID,

  // Core identity
  name:       BRAND_NAME,
  legalName:  "Andhra Store",
  url:        SITE_URL,
  logo: {
    "@type":  "ImageObject",
    "@id":    `${SITE_URL}/#logo`,
    url:      `${SITE_URL}/logo.jpeg`,
    width:    400,
    height:   400,
    caption:  "Andhra Store — Traditional Andhra Foods",
  },
  image:       `${SITE_URL}/logo.jpeg`,
  description: "Andhra Store makes and ships authentic Andhra homemade foods — pickles, podi, snacks and traditional sweets. All products use cold-pressed oils, unrefined jaggery, and no artificial preservatives. Founded by a family from Rajahmundry, East Godavari, operating from Daman. Ships pan-India in 2–4 days.",
  slogan:      "Homemade Andhra taste, delivered anywhere in India.",

  // E-E-A-T: founding & operational history
  foundingDate:   "2023",
  foundingLocation: {
    "@type":        "Place",
    name:           "East Godavari, Andhra Pradesh, India",
    address: {
      "@type":           "PostalAddress",
      addressLocality:   "Rajahmundry",
      addressRegion:     "Andhra Pradesh",
      addressCountry:    "IN",
    },
  },

  // Physical address for trust — registered business location in Daman
  // (Founders are from Rajahmundry, East Godavari — reflected in foundingLocation)
  address: {
    "@type":           "PostalAddress",
    streetAddress:     "Maharaja Complex, Jetty Road, Near Night Street, Opposite Police Station",
    addressLocality:   "Nani Daman",
    addressRegion:     "Dadra and Nagar Haveli and Daman and Diu",
    postalCode:        "396210",
    addressCountry:    "IN",
  },

  // Contact
  telephone:  "+91-8758302568",
  email:      "Andhrastore.india@gmail.com",
  contactPoint: [
    {
      "@type":           "ContactPoint",
      telephone:         "+91-8758302568",
      contactType:       "customer service",
      contactOption:     "TollFree",
      areaServed:        "IN",
      availableLanguage: ["English", "Telugu", "Hindi"],
      hoursAvailable: {
        "@type":     "OpeningHoursSpecification",
        dayOfWeek:   ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens:       "09:00",
        closes:      "22:00",
      },
    },
    {
      "@type":       "ContactPoint",
      url:           "https://wa.me/918758302568",
      contactType:   "customer service",
      contactOption: "HearingImpairedSupported",
      areaServed:    "IN",
    },
  ],

  // Commerce signals
  priceRange:  "₹100–₹549",
  currenciesAccepted: "INR",
  paymentAccepted:    "Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery",
  areaServed: {
    "@type":        "Country",
    name:           "India",
    identifier:     "IN",
  },

  // Offer catalog — links AI agents to category pages
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    "@id":   `${SITE_URL}/#catalog`,
    name:    "Andhra Store Product Catalog",
    url:     SITE_URL,
    numberOfItems: 45,
    itemListElement: [
      { "@type": "OfferCatalog", name: "Andhra Pickles",       url: `${SITE_URL}/pickles`,       numberOfItems: 16 },
      { "@type": "OfferCatalog", name: "Andhra Podi",          url: `${SITE_URL}/podi`,           numberOfItems: 9  },
      { "@type": "OfferCatalog", name: "Andhra Snacks",        url: `${SITE_URL}/snacks`,         numberOfItems: 8  },
      { "@type": "OfferCatalog", name: "Andhra Sweets",        url: `${SITE_URL}/sweets`,         numberOfItems: 12 },
    ],
  },

  // E-E-A-T: domain expertise signals
  knowsAbout: [
    "Andhra Pradesh traditional food",
    "Indian pickle making (achar)",
    "Cold-pressed groundnut oil",
    "Cold-pressed sesame oil",
    "Guntur red chilli varieties",
    "Andhra festival foods",
    "East Godavari regional cuisine",
    "Jaggery-based Indian sweets",
    "Traditional food preservation",
    "GI-tagged Indian food products",
  ],

  // Authority: verified social and business profiles
  sameAs: [
    "https://www.instagram.com/andhrastore.india",
    "https://wa.me/918758302568",
    `${SITE_URL}`,
  ],

  // Return & shipping policy links
  hasMerchantReturnPolicy: { "@id": RETURN_ID },
};

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE  — SearchAction for sitelinks + publisher entity link
// ─────────────────────────────────────────────────────────────────────────────
export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "WebSite",
  "@id":      WEBSITE_ID,
  url:        SITE_URL,
  name:       BRAND_NAME,
  description:"Andhra Store — buy authentic Andhra pickles, podi, snacks and sweets online. Made with traditional recipes from East Godavari. No preservatives. Ships pan-India.",
  inLanguage: ["en-IN", "te"],
  publisher:  { "@id": ORG_ID },

  // Enables Google Sitelinks Search Box + AI agent search discovery
  potentialAction: {
    "@type":       "SearchAction",
    target: {
      "@type":      "EntryPoint",
      urlTemplate:  `${SITE_URL}/pickles?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MERCHANT RETURN POLICY  — referenced by @id from every product Offer
// ─────────────────────────────────────────────────────────────────────────────
//
// Food safety law requires no-return policy for consumables as a rule.
// However Andhra Store honours 7-day replacement/refund for:
//   damaged, wrong, or missing items with photo/video evidence.
// Schema uses MerchantReturnFiniteReturnWindow with 7 days to reflect this.
//
export const MERCHANT_RETURN_POLICY_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "MerchantReturnPolicy",
  "@id":      RETURN_ID,
  name:       "Andhra Store Return & Replacement Policy",
  url:        `${SITE_URL}/return-policy`,

  applicableCountry:    "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays:   7,
  returnMethod:         "https://schema.org/ReturnByMail",
  returnFees:           "https://schema.org/FreeReturn",
  refundType:           "https://schema.org/FullRefund",

  // Food-product exception — refund for damage/wrong item, not preference
  additionalProperty: {
    "@type": "PropertyValue",
    name:    "Food Product Return Condition",
    value:   "Refund or replacement issued within 7 days of delivery for damaged, wrong, or missing items. Valid claim requires photo or video evidence submitted via WhatsApp or email within 24 hours of delivery.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SHIPPING POLICY  — reusable OfferShippingDetails object
// ─────────────────────────────────────────────────────────────────────────────
export const SHIPPING_DETAILS = {
  "@type":     "OfferShippingDetails",
  "@id":       SHIPPING_ID,

  shippingRate: {
    "@type":    "MonetaryAmount",
    value:      "0",
    currency:   "INR",
    description:"Free shipping on all orders above ₹999. ₹60 shipping for orders ₹500–₹998. ₹100 shipping below ₹500.",
  },
  doesNotShip: false,
  shippingDestination: {
    "@type":         "DefinedRegion",
    addressCountry:  "IN",
    description:     "Pan-India delivery to all 28 states and 8 union territories.",
  },
  deliveryTime: {
    "@type":       "ShippingDeliveryTime",
    handlingTime: {
      "@type":     "QuantitativeValue",
      minValue:    0,
      maxValue:    1,
      unitCode:    "DAY",
    },
    transitTime: {
      "@type":     "QuantitativeValue",
      minValue:    2,
      maxValue:    4,
      unitCode:    "DAY",
    },
    businessDays: {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// buildProductSchema()
// ─────────────────────────────────────────────────────────────────────────────
//
// Builds a fully UCP-compliant Product schema for any product page.
//
// Fulfillment model
// ─────────────────
// The base purchasable unit is always the 250g pack (product.amount).
// We do NOT maintain separate inventory SKUs for 500g or 1kg.
// Larger sizes are fulfilled as multiples of the same 250g pack:
//   500g → 2 × 250g packs  (price × 2)
//   1kg  → 4 × 250g packs  (price × 4)
//
// Schema representation: a single Offer (one SKU, one inventory pool)
// with a priceSpecification array of UnitPriceSpecification tiers.
// Each tier's referenceQuantity.value encodes the number of 250g packs.
// This is accurate and avoids false AggregateOffer / hasVariant structures.
//
// @param {object} opts
//   .product        — full product data object from JSON
//   .pageUrl        — canonical URL of this product page
//   .category       — schema.org category string  e.g. "Food > Pickles > Andhra Pickles"
//   .additionalType — optional extra type e.g. "https://schema.org/FoodProduct"
//   .name           — display name (may differ from product.name for SEO)
//   .description    — full text description for schema (not truncated)
//   .rating         — { rating: 4.5, count: 112 }
//   .additionalProp — array of { "@type":"PropertyValue", name, value } for product attributes
//   .sku            — SKU string
//   .reviews        — array of Review objects from lib/reviews.js
//
export function buildProductSchema({
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
    "@context":  "https://schema.org",
    "@type":     "Product",

    // Entity anchor — lets AI agents identify this exact product unambiguously
    "@id": `${pageUrl}#product`,

    // Core identity
    name:        name || product.name,
    description: description || product.desc || product.shortDesc,
    image:       product.image.map(img => `${SITE_URL}${img.name}`),
    sku:         sku || product.sku,
    mpn:         sku || product.sku,
    url:         pageUrl,

    // Category and type
    category,
    ...(additionalType ? { additionalType } : {}),

    // Brand entity — linked to Organization @id
    brand: {
      "@type": "Brand",
      "@id":   `${SITE_URL}/#brand`,
      name:    BRAND_NAME,
      url:     SITE_URL,
    },

    // Origin
    countryOfOrigin: {
      "@type": "Country",
      name:    "India",
    },

    // Condition — all food products are new (freshly made)
    itemCondition: "https://schema.org/NewCondition",

    // Inventory signal — UCP requirement
    // "100" is a conservative in-stock signal; update dynamically if inventory API available
    inventoryLevel: {
      "@type":    "QuantitativeValue",
      value:      100,
      unitCode:   "EA",
      unitText:   "units",
      description:"In Stock — made to order in small batches",
    },

    // Product-specific attributes (spice level, weight, oil, origin, etc.)
    additionalProperty: [
      ...additionalProp,
      {
        "@type": "PropertyValue",
        name:    "Preservatives",
        value:   "None — no artificial preservatives",
      },
      {
        "@type": "PropertyValue",
        name:    "Made In",
        value:   "Andhra Pradesh, India",
      },
    ],

    // ── Offer block ─────────────────────────────────────────────────────────
    //
    // Single Offer = single inventory SKU (the 250g pack).
    // `price` is the 250g entry price — Google's primary price signal.
    //
    // `priceSpecification` lists all purchasable quantity tiers.
    // Each tier uses UnitPriceSpecification + referenceQuantity to express
    // that 500g and 1kg are order multiples of the same 250g pack, NOT
    // independent products or separate inventory lines.
    //
    offers: {
      "@type":          "Offer",
      "@id":            `${pageUrl}#offer`,

      priceCurrency:    "INR",
      price:            basePrice,          // 250g — lowest entry price
      priceValidUntil:  PRICE_VALID_UNTIL,

      availability:     "https://schema.org/InStock",
      itemCondition:    "https://schema.org/NewCondition",
      url:              pageUrl,

      // Eligible region
      eligibleRegion: {
        "@type":         "Country",
        name:            "India",
        identifier:      "IN",
      },

      // Minimum order: 1 pack (250g).  Maximum: 50 packs.
      eligibleQuantity: {
        "@type":    "QuantitativeValue",
        minValue:   1,
        maxValue:   50,
        unitCode:   "EA",
        unitText:   "250g pack",
      },

      // Seller — linked to Organization @id
      seller: {
        "@type": "Organization",
        "@id":   ORG_ID,
        name:    BRAND_NAME,
        url:     SITE_URL,
      },

      // Return policy — linked by @id, no duplication
      hasMerchantReturnPolicy: { "@id": RETURN_ID },

      // Shipping — linked by @id, no duplication
      shippingDetails: { "@id": SHIPPING_ID },

      // ── Quantity-based price tiers ──────────────────────────────────────
      //
      // Fulfillment note (reflected in referenceQuantity.value):
      //   250g → 1 × 250g pack
      //   500g → 2 × 250g packs  (same SKU ordered twice)
      //   1kg  → 4 × 250g packs  (same SKU ordered four times)
      //
      priceSpecification: [
        {
          "@type":        "UnitPriceSpecification",
          price:          basePrice,
          priceCurrency:  "INR",
          name:           "250g",
          referenceQuantity: {
            "@type":    "QuantitativeValue",
            value:      1,
            unitCode:   "EA",
            unitText:   "250g pack",
          },
        },
        {
          "@type":        "UnitPriceSpecification",
          price:          basePrice * 2,
          priceCurrency:  "INR",
          name:           "500g (2 × 250g packs)",
          referenceQuantity: {
            "@type":    "QuantitativeValue",
            value:      2,
            unitCode:   "EA",
            unitText:   "250g pack",
          },
        },
        {
          "@type":        "UnitPriceSpecification",
          price:          basePrice * 4,
          priceCurrency:  "INR",
          name:           "1kg (4 × 250g packs)",
          referenceQuantity: {
            "@type":    "QuantitativeValue",
            value:      4,
            unitCode:   "EA",
            unitText:   "250g pack",
          },
        },
      ],
    },

    // Individual reviews — enables Google star snippet eligibility per product
    ...(reviews.length > 0 ? { review: reviews } : {}),

    // Aggregate rating summary
    aggregateRating: {
      "@type":      "AggregateRating",
      ratingValue:  String(rating?.rating ?? 4.5),
      reviewCount:  String(rating?.count  ?? 80),
      bestRating:   "5",
      worstRating:  "1",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildBreadcrumbSchema()
// ─────────────────────────────────────────────────────────────────────────────
// Thin wrapper for consistent BreadcrumbList structure site-wide.
//
// @param {Array<{ name: string, item: string }>} crumbs
//
export function buildBreadcrumbSchema(crumbs) {
  return {
    "@context":      "https://schema.org",
    "@type":         "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type":   "ListItem",
      position:  i + 1,
      name:      c.name,
      item:      c.item,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildFaqSchema()
// ─────────────────────────────────────────────────────────────────────────────
export function buildFaqSchema(qaPairs) {
  return {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity:  qaPairs.map(({ q, a }) => ({
      "@type":        "Question",
      name:           q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// buildSpeakableSchema()
// ─────────────────────────────────────────────────────────────────────────────
//
// Generates a WebPage schema with SpeakableSpecification.
// Google uses this for AI Overviews and Google Assistant text-to-speech.
//
// CSS selectors used site-wide on product pages:
//   #product-title          — h1 with this id (all 4 product page templates)
//   .product-speakable-desc — short description paragraph (class added to each)
//
// @param {string} name    — page/product name
// @param {string} pageUrl — canonical URL
//
export function buildSpeakableSchema(name, pageUrl) {
  return {
    "@context": "https://schema.org/",
    "@type":    "WebPage",
    "@id":      `${pageUrl}#webpage`,
    name,
    url:        pageUrl,
    speakable: {
      "@type":       "SpeakableSpecification",
      cssSelector:   ["#product-title", ".product-speakable-desc"],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports summary for easy import
// ─────────────────────────────────────────────────────────────────────────────
export const SCHEMA_IDS = {
  ORG_ID,
  WEBSITE_ID,
  RETURN_ID,
  SHIPPING_ID,
  PRICE_VALID_UNTIL,
};
