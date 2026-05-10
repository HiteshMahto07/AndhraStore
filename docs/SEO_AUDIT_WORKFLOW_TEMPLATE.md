# SEO/GEO Technical Audit Workflow Template

**Version:** 1.0
**Created:** 2026-05-09
**Source:** Derived from Andhra Store SEO/GEO audit — adapted as a reusable SOP

This document is a reusable Standard Operating Procedure (SOP) for conducting a full technical SEO and GEO (Generative Engine Optimization) audit on any website. Follow each section in order. Each section includes investigation steps, grep commands, what to look for, and what "pass" and "fail" look like.

---

## Table of Contents

1. [Pre-Audit Setup](#1-pre-audit-setup)
2. [Domain & Canonical Mismatch Investigation](#2-domain--canonical-mismatch-investigation)
3. [Canonical Tag Inspection](#3-canonical-tag-inspection)
4. [Sitemap Auditing](#4-sitemap-auditing)
5. [robots.txt Validation](#5-robotstxt-validation)
6. [Schema Markup Auditing](#6-schema-markup-auditing)
7. [Redirect Auditing](#7-redirect-auditing)
8. [Homepage Crawlability Checks](#8-homepage-crawlability-checks)
9. [Product Page SEO Checks](#9-product-page-seo-checks)
10. [GEO/AI Visibility Checks](#10-geoai-visibility-checks)
11. [Verification Commands Reference](#11-verification-commands-reference)
12. [Grep Commands Reference](#12-grep-commands-reference)
13. [Implementation Workflow](#13-implementation-workflow)
14. [Post-Fix Validation Process](#14-post-fix-validation-process)

---

## 1. Pre-Audit Setup

### Gather Context First

Before running any tools, collect:

- [ ] What is the canonical domain? (e.g., `andhrastore.com`)
- [ ] Are there alternate domains? (www, .in, .co, etc.)
- [ ] What framework is the site built on? (Next.js, Nuxt, Gatsby, plain HTML, etc.)
- [ ] Where is it hosted? (Vercel, Netlify, AWS, etc.)
- [ ] Does the team own all alternate domain variants?
- [ ] What is the preferred www vs non-www convention?

### Establish the Authoritative Domain

Write it down before investigating:
```
CANONICAL_DOMAIN = "https://andhrastore.com"
```

Everything in the audit is measured against whether it correctly points to or represents this domain.

### Tools Needed

- `curl` — for live HTTP checks
- `grep` / `ripgrep` (`rg`) — for codebase scanning
- Browser DevTools — for inspecting rendered HTML
- Google Search Console (GSC) — for indexing status
- Rich Results Test — `https://search.google.com/test/rich-results`
- Schema Markup Validator — `https://validator.schema.org`
- Google PageSpeed Insights — `https://pagespeed.web.dev`

---

## 2. Domain & Canonical Mismatch Investigation

This is the highest-priority check. A domain mismatch silently destroys all SEO signals.

### Step 1 — Find Every Hardcoded Domain in the Codebase

```bash
# Find all domain references (replace "yourdomain" with your domain base)
grep -r "yourdomain\." . --include="*.{js,jsx,ts,tsx,json,xml,txt,env,mjs,cjs}" -l

# Show each match with line numbers
grep -rn "yourdomain\." . --include="*.{js,jsx,ts,tsx,json,xml,txt,env,mjs,cjs}"

# Find any .in, .co, .net, etc. variants that shouldn't be there
grep -rn "yourdomain\.in\|yourdomain\.co\|yourdomain\.net" . \
  --include="*.{js,jsx,ts,tsx,json,xml,txt,mjs}"
```

### Step 2 — Find Hardcoded BASE_URL or SITE_URL Constants

```bash
# Check for any hardcoded URL constants
grep -rn "BASE_URL\|SITE_URL\|BASE_DOMAIN\|CANONICAL_URL\|NEXT_PUBLIC_URL" . \
  --include="*.{js,jsx,ts,tsx,mjs}"

# Check environment variable files
cat .env .env.local .env.production 2>/dev/null | grep -i "url\|domain"
```

### Step 3 — Check next.config (for Next.js projects)

```bash
cat next.config.js 2>/dev/null || cat next.config.mjs 2>/dev/null
```

Look for:
- `env.SITE_URL` or similar domain config
- `images.domains` — should list the correct domain for Next.js Image optimization
- Existing `redirects()` or `rewrites()` that may conflict

### What to Look For

| Finding | Severity |
|---|---|
| Domain in code matches live site domain | PASS |
| Domain in code is an old/wrong domain (dev, staging, alternate TLD) | CRITICAL |
| Domain hardcoded in multiple places with no central constant | HIGH |
| No central config file — domain scattered across all page files | HIGH |
| Domain in `.env` file vs hardcoded in pages | Investigate which is actually used |

### Red Flags

- The codebase has a domain like `staging.`, `.in`, `.dev`, `.local`, or an old brand name
- Multiple different domains appear in the grep results
- The canonical domain in code does not match what the browser shows in the address bar
- There is no single file that controls the domain — it's in every page file

---

## 3. Canonical Tag Inspection

### Live Check — Inspect Canonical Tags on Key Pages

```bash
# Check canonical on homepage
curl -s https://yourdomain.com/ | grep -i "canonical"

# Check canonical on a product/category page
curl -s https://yourdomain.com/products | grep -i "canonical"

# Check canonical on a product detail page
curl -s "https://yourdomain.com/product?id=123" | grep -i "canonical"

# Check all pages in a loop (if you have a list)
for PAGE in "" "products" "about" "contact" "privacy-policy"; do
  echo "=== /$PAGE ==="
  curl -s "https://yourdomain.com/$PAGE" | grep -i "canonical"
done
```

### Code Check — Find Canonical Tag Generation

```bash
# Find where canonical tags are set
grep -rn "canonical" . --include="*.{js,jsx,ts,tsx}" | grep -v "node_modules"

# In Next.js: look for <link rel="canonical"
grep -rn 'rel="canonical"' . --include="*.{js,jsx,ts,tsx}"

# In Next.js App Router: look for metadata exports
grep -rn "alternates\|canonical" . --include="*.{ts,tsx,js,jsx}" | grep -v "node_modules"
```

### Canonical Tag Audit Table

For each key page, fill in:

| Page URL | Canonical Found | Canonical Points To | Status |
|---|---|---|---|
| `/` (root) | yes/no | [URL] | PASS/FAIL |
| `/home` or main page | yes/no | [URL] | PASS/FAIL |
| `/products` or equivalent | yes/no | [URL] | PASS/FAIL |
| `/product/[id]` | yes/no | [URL] | PASS/FAIL |
| `/about` | yes/no | [URL] | PASS/FAIL |
| `/contact` | yes/no | [URL] | PASS/FAIL |

### Pass Criteria

- PASS: Canonical is present and matches the page's own URL exactly (same protocol, same domain, same path)
- FAIL: Canonical is missing
- FAIL: Canonical points to a different domain (even a www vs non-www mismatch)
- FAIL: Canonical points to a staging URL
- FAIL: All pages have the same canonical (duplicate canonical bug)

---

## 4. Sitemap Auditing

### Step 1 — Fetch the Sitemap

```bash
# Check if sitemap exists
curl -I https://yourdomain.com/sitemap.xml
# Expected: HTTP 200

# Fetch and inspect content
curl -s https://yourdomain.com/sitemap.xml

# Extract all <loc> entries
curl -s https://yourdomain.com/sitemap.xml | grep -o '<loc>[^<]*</loc>'
```

### Step 2 — Verify Sitemap Domains

```bash
# Confirm all <loc> URLs use the correct domain
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>" | grep -v "yourdomain.com"
# Expected output: NOTHING (zero lines = all URLs use correct domain)

# Check for www vs non-www inconsistency
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>" | grep "www\."
```

### Step 3 — Check robots.txt Points to Correct Sitemap

```bash
curl -s https://yourdomain.com/robots.txt | grep -i "sitemap"
# Expected: Sitemap: https://yourdomain.com/sitemap.xml
```

### Step 4 — Cross-Reference Sitemap vs Live Pages

Compare what's in the sitemap against pages that actually exist and return 200:

```bash
# For each URL in the sitemap, check the HTTP status
curl -s https://yourdomain.com/sitemap.xml | grep -o 'https://[^<]*' | while read URL; do
  STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$URL")
  echo "$STATUS $URL"
done
```

### Sitemap Audit Checklist

- [ ] Sitemap exists at `/sitemap.xml`
- [ ] robots.txt `Sitemap:` directive points to `https://yourdomain.com/sitemap.xml`
- [ ] All `<loc>` URLs use the correct canonical domain (no www mismatch, no alternate TLD)
- [ ] All `<loc>` URLs return HTTP 200
- [ ] No placeholder/coming-soon pages in sitemap (`noindex` pages should not be here)
- [ ] No `/cart`, `/checkout`, `/account` type pages in sitemap
- [ ] Product/category pages that exist are listed
- [ ] Priority values make logical sense (homepage = 1.0, key pages = 0.7–0.9, secondary = 0.3–0.6)

---

## 5. robots.txt Validation

```bash
# Fetch robots.txt
curl -s https://yourdomain.com/robots.txt

# Check if any pages important to you are accidentally blocked
curl -s https://yourdomain.com/robots.txt | grep "Disallow"
```

### robots.txt Checklist

- [ ] File exists and returns HTTP 200
- [ ] `User-agent: *` rule is present
- [ ] `Allow: /` is present (or key paths are not disallowed)
- [ ] `Sitemap:` directive points to the correct canonical sitemap URL
- [ ] No important content paths are disallowed (check `/api/`, `/products/`, etc.)
- [ ] AI crawlers not blocked unnecessarily (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)

### Checking AI Crawler Access

```bash
ROBOTS=$(curl -s https://yourdomain.com/robots.txt)

for BOT in "GPTBot" "ClaudeBot" "PerplexityBot" "Google-Extended" "Bingbot"; do
  echo "=== $BOT ==="
  echo "$ROBOTS" | grep -A5 "User-agent: $BOT" || echo "No specific rule (inherits *)"
done
```

---

## 6. Schema Markup Auditing

### Step 1 — Extract All Schema from Key Pages

```bash
# Extract JSON-LD from a page (requires Python)
curl -s https://yourdomain.com/home | python3 -c "
import sys, json, re
html = sys.stdin.read()
schemas = re.findall(r'<script type=[\"|\']application/ld\+json[\"|\']>(.*?)</script>', html, re.S)
for i, s in enumerate(schemas):
    print(f'=== Schema {i+1} ===')
    try:
        print(json.dumps(json.loads(s), indent=2))
    except:
        print('PARSE ERROR:', s[:200])
"
```

### Step 2 — Check Schema URLs Match Canonical Domain

```bash
# Extract all URL values from schema markup across all pages
for PAGE in "home" "pickle" "about" "contact" "privacy-policy"; do
  echo "=== /$PAGE ==="
  curl -s "https://yourdomain.com/$PAGE" | \
    python3 -c "
import sys, json, re
html = sys.stdin.read()
schemas = re.findall(r'<script type=[\"|\']application/ld\+json[\"|\']>(.*?)</script>', html, re.S)
for s in schemas:
    try:
        obj = json.loads(s)
        for k, v in obj.items():
            if isinstance(v, str) and 'http' in v:
                print(f'  {k}: {v}')
    except: pass
"
done
```

### Step 3 — Validate Schema With Google's Tool

Open these URLs in a browser or run the API:
- Rich Results Test: `https://search.google.com/test/rich-results?url=https://yourdomain.com/product`
- Schema Validator: `https://validator.schema.org/#url=https://yourdomain.com/`

### Schema Audit Checklist

**Organization Schema (global, on every page):**
- [ ] `@type: Organization` present
- [ ] `url` matches canonical domain
- [ ] `logo` URL resolves to a real image (returns HTTP 200)
- [ ] `sameAs` includes social media profile URLs
- [ ] `contactPoint` is present

**Product Schema (product detail pages):**
- [ ] `@type: Product` present
- [ ] `image` URL resolves to a real image on the canonical domain
- [ ] `offers.url` points to the product page on the canonical domain
- [ ] `offers.price` and `offers.priceCurrency` are present
- [ ] `aggregateRating` is present with `ratingValue` and `reviewCount`

**WebSite/Page Schemas:**
- [ ] `url` matches the canonical page URL (not homepage URL for every page)
- [ ] `publisher.url` or `provider.url` matches canonical domain

---

## 7. Redirect Auditing

### Step 1 — Test Root URL Behavior

```bash
# Check what the root URL returns
curl -I https://yourdomain.com/
# Ideal: HTTP 301 Location: /home (or your main landing page)
# Bad: HTTP 200 with empty body (JS-only redirect)
# Bad: HTTP 302 (temporary redirect)
```

### Step 2 — Test www Redirect

```bash
curl -I https://www.yourdomain.com/
# Expected: HTTP 301 Location: https://yourdomain.com/
# Bad: HTTP 200 (www and non-www both work = duplicate content)
# Bad: HTTP 307/302 (temporary redirect = split link equity)
```

### Step 3 — Test HTTP → HTTPS Redirect

```bash
curl -I http://yourdomain.com/
# Expected: HTTP 301 Location: https://yourdomain.com/
```

### Step 4 — Check for Redirect Chains

```bash
# Follow all redirects and show each hop
curl -IL https://www.yourdomain.com/ 2>&1 | grep -E "HTTP|Location"
# Should show max 1-2 hops. 3+ hops = redirect chain problem.
```

### Step 5 — In Next.js: Check next.config for Redirect Rules

```bash
cat next.config.mjs | grep -A20 "redirects"
```

### Redirect Audit Checklist

- [ ] `https://yourdomain.com/` → 301 to main landing page (e.g., `/home`)
- [ ] `https://www.yourdomain.com/` → 301 to `https://yourdomain.com/`
- [ ] `http://yourdomain.com/` → 301 to `https://yourdomain.com/` (HTTPS enforcement)
- [ ] No redirect chains longer than 2 hops
- [ ] All redirects are 301 (permanent), not 302 or 307 (temporary)
- [ ] No redirect loops (A → B → A)

---

## 8. Homepage Crawlability Checks

This is critical because the root URL (`/`) carries the most authority. Many sites get this wrong.

### Step 1 — Fetch Root Without JavaScript

```bash
# Simulate a non-JS crawler
curl -s https://yourdomain.com/ | head -100
```

**What to look for:**
- Is there a `<title>` tag?
- Is there a `<meta name="description">`?
- Is there an `<h1>` tag?
- Is there any readable content in the HTML?
- Is there a `<link rel="canonical">`?

```bash
# Check for specific tags
curl -s https://yourdomain.com/ | grep -E "<title|<h1|canonical|description"
```

### Step 2 — Check for JS-Only Redirects

```bash
# Look for common JS redirect patterns
curl -s https://yourdomain.com/ | grep -E "window\.location|router\.push|router\.replace|history\.push"
```

If any of these appear AND the page has no server-rendered content, it is invisible to non-JS crawlers.

### Step 3 — Verify HTTP Status Is Correct

```bash
# Root should be 301 (redirect) or 200 (with content)
curl -o /dev/null -s -w "%{http_code}" https://yourdomain.com/
```

### Homepage Checklist

- [ ] Root URL returns either HTTP 301 (to main content) OR HTTP 200 with full content
- [ ] No JS-only redirect (`window.location`, `router.replace`) as the only navigation mechanism
- [ ] `<title>` is present in server-rendered HTML (not injected by JS)
- [ ] `<meta name="description">` is present in server-rendered HTML
- [ ] `<h1>` is present in server-rendered HTML
- [ ] `<link rel="canonical">` is present and correct
- [ ] JSON-LD schema is present in server-rendered HTML

---

## 9. Product Page SEO Checks

Product pages are the highest commercial-value pages. Apply extra scrutiny here.

### Check Individual Product Pages

```bash
# Replace with your actual product URL pattern
PRODUCT_URL="https://yourdomain.com/products/mango-pickle"

# Check all key meta tags
curl -s "$PRODUCT_URL" | grep -E "<title|<h1|canonical|description|og:title|og:description|og:image|og:url"

# Extract schema
curl -s "$PRODUCT_URL" | grep -o '"@type":"[^"]*"'
```

### Product Page Audit Checklist

**On-Page SEO:**
- [ ] `<title>` present, 30–60 characters, includes product name and brand
- [ ] `<meta name="description">` present, under 160 characters
- [ ] `<h1>` present, contains product name
- [ ] `<link rel="canonical">` present and points to the canonical product URL
- [ ] Word count exceeds 300 words on the page (including description, ingredients, etc.)

**Open Graph:**
- [ ] `og:title` present
- [ ] `og:description` present
- [ ] `og:url` matches canonical URL (correct domain)
- [ ] `og:image` present and resolves to a real image URL (correct domain, returns 200)
- [ ] `og:type` is `product` or `website`

**Schema Markup:**
- [ ] `Product` schema present with `@type: Product`
- [ ] `name` field present
- [ ] `description` field present
- [ ] `image` URL on correct canonical domain, image returns 200
- [ ] `offers` block present with `price`, `priceCurrency`, `availability`, `url`
- [ ] `offers.url` on correct canonical domain
- [ ] `aggregateRating` block present with `ratingValue` and `reviewCount`
- [ ] `brand` block present

**Sitemap:**
- [ ] Product page URL is in `sitemap.xml`
- [ ] Priority is 0.7–0.9 (high, below homepage)

---

## 10. GEO/AI Visibility Checks

Generative Engine Optimization (GEO) determines how likely your content is to be cited by AI systems (ChatGPT, Perplexity, Google AI Overviews, etc.).

### Check AI Crawler Access

```bash
curl -s https://yourdomain.com/robots.txt | grep -E "GPTBot|ClaudeBot|PerplexityBot|Google-Extended|Bingbot|CCBot"
# Ideal: no Disallow rules for these bots (they inherit Allow: / from *)
```

### Check for llms.txt (Emerging Standard)

```bash
curl -I https://yourdomain.com/llms.txt
# 200 = file exists (good for AI discoverability)
# 404 = missing (opportunity to add)
```

**What `llms.txt` should contain:**
```
# [Site Name]
> [One-line brand description]

## Key Pages
- [Page Name]: [URL] — [Short description]
- Products: https://yourdomain.com/products — Full product catalog
- About: https://yourdomain.com/about — Brand story and mission
```

### GEO Content Quality Checks

Run these manually by reviewing the page content:

- [ ] Does the About page name real people (founder, team)? — Required for E-E-A-T
- [ ] Does the site have verifiable social media profiles linked in schema `sameAs`?
- [ ] Do product pages answer common questions? (shelf life, ingredients, delivery, dietary restrictions)
- [ ] Is there FAQ content with FAQPage schema?
- [ ] Does the site have third-party citations (press coverage, food blogs, reviews)?
- [ ] Are there customer reviews with visible review text (not just star ratings)?

### AI Platform Readiness Checklist

| Signal | Checked | Status |
|---|---|---|
| AI crawlers not blocked in robots.txt | | PASS/FAIL |
| `llms.txt` exists | | PASS/FAIL |
| Organization schema has correct `url` | | PASS/FAIL |
| Organization schema has `sameAs` with social links | | PASS/FAIL |
| Named individuals on About/Contact pages | | PASS/FAIL |
| Product schema with `AggregateRating` | | PASS/FAIL |
| FAQ content with `FAQPage` schema | | PASS/FAIL |
| HTTPS enforced | | PASS/FAIL |
| No noindex on key content pages | | PASS/FAIL |
| Content exceeds 300 words on main pages | | PASS/FAIL |

---

## 11. Verification Commands Reference

Quick reference for all live-site checks. Replace `yourdomain.com` throughout.

```bash
# ── HTTP Status Checks ──────────────────────────────────────────
curl -o /dev/null -s -w "%{http_code}" https://yourdomain.com/         # root
curl -o /dev/null -s -w "%{http_code}" https://www.yourdomain.com/     # www
curl -I https://yourdomain.com/                                          # full headers

# ── Canonical Tag ────────────────────────────────────────────────
curl -s https://yourdomain.com/home | grep "canonical"

# ── robots.txt ──────────────────────────────────────────────────
curl -s https://yourdomain.com/robots.txt

# ── sitemap.xml ─────────────────────────────────────────────────
curl -s https://yourdomain.com/sitemap.xml
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>"

# ── All loc domains in sitemap ───────────────────────────────────
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>" | \
  grep -v "yourdomain.com"  # should return nothing

# ── Schema Extraction ────────────────────────────────────────────
curl -s https://yourdomain.com/home | python3 -c "
import sys, json, re
html = sys.stdin.read()
for s in re.findall(r'<script type=[\"|\']application/ld\+json[\"|\']>(.*?)</script>', html, re.S):
    try: print(json.dumps(json.loads(s), indent=2))
    except: print('PARSE ERROR')
"

# ── OG Tags ──────────────────────────────────────────────────────
curl -s https://yourdomain.com/home | grep -E "og:|twitter:"

# ── Redirect Chain ───────────────────────────────────────────────
curl -IL https://www.yourdomain.com/ 2>&1 | grep -E "HTTP|Location"

# ── Image URL Check ──────────────────────────────────────────────
curl -o /dev/null -s -w "%{http_code}" https://yourdomain.com/logo.jpeg

# ── llms.txt ────────────────────────────────────────────────────
curl -I https://yourdomain.com/llms.txt

# ── Page Speed ───────────────────────────────────────────────────
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://yourdomain.com/home
```

---

## 12. Grep Commands Reference

Commands for scanning the codebase (run from project root). Replace `yourdomain` and `wrongdomain`.

```bash
# ── Find wrong domain references ────────────────────────────────
grep -rn "wrongdomain\." . --include="*.{js,jsx,ts,tsx,json,xml,txt,mjs}"

# ── Find all BASE_URL or similar constants ───────────────────────
grep -rn "BASE_URL\|SITE_URL\|BASE_DOMAIN\|CANONICAL" . \
  --include="*.{js,jsx,ts,tsx,mjs}" | grep -v node_modules

# ── Find all hardcoded http(s):// URLs ───────────────────────────
grep -rn "https://" . --include="*.{js,jsx,ts,tsx,mjs}" | \
  grep -v node_modules | grep -v "instagram\|twitter\|facebook\|google\|wa.me\|schema.org\|fonts"

# ── Find canonical tags ──────────────────────────────────────────
grep -rn 'canonical' . --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# ── Find og: meta tags ───────────────────────────────────────────
grep -rn '"og:' . --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# ── Find schema markup (@type) ───────────────────────────────────
grep -rn '"@type"' . --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# ── Find sitemap entries ─────────────────────────────────────────
grep -n "<loc>" public/sitemap.xml

# ── Find robots.txt sitemap directive ───────────────────────────
grep -n "Sitemap" public/robots.txt

# ── Find all router.replace / window.location (JS redirects) ────
grep -rn "router\.replace\|router\.push\|window\.location" . \
  --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# ── Confirm no wrong domain remains after fix ───────────────────
grep -rn "wrongdomain\." . --include="*.{js,jsx,ts,tsx,xml,txt,mjs}" | grep -v node_modules
# Expected: zero output (or only false positives like Instagram handle)

# ── Confirm correct domain is in place ──────────────────────────
grep -rn "yourdomain\.com" . --include="*.{js,jsx,ts,tsx,xml,txt,mjs}" | grep -v node_modules
```

---

## 13. Implementation Workflow

Follow this sequence when implementing SEO domain fixes to minimize risk and maximize correctness.

### Phase 1 — Investigation (Read-Only)

1. Collect the canonical domain from the team
2. Run all grep commands to identify affected files
3. Build a complete inventory table: File | What it controls | Specific lines | Fix needed
4. Identify whether a central config exists or if constants are scattered
5. Check for `.env` variables that may override hardcoded values
6. Identify static files (robots.txt, sitemap.xml) vs dynamic files (pages)

### Phase 2 — Planning

1. Determine: create a central config file, or just replace strings?
   - If domain appears in 3+ files → create a central `lib/seo.js` (or equivalent)
   - If domain appears in 1–2 files → direct string replacement is fine
2. Decide the canonical domain format: with www or without www?
3. Plan the redirect architecture: what should www do? What should root `/` do?
4. Identify which pages should NOT be in the sitemap (placeholder, noindex, cart, etc.)
5. Review schema markup for what else needs updating (sameAs, logo, etc.)

### Phase 3 — Implementation Order

Execute in this order to avoid partial states:

```
1. Create lib/seo.js (or equivalent central config) with correct SITE_URL
2. Update all page files (in parallel — they're independent)
   - Remove local BASE_URL constant
   - Add import from central config
   - Replace all usages (use replace_all for safety)
3. Update public/robots.txt
4. Update public/sitemap.xml
5. Update next.config.mjs / vercel.json for redirects
6. Update pages/index.js (or equivalent root) for server-side redirect
```

### Phase 4 — Verification (Pre-Deploy)

```bash
# 1. Zero wrong domain references remaining
grep -rn "wrongdomain\." . --include="*.{js,jsx,ts,tsx,xml,txt,mjs}" | grep -v node_modules

# 2. Zero local BASE_URL constants remaining
grep -rn "const BASE_URL" . --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# 3. Central config is imported in all page files
grep -rn "SITE_URL" . --include="*.{js,jsx,ts,tsx}" | grep -v node_modules

# 4. robots.txt has correct Sitemap directive
grep "Sitemap" public/robots.txt

# 5. sitemap.xml has no wrong domains
grep "<loc>" public/sitemap.xml | grep -v "yourdomain.com"
# Expected: zero output

# 6. Root page has server-side redirect (no JS-only redirect)
grep -n "getServerSideProps\|permanent" pages/index.js  # Next.js example
```

### Phase 5 — Deploy

1. Deploy to staging first if available
2. Run live HTTP checks against staging URL
3. Deploy to production
4. Immediately run post-deploy checks (Section 14)
5. Submit sitemap to Google Search Console
6. Request re-indexing of key pages in GSC

---

## 14. Post-Fix Validation Process

Run this checklist within 30 minutes of deploying to production.

### Immediate Checks (Day 0)

```bash
# 1. Root redirect
curl -I https://yourdomain.com/
# Expected: 301 → /home (or main page)

# 2. www redirect
curl -I https://www.yourdomain.com/
# Expected: 301 → https://yourdomain.com/

# 3. Main page canonical
curl -s https://yourdomain.com/home | grep "canonical"
# Expected: href="https://yourdomain.com/home"

# 4. robots.txt
curl -s https://yourdomain.com/robots.txt
# Expected: Sitemap: https://yourdomain.com/sitemap.xml

# 5. sitemap.xml domains
curl -s https://yourdomain.com/sitemap.xml | grep "<loc>"
# Expected: all lines show https://yourdomain.com/

# 6. Organization schema URL
curl -s https://yourdomain.com/home | grep -A2 '"@type":"Organization"'
# Expected: "url": "https://yourdomain.com"
```

### Google Search Console Actions (Day 0–1)

1. Navigate to: GSC → Sitemaps → Submit `https://yourdomain.com/sitemap.xml`
2. Navigate to: GSC → URL Inspection → Enter `https://yourdomain.com/home` → Request Indexing
3. Repeat URL Inspection for: `/pickle`, `/about`, `/contact`
4. Navigate to: GSC → Coverage → monitor for new indexed pages over 3–7 days

### Follow-Up Checks (Day 3–7)

- [ ] GSC shows new pages being indexed under `yourdomain.com`
- [ ] GSC shows no coverage errors for the corrected URLs
- [ ] GSC sitemap report shows URLs being discovered
- [ ] Rich Results Test passes for product pages (if Product schema is present)
- [ ] Google AI Overviews: search for your brand name and key products — check if `yourdomain.com` begins appearing as the cited source (takes weeks for full effect)

### Regression Check

```bash
# One week after deploy — confirm no wrong domain crept back in
grep -rn "wrongdomain\." . --include="*.{js,jsx,ts,tsx,xml,txt,mjs}" | grep -v node_modules
# Expected: zero output (or only known false positives)
```

---

*This SOP was developed during the Andhra Store SEO/GEO audit (2026-05-09). It is designed to be project-agnostic — substitute your domain names and file paths as appropriate.*
