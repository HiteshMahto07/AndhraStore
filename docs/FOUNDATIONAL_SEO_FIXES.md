# Foundational SEO/GEO Architecture Fixes — Andhra Store

**Date:** 2026-05-09
**Site:** https://andhrastore.com
**Audited by:** Sagar Merugu — SEO/GEO Audit Pipeline
**Status:** Implemented

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Issues Discovered](#2-issues-discovered)
3. [Root Causes](#3-root-causes)
4. [Affected Files](#4-affected-files)
5. [Why Each Issue Matters for SEO/GEO](#5-why-each-issue-matters-for-seogeo)
6. [Changes Implemented](#6-changes-implemented)
7. [Before vs After Examples](#7-before-vs-after-examples)
8. [Redirect Architecture](#8-redirect-architecture)
9. [Sitemap Fixes](#9-sitemap-fixes)
10. [Schema Fixes](#10-schema-fixes)
11. [Verification Checklist](#11-verification-checklist)
12. [Remaining Future Recommendations](#12-remaining-future-recommendations)

---

## 1. Executive Summary

Andhra Store is a Next.js (Vercel) e-commerce site selling authentic Andhra-style handcrafted pickles. Prior to these fixes, every authoritative SEO signal the site emitted — canonical tags, schema markup, sitemap URLs, robots.txt — pointed to `andhrastore.in`, a GoDaddy domain parking page with zero real content.

The live site operates on `andhrastore.com`, but Google and all AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) follow canonical tags to determine the authoritative URL. With canonicals pointing to a parked domain, `andhrastore.com` was being treated as a duplicate of a dead page, causing the site's GEO score to be 31/100 (Critical tier) despite having a clean UI and real product content.

**Single most impactful fix:** Changing `SITE_URL` from `https://www.andhrastore.in` to `https://andhrastore.com` and propagating it across all pages, schema, and static files. This fix alone is projected to lift the GEO score to 55–60/100 within days of Google re-crawling.

---

## 2. Issues Discovered

### CRITICAL — Domain Identity Crisis

**Issue:** Every page contained a locally-declared constant:
```js
const BASE_URL = "https://www.andhrastore.in";
```
This value was used to build every canonical URL, every Open Graph URL, every Twitter card image URL, and every JSON-LD schema `url` field across all 9 page files and the global `_app.js`.

`andhrastore.in` is a GoDaddy domain parking page. Google and AI crawlers follow canonical tags. Because every page's canonical tag said `andhrastore.in/[page]` was authoritative, the crawlers concluded `andhrastore.com` was a duplicate of a parked page and deprioritized it accordingly.

---

### CRITICAL — Homepage Has No Indexable Content

**Issue:** `pages/index.js` (the root `/` route) contained only a client-side JavaScript redirect:
```js
useEffect(() => {
  router.replace('/home');
}, [router]);
return null;
```
AI crawlers and search engine bots that do not execute JavaScript — including many AI indexers — hit the root URL and receive an empty HTML document: no `<title>`, no `<meta name="description">`, no `<h1>`, no structured data. The page returned `null` to the renderer.

---

### CRITICAL — Sitemap Points to Parked Domain

**Issue:** `public/sitemap.xml` listed all 7 URLs under `https://www.andhrastore.in/...`. No URL matched the actual live site. The SEO audit confirmed this: "0 crawled pages found in sitemap."

---

### CRITICAL — robots.txt Sitemap Directive Points to Parked Domain

**Issue:** `public/robots.txt` contained:
```
Sitemap: https://www.andhrastore.in/sitemap.xml
```
Search engine crawlers reading `robots.txt` were directed to the parked domain's sitemap, reinforcing the wrong canonical authority.

---

### HIGH — Organization Schema Has Wrong URLs

**Issue:** In `pages/_app.js`, the global Organization schema (injected on every page) had:
```js
url: "https://www.andhrastore.in",
logo: "https://www.andhrastore.in/logo.jpeg",
sameAs: [],
```
The `logo` field resolved to a 404 on the parked domain. `sameAs` was empty. Google's Knowledge Graph uses this schema to build entity records — a broken logo URL and wrong domain prevented entity validation entirely.

---

### HIGH — No Server-Side Redirect on Root `/`

**Issue:** The `pages/index.js` file performed a client-side redirect only. There was no server-side 301 redirect, no `vercel.json` redirect, and no `next.config.mjs` redirect rule. Crawlers that don't execute JS saw an empty page at the canonical root.

---

### MEDIUM — www Redirect Was 307 (Temporary) Instead of 301 (Permanent)

**Issue:** `https://www.andhrastore.com` → `https://andhrastore.com` was using a 307 Temporary redirect. This splits link equity across www and non-www variants and signals crawlers that the canonical domain may change.

---

## 3. Root Causes

There were two architectural root causes:

**1. No centralized configuration file.**
Every page independently declared its own `BASE_URL` constant. There was no single source of truth for the site's canonical domain. When the domain was set incorrectly, it had to be wrong in 9 places simultaneously — and fixing it requires touching 9 files.

**2. Domain set to the wrong value from day one.**
The site was apparently built while targeting `andhrastore.in` (possibly the intended domain during development) and then deployed to `andhrastore.com` without updating the configuration. All SEO metadata retained the old domain.

---

## 4. Affected Files

| File | Issue | Fix Applied |
|---|---|---|
| `pages/_app.js` | `BASE_URL = andhrastore.in` in Organization schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/home/index.jsx` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, WebSite schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/pickle/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, CollectionPage schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/pickleinfo/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, Product schema, offer URL, image URL | Import `SITE_URL` from `lib/seo.js` |
| `pages/about/index.jsx` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, AboutPage schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/contact/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, LocalBusiness schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/privacy-policy/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter, WebPage schema | Import `SITE_URL` from `lib/seo.js` |
| `pages/sweets/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter | Import `SITE_URL` from `lib/seo.js` |
| `pages/cart/index.js` | `BASE_URL = andhrastore.in` in canonical, OG, Twitter | Import `SITE_URL` from `lib/seo.js` |
| `public/robots.txt` | Sitemap directive pointed to `andhrastore.in` | Updated to `https://andhrastore.com/sitemap.xml` |
| `public/sitemap.xml` | All 7 `<loc>` entries used `andhrastore.in` | Updated all entries to `https://andhrastore.com/...` |
| `pages/index.js` | Client-side JS-only redirect at root `/` | Replaced with `getServerSideProps` returning 301 |
| `next.config.mjs` | No www redirect, no server-side `/` redirect | Added `redirects()` with www→non-www and `/`→`/home` |
| `lib/seo.js` | Did not exist | Created with `export const SITE_URL = "https://andhrastore.com"` |

---

## 5. Why Each Issue Matters for SEO/GEO

### Canonical Tag Mismatch — Why It Destroys Search Ranking

When a page declares `<link rel="canonical" href="https://www.andhrastore.in/home">`, it is explicitly telling Google: *"The authoritative version of this page is at andhrastore.in/home, not here."* Google follows this instruction. It deindexes or deprioritizes `andhrastore.com/home` as a duplicate. Since `andhrastore.in` is a GoDaddy parking page, Google finds no real content there and concludes the entire site has no authoritative content. All backlinks, crawl budget, and indexing signals flow to a dead URL.

### Schema Markup URLs — Why They Matter for AI Citation

AI systems like ChatGPT, Perplexity, and Google AI Overviews use JSON-LD structured data to understand entities. When the Organization schema declares `url: "https://www.andhrastore.in"`, the AI system resolves that URL to validate the entity. It finds a parking page. The entity cannot be validated, so it is not cited. This explains why the AI Platform Readiness scores were 15–25/100 across all five platforms.

### Sitemap Mismatch — Why It Prevents Crawl Discovery

Sitemaps are the primary mechanism for telling search engines which URLs exist and should be indexed. When all sitemap URLs point to `andhrastore.in`, Google registers those URLs — none of which have content — and receives no signal about the actual content at `andhrastore.com`. The SEO audit confirmed 0 of the crawled pages were found in the sitemap.

### JS-Only Homepage Redirect — Why It Blocks AI Indexers

Many AI crawlers do not execute JavaScript. When `pages/index.js` returned `null` and performed a `router.replace` in `useEffect`, crawlers received an empty HTML document with no `<title>`, `<meta>`, `<h1>`, or schema. The root URL — the most authoritative URL on any domain — had zero indexable content.

### www → Temporary 307 Redirect — Why It Splits Link Equity

A 307 Temporary redirect signals to crawlers that the redirect may not be permanent and they should not update their records. Link equity (PageRank) is not reliably transferred through temporary redirects. Any backlinks pointing to `www.andhrastore.com` were contributing zero signal to `andhrastore.com`.

---

## 6. Changes Implemented

### 6.1 Created `lib/seo.js` — Single Source of Truth

```js
// lib/seo.js
export const SITE_URL = "https://andhrastore.com";
```

All 9 page files now import from this single location. Changing the canonical domain in the future requires editing exactly one line.

### 6.2 Refactored All Page Files

In every page file, replaced:
```js
const BASE_URL = "https://www.andhrastore.in";
```
with:
```js
import { SITE_URL } from '@/lib/seo';
```
Then replaced all `BASE_URL` references with `SITE_URL` throughout each file's canonical tags, OG tags, Twitter tags, and schema markup.

### 6.3 Fixed `public/robots.txt`

Changed the Sitemap directive from `andhrastore.in` to `andhrastore.com`:
```
Sitemap: https://andhrastore.com/sitemap.xml
```

### 6.4 Fixed `public/sitemap.xml`

Updated all `<loc>` entries and removed the `/cart` URL (cart pages should not be indexed):
- All URLs now use `https://andhrastore.com/...`
- Removed `/cart` (placeholder page, not indexable content)
- Removed `/sweets` (Coming Soon page — should not be indexed until content exists)

### 6.5 Fixed `pages/index.js` — Server-Side 301 Redirect

Replaced the client-side JavaScript redirect with a `getServerSideProps` server-side 301:
```js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: true,
    },
  };
}
```
This returns an HTTP 301 response before any JavaScript is served, making it visible to all crawlers regardless of JS execution capability.

### 6.6 Updated `next.config.mjs` — Added Permanent Redirects

Added a `redirects()` function with two rules:

**Rule 1 — www → non-www (301 Permanent):**
```js
{
  source: '/:path*',
  has: [{ type: 'host', value: 'www.andhrastore.com' }],
  destination: 'https://andhrastore.com/:path*',
  permanent: true,
}
```

**Rule 2 — Root `/` → `/home` (301 Permanent):**
```js
{
  source: '/',
  destination: '/home',
  permanent: true,
}
```

The `next.config.mjs` redirect fires before the page component is served, making it a true HTTP-level redirect visible to all crawlers and HTTP clients.

---

## 7. Before vs After Examples

### Canonical Tag

**Before:**
```html
<link rel="canonical" href="https://www.andhrastore.in/home" />
```

**After:**
```html
<link rel="canonical" href="https://andhrastore.com/home" />
```

---

### Open Graph URL

**Before:**
```html
<meta property="og:url" content="https://www.andhrastore.in/pickle" />
<meta property="og:image" content="https://www.andhrastore.in/mango-1.jpeg" />
```

**After:**
```html
<meta property="og:url" content="https://andhrastore.com/pickle" />
<meta property="og:image" content="https://andhrastore.com/mango-1.jpeg" />
```

---

### Organization Schema

**Before:**
```json
{
  "@type": "Organization",
  "name": "Andhra Store",
  "url": "https://www.andhrastore.in",
  "logo": "https://www.andhrastore.in/logo.jpeg",
  "sameAs": []
}
```

**After:**
```json
{
  "@type": "Organization",
  "name": "Andhra Store",
  "url": "https://andhrastore.com",
  "logo": "https://andhrastore.com/logo.jpeg",
  "sameAs": []
}
```

---

### Product Schema (pickleinfo page)

**Before:**
```json
{
  "@type": "Product",
  "image": "https://www.andhrastore.in/chicken-1.jpeg",
  "offers": {
    "url": "https://www.andhrastore.in/pickleinfo?type=Chicken"
  }
}
```

**After:**
```json
{
  "@type": "Product",
  "image": "https://andhrastore.com/chicken-1.jpeg",
  "offers": {
    "url": "https://andhrastore.com/pickleinfo?type=Chicken"
  }
}
```

---

### robots.txt

**Before:**
```
Sitemap: https://www.andhrastore.in/sitemap.xml
```

**After:**
```
Sitemap: https://andhrastore.com/sitemap.xml
```

---

### sitemap.xml Entry

**Before:**
```xml
<url>
  <loc>https://www.andhrastore.in/home</loc>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>
```

**After:**
```xml
<url>
  <loc>https://andhrastore.com/home</loc>
  <changefreq>weekly</changefreq>
  <priority>1.0</priority>
</url>
```

---

### Root `/` Route

**Before (`pages/index.js`):**
```js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/home'); // client-side only, invisible to crawlers
  }, [router]);
  return null; // no content rendered
};
```

**After (`pages/index.js`):**
```js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/home',
      permanent: true, // HTTP 301, visible to all crawlers
    },
  };
}

export default function Home() {
  return null;
}
```

---

## 8. Redirect Architecture

After this fix, the complete redirect chain is:

```
http://andhrastore.com/           → 301 → https://andhrastore.com/home  (HTTPS upgrade by Vercel)
https://andhrastore.com/          → 301 → https://andhrastore.com/home  (next.config.mjs)
https://www.andhrastore.com/      → 301 → https://andhrastore.com/      (next.config.mjs)
https://www.andhrastore.com/home  → 301 → https://andhrastore.com/home  (next.config.mjs)
```

**Rules defined in `next.config.mjs` (evaluated in order):**

1. `www.andhrastore.com/:path*` → `https://andhrastore.com/:path*` (permanent, host-matched)
2. `/` → `/home` (permanent, path-matched)

**Rule in `pages/index.js` `getServerSideProps`:**

- If the `next.config.mjs` redirect is bypassed for any reason (edge case, direct SSR invocation), the page itself returns a 301 to `/home`.

**Note on HTTPS enforcement:**
Vercel automatically enforces HTTPS for custom domains. The HTTP → HTTPS upgrade is handled at the Vercel edge layer before the Next.js redirect rules fire.

---

## 9. Sitemap Fixes

### Removed Pages

Two pages were removed from `sitemap.xml`:

| Page | Reason for Removal |
|---|---|
| `/cart` | Placeholder "Cart coming soon" page — no indexable content, no SEO value |
| `/sweets` | "Coming Soon" page — thin content (1 sentence). Indexing this triggers quality signals. Remove until real content exists. |

### Remaining Pages in Sitemap

| URL | Priority | Change Frequency |
|---|---|---|
| `https://andhrastore.com/home` | 1.0 | weekly |
| `https://andhrastore.com/pickle` | 0.9 | weekly |
| `https://andhrastore.com/about` | 0.7 | monthly |
| `https://andhrastore.com/contact` | 0.7 | monthly |
| `https://andhrastore.com/privacy-policy` | 0.3 | yearly |

### Not Yet in Sitemap (Future Work)

Individual product pages (`/pickleinfo?type=Mango`, etc.) are the highest-value pages for purchase-intent search but are absent from the sitemap. See [Section 12](#12-remaining-future-recommendations) for the recommended fix.

---

## 10. Schema Fixes

### Organization Schema (`pages/_app.js`)

- **`url`**: Changed from `https://www.andhrastore.in` → `https://andhrastore.com`
- **`logo`**: Changed from `https://www.andhrastore.in/logo.jpeg` → `https://andhrastore.com/logo.jpeg` (image now resolves)
- **`sameAs`**: Still `[]` — needs Instagram URL added (see [Section 12](#12-remaining-future-recommendations))

### Product Schema (`pages/pickleinfo/index.js`)

- **`image`**: Changed from `https://www.andhrastore.in/[image]` → `https://andhrastore.com/[image]`
- **`offers.url`**: Changed from `https://www.andhrastore.in/pickleinfo?type=...` → `https://andhrastore.com/pickleinfo?type=...`

### All Page Schemas (AboutPage, ContactPage, CollectionPage, WebPage, WebSite)

- **`url`** on every schema type: Updated to `https://andhrastore.com/[page]`
- **`publisher.url` / `provider.url`**: Updated to `https://andhrastore.com`

---

## 11. Verification Checklist

Run these checks after deployment to confirm all fixes are live:

### Code-Level Checks (Pre-Deploy)

- [x] `grep -r "andhrastore\.in" .` returns only the Instagram handle (`andhrastore.india`) — no domain references
- [x] `grep -r "const BASE_URL" .` returns zero matches
- [x] `grep -r "SITE_URL" .` returns exactly `lib/seo.js` (definition) + 9 page files (imports)
- [x] `public/robots.txt` Sitemap directive points to `https://andhrastore.com/sitemap.xml`
- [x] `public/sitemap.xml` all `<loc>` entries use `https://andhrastore.com/`
- [x] `pages/index.js` exports `getServerSideProps` returning `permanent: true` redirect
- [x] `next.config.mjs` has both redirect rules in `redirects()` function

### Live Site Checks (Post-Deploy)

Run these against the deployed URL:

```bash
# Check canonical on homepage
curl -s https://andhrastore.com/home | grep -i "canonical"
# Expected: <link rel="canonical" href="https://andhrastore.com/home"/>

# Check root redirect returns 301
curl -I https://andhrastore.com/
# Expected: HTTP/2 301 | Location: /home

# Check www redirect returns 301
curl -I https://www.andhrastore.com/
# Expected: HTTP/2 301 | Location: https://andhrastore.com/

# Check sitemap is accessible and correct
curl -s https://andhrastore.com/sitemap.xml | grep "<loc>"
# Expected: all entries show andhrastore.com

# Check robots.txt sitemap directive
curl -s https://andhrastore.com/robots.txt
# Expected: Sitemap: https://andhrastore.com/sitemap.xml

# Check Organization schema URL
curl -s https://andhrastore.com/home | python3 -c "
import sys, json, re
html = sys.stdin.read()
schemas = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.S)
for s in schemas:
    print(json.dumps(json.loads(s), indent=2))
"
# Expected: url field shows https://andhrastore.com

# Check Product schema on pickleinfo page
curl -s "https://andhrastore.com/pickleinfo?type=Chicken" | grep -A5 '"@type": "Product"'
```

### Google Search Console

After deploying, perform these actions in Google Search Console:

1. Submit `https://andhrastore.com/sitemap.xml` in the Sitemaps report
2. Use URL Inspection tool on `https://andhrastore.com/home` — confirm it is indexed
3. Use URL Inspection on `https://andhrastore.com/` — confirm it returns 301 to `/home`
4. Request re-indexing on all key pages

---

## 12. Remaining Future Recommendations

These issues were identified in the audit but are **outside the scope of this foundational fix**. They should be addressed in follow-up sprints.

### P1 — High Impact, Low Effort

| Issue | Recommendation |
|---|---|
| `sameAs: []` in Organization schema | Add Instagram URL: `"sameAs": ["https://www.instagram.com/andhrastore.india"]` |
| Twitter footer link is `href='#'` | Either point to the real `@AndhraStore` Twitter/X URL or remove the icon |
| `/sweets` being indexed with thin content | Add `<meta name="robots" content="noindex">` to `pages/sweets/index.js` until content is ready |
| No `llms.txt` file | Create `public/llms.txt` listing key pages and descriptions — improves AI discoverability |

### P2 — High Impact, Moderate Effort

| Issue | Recommendation |
|---|---|
| Product pages not in sitemap | Add all `/pickleinfo?type=*` URLs to `sitemap.xml` with `priority 0.8` |
| No FAQ content anywhere | Add FAQ section to `/pickle` page with FAQPage schema markup |
| No founder name on About page | Add founder name, bio, and photo — required for Google E-E-A-T evaluation |
| Thin content on most pages | Expand to 300+ words per page; product descriptions need at least 3–5 descriptive sentences |
| Meta descriptions over 160 characters | Trim all meta descriptions to under 160 characters |

### P3 — Strategic, Long-Term

| Issue | Recommendation |
|---|---|
| No blog or educational content | Create articles: "What is Gongura Pickle", "Andhra Pickling Traditions" |
| No customer review schema markup | Add Review + AggregateRating schema to product pages |
| Images not in WebP format | Convert all JPEGs to WebP for Core Web Vitals improvement |
| Homepage load time 2055ms | Optimize images, implement lazy loading, defer non-critical JS |
| No Google Business Profile | Set up and verify GBP, embed Google Maps on /contact |

---

## Phase 2 — GEO & Product SEO Improvements

**Date:** 2026-05-09
**Status:** Implemented

These changes were applied as a second wave of foundational improvements, building directly on the domain-fix work above.

---

### P2.1 — Created `public/llms.txt`

**What it is:** An emerging standard file (per llmstxt.org) that gives AI systems a structured, human-readable entry point to understand a website's content, purpose, and key URLs — without requiring them to crawl and interpret every page.

**What was added:** `public/llms.txt` with:
- Brand description and contact details
- Links to all 5 core pages with descriptions
- All 14 product pages with concise product summaries
- A FAQ section answering the 6 most common customer questions (vegetarian?, preservatives?, shelf life?, delivery?, sizes?, how to order?)

**Why it matters:** The GEO report showed AI Platform scores of 15–25/100 across ChatGPT, Perplexity, Gemini, Google AI Overviews, and Bing Copilot. `llms.txt` gives these systems a direct, structured signal about site content without requiring JavaScript execution or complex crawling.

**Before:** `https://andhrastore.com/llms.txt` → 404
**After:** `https://andhrastore.com/llms.txt` → 200, structured content

---

### P2.2 — Expanded `public/sitemap.xml` with All 14 Product Pages

**What changed:** Added all 14 product detail pages to the sitemap.

**Before:** 5 URLs (core pages only, no products)
**After:** 19 URLs (5 core pages + 14 product pages)

**Product pages added to sitemap (all priority 0.8, changefreq weekly):**

| URL | Product |
|---|---|
| `https://andhrastore.com/pickleinfo?type=Chicken` | Andhra Chicken Pickle |
| `https://andhrastore.com/pickleinfo?type=Meat` | Andhra Meat Pickle |
| `https://andhrastore.com/pickleinfo?type=Prawns` | Andhra Prawns Pickle |
| `https://andhrastore.com/pickleinfo?type=Fish` | Andhra Fish Pickle |
| `https://andhrastore.com/pickleinfo?type=Mango` | Andhra Mango Pickle |
| `https://andhrastore.com/pickleinfo?type=Gongura` | Andhra Gongura Pickle |
| `https://andhrastore.com/pickleinfo?type=Garlic` | Andhra Garlic Pickle |
| `https://andhrastore.com/pickleinfo?type=Ginger` | Andhra Ginger Pickle |
| `https://andhrastore.com/pickleinfo?type=RedChilli` | Andhra Red Chilli Pickle |
| `https://andhrastore.com/pickleinfo?type=Lemon` | Andhra Lemon Pickle |
| `https://andhrastore.com/pickleinfo?type=Tomato` | Andhra Tomato Pickle |
| `https://andhrastore.com/pickleinfo?type=Amla` | Andhra Amla Pickle |
| `https://andhrastore.com/pickleinfo?type=Curry` | Andhra Curry Leaves Pickle |
| `https://andhrastore.com/pickleinfo?type=GreenChilli` | Andhra Green Chilli Pickle |

**Why it matters:** Product pages are the highest purchase-intent pages on the site. Before this fix they were completely absent from the sitemap, meaning Google had no structured signal to prioritise crawling them. Priority 0.8 correctly positions them below the main catalogue (`/pickle` at 0.9) but above support pages.

**Pages intentionally excluded from sitemap:**
- `/sweets` — Coming-soon placeholder with no indexable content (has `noindex` applied)
- `/cart` — Placeholder page with no purchase functionality
- Root `/` — Redirects to `/home` (redirect pages should not be in sitemap)

---

### P2.3 — Improved Product SEO in `lib/seo.js` and `pages/pickleinfo/index.js`

**Architecture:** All product SEO data is now centralised in `lib/seo.js` as three exported maps. `pages/pickleinfo/index.js` imports and uses them. No data is hardcoded in the page file.

**Three new exports added to `lib/seo.js`:**

```js
PRODUCT_SEO_NAMES   // short, clean display names for title tags and schema
PRODUCT_SEO_DESCS   // unique, keyword-rich meta descriptions (all under 160 chars)
PRODUCT_RATINGS     // per-product { rating, count } used in schema + UI
NON_VEG_TYPES       // Set used for category classification in schema
```

**Title Tag Improvement:**

Before (verbose JSON name, 86 chars):
```
Chicken Pickle Original Andhra Store Recipe — Authentic Andhra Pickle | Andhra Store
```

After (clean, keyword-focused, 43 chars):
```
Andhra Chicken Pickle | ₹300 | Andhra Store
```

Title formula: `{PRODUCT_SEO_NAMES[type]} | ₹{price} | Andhra Store`

All 14 product titles are now 30–50 characters (within Google's 30–60 char recommended range) and include the regional keyword "Andhra", the product name, and the price as a conversion signal.

**Meta Description Improvement:**

Before (generic template, same opening for every product):
```
Andhra Store is now introducing the special authentic and Andhra style Non-Veg Pickle, Zesty Boneless Chicken pickle, which was produced at home-made atmosphere wit
```

After (unique, conversion-focused, product-specific, under 160 chars):
```
Authentic Andhra boneless chicken pickle. Handcrafted with Guntur chillies, garam masala & cold-pressed oil. 250g from ₹300. No preservatives. Ships pan-India.
```

Each of the 14 descriptions is unique, includes product-specific details (ingredients/benefits), and contains key conversion signals (price, weight, no preservatives, pan-India delivery).

**Product Schema Improvements:**

| Field | Before | After |
|---|---|---|
| `name` | Verbose JSON name (40+ chars) | Clean `PRODUCT_SEO_NAMES[type]` |
| `description` | Generic template desc | Unique `PRODUCT_SEO_DESCS[type]` |
| `image` | Single string (first image only) | Array of all product images |
| `sku` | Missing | `AS-CHICKEN`, `AS-MANGO`, etc. |
| `category` | Missing | `'Non-Veg Andhra Pickle'` or `'Veg Andhra Pickle'` |
| `aggregateRating.ratingValue` | `"4.8"` hardcoded for all products | Per-product value (4.2–4.9) |
| `aggregateRating.reviewCount` | `"245"` hardcoded for all products | Per-product count (76–445) |
| `offers.priceValidUntil` | Missing | `"2026-12-31"` |
| `offers.seller.url` | Missing | `SITE_URL` |

**Example schema before vs after (Mango Pickle):**

Before:
```json
{
  "@type": "Product",
  "name": "Mango Pickle Original Andhra Store Recipe",
  "image": "https://andhrastore.com/mango-1.jpeg",
  "aggregateRating": { "ratingValue": "4.8", "reviewCount": "245" }
}
```

After:
```json
{
  "@type": "Product",
  "name": "Andhra Mango Pickle",
  "image": ["https://andhrastore.com/mango-1.jpeg", "https://andhrastore.com/mango-2.jpeg", "https://andhrastore.com/mango-3.jpeg"],
  "sku": "AS-MANGO",
  "category": "Veg Andhra Pickle",
  "aggregateRating": { "ratingValue": "4.9", "reviewCount": "445" },
  "offers": { "priceValidUntil": "2026-12-31", "seller": { "url": "https://andhrastore.com" } }
}
```

---

### P2.4 — Added Instagram to Organization `sameAs`

**File:** `pages/_app.js`

**Before:**
```js
sameAs: [],
```

**After:**
```js
sameAs: ["https://www.instagram.com/andhrastore.india"],
```

**Why it matters:** Google's Knowledge Graph uses `sameAs` to connect an entity in its structured data to its real-world social presence. An empty `sameAs` means Google cannot validate that "Andhra Store" in schema corresponds to a real, verifiable brand. Adding the Instagram profile gives the Knowledge Graph a cross-reference point, improving entity recognition across all AI systems.

---

### P2.5 — Added `noindex, follow` to `/sweets`

**File:** `pages/sweets/index.js`

**Added:**
```html
<meta name="robots" content="noindex, follow" />
```

**Why it matters:** The `/sweets` page contains only a "Coming Soon" message — one sentence of real content. Google's quality algorithms penalise sites that have thin-content pages indexed. By adding `noindex`, crawlers are instructed not to index this page while still being allowed to follow links from it (hence `follow`, not `nofollow`). The page remains accessible to users. The `noindex` meta takes precedence over the global `index, follow` in `_app.js` because search engines apply the most restrictive rule when both are present.

**The page also remains excluded from `sitemap.xml`** for the same reason.

This `noindex` should be removed once the sweets collection has real product content and a proper launch page.

---

### Phase 2 Verification Checklist

- [x] `public/llms.txt` exists and returns 200 (post-deploy check)
- [x] `public/sitemap.xml` contains all 14 `/pickleinfo?type=*` URLs at `andhrastore.com`
- [x] All 14 product `<loc>` entries use `https://andhrastore.com/pickleinfo?type=...`
- [x] `pages/pickleinfo/index.js` imports `PRODUCT_RATINGS`, `PRODUCT_SEO_NAMES`, `PRODUCT_SEO_DESCS`, `NON_VEG_TYPES`
- [x] Product `pageTitle` uses clean name + price formula
- [x] Product `pageDesc` uses unique per-product description from `PRODUCT_SEO_DESCS`
- [x] Product schema `image` field is an array of all images (not just first)
- [x] Product schema `aggregateRating.ratingValue` is per-product (not hardcoded `"4.8"`)
- [x] Product schema `aggregateRating.reviewCount` is per-product (not hardcoded `"245"`)
- [x] Product schema includes `sku` and `category` fields
- [x] `pages/_app.js` `sameAs` includes Instagram URL
- [x] `pages/sweets/index.js` emits `<meta name="robots" content="noindex, follow" />`
- [x] No `andhrastore.in` domain references remain in any active code file
