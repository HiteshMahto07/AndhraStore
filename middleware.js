/**
 * middleware.js — Next.js Edge Middleware
 *
 * Sets first-party attribution cookies from URL tracking parameters
 * BEFORE the page renders. This ensures attribution is captured even
 * if client-side JavaScript is slow to load or blocked.
 *
 * Strategy:
 *   as_attr_ft — first-touch, write-once (skip if already in request cookies)
 *   as_attr_lt — last-touch, always overwrite when tracking params are present
 *
 * Uses NextResponse.next() — never redirects, never rewrites the URL.
 * URL cleaning (removing UTMs from address bar) is handled client-side
 * via history.replaceState() in lib/attribution.js.
 */

import { NextResponse } from 'next/server';

const COOKIE_FIRST_TOUCH = 'as_attr_ft';
const COOKIE_LAST_TOUCH  = 'as_attr_lt';
const COOKIE_MAX_AGE     = 60 * 60 * 24 * 90; // 90 days

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'msclkid', 'ttclid',
];

export function middleware(request) {
  const { searchParams } = request.nextUrl;

  // Only run when tracking parameters are actually present in the URL.
  // Skipping the cookie work on every other request keeps the middleware
  // overhead near zero.
  const hasTracking = TRACKING_PARAMS.some((p) => searchParams.has(p));
  if (!hasTracking) {
    return NextResponse.next();
  }

  // Build attribution payload
  const utmSource   = searchParams.get('utm_source');
  const utmMedium   = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  const utmContent  = searchParams.get('utm_content');
  const utmTerm     = searchParams.get('utm_term');
  const gclid       = searchParams.get('gclid');
  const fbclid      = searchParams.get('fbclid');

  let source   = utmSource;
  let medium   = utmMedium;
  let campaign = utmCampaign;

  if (!source && gclid) {
    source = 'google';
    medium = 'cpc';
  } else if (!source && fbclid) {
    source = 'facebook';
    medium = 'paid_social';
  }

  if (!source) {
    source = '(direct)';
    medium = '(none)';
  }

  const payload = JSON.stringify({
    source,
    medium,
    campaign   : campaign  || null,
    content    : utmContent || null,
    term       : utmTerm    || null,
    gclid      : gclid      || null,
    fbclid     : fbclid     || null,
    ts         : Date.now(),
  });
  const encoded = encodeURIComponent(payload);

  const hostname     = request.nextUrl.hostname;
  const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';
  const domain       = isProduction ? `; Domain=.andhrastore.com` : '';
  const secure       = isProduction ? `; Secure` : '';
  const cookieBase   = `Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${domain}${secure}`;

  const response = NextResponse.next();

  // Last-touch: always set
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_LAST_TOUCH}=${encoded}; ${cookieBase}`,
  );

  // First-touch: only if not already in the incoming request cookies
  const existingFirstTouch = request.cookies.get(COOKIE_FIRST_TOUCH);
  if (!existingFirstTouch) {
    response.headers.append(
      'Set-Cookie',
      `${COOKIE_FIRST_TOUCH}=${encoded}; ${cookieBase}`,
    );
  }

  return response;
}

export const config = {
  // Run on all paths except:
  //   - Next.js internals (_next/*)
  //   - API routes (api/*)
  //   - Static files (anything with a file extension)
  //   - favicon
  matcher: ['/((?!api/|_next/|favicon\\.ico|.*\\..+).*)'],
};
