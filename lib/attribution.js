/**
 * lib/attribution.js
 *
 * First-party marketing attribution for Andhra Store.
 *
 * Two cookies track the user's acquisition journey:
 *   as_attr_ft — first-touch (written once, never overwritten)
 *   as_attr_lt — last-touch  (updated on every new external entry)
 *
 * Both are JSON objects encoded with encodeURIComponent so they're
 * human-readable in DevTools without a decoder.
 *
 * Entry point: call captureAttribution() on page mount and on every
 * SPA routeChangeComplete. Internal navigations are ignored automatically.
 */

const COOKIE_FIRST_TOUCH = 'as_attr_ft';
const COOKIE_LAST_TOUCH  = 'as_attr_lt';
const COOKIE_MAX_AGE     = 60 * 60 * 24 * 90; // 90 days in seconds

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'msclkid', 'ttclid',
];

// ─── Source classification ────────────────────────────────────────────────────

const ORGANIC_SEARCH_HOSTS = [
  'google.', 'bing.', 'yahoo.', 'duckduckgo.', 'baidu.', 'yandex.', 'ask.',
];

const SOCIAL_HOSTS = {
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'instagram.com': 'instagram',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'linkedin.com': 'linkedin',
  'pinterest.com': 'pinterest',
  't.co': 'twitter',
};

function classifyReferrer(referrer) {
  if (!referrer) return null;
  let hostname;
  try {
    hostname = new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  for (const pattern of ORGANIC_SEARCH_HOSTS) {
    if (hostname.includes(pattern)) {
      return { source: hostname.split('.')[0], medium: 'organic' };
    }
  }

  for (const [host, name] of Object.entries(SOCIAL_HOSTS)) {
    if (hostname === host || hostname.endsWith('.' + host)) {
      return { source: name, medium: 'social' };
    }
  }

  return { source: hostname, medium: 'referral' };
}

// ─── Internal navigation check ────────────────────────────────────────────────

function isInternalReferrer() {
  if (typeof window === 'undefined' || !document.referrer) return false;
  try {
    const referrerHost = new URL(document.referrer).hostname;
    const ownHost = window.location.hostname;
    return (
      referrerHost === ownHost ||
      referrerHost.endsWith('.andhrastore.com') ||
      referrerHost === 'localhost' ||
      referrerHost === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

// ─── Cookie read / write ──────────────────────────────────────────────────────

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.slice(name.length + 1)));
  } catch {
    return null;
  }
}

function writeCookie(name, payload) {
  if (typeof document === 'undefined') return;
  const encoded = encodeURIComponent(JSON.stringify(payload));
  const isProduction = window.location.hostname !== 'localhost' &&
                       window.location.hostname !== '127.0.0.1';
  const domain = isProduction ? '; Domain=.andhrastore.com' : '';
  const secure  = isProduction ? '; Secure' : '';
  document.cookie =
    `${name}=${encoded}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${domain}${secure}`;
}

function eraseCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

// ─── Build attribution payload ────────────────────────────────────────────────

function buildPayload(params, referrer) {
  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key) || null;

  // Explicit UTM params take priority over everything
  const utmSource   = get('utm_source');
  const utmMedium   = get('utm_medium');
  const utmCampaign = get('utm_campaign');
  const utmContent  = get('utm_content');
  const utmTerm     = get('utm_term');
  const gclid       = get('gclid');
  const fbclid      = get('fbclid');

  let source   = utmSource;
  let medium   = utmMedium;
  let campaign = utmCampaign;

  // Auto-classify from click IDs if no utm_source
  if (!source && gclid) {
    source = 'google';
    medium = 'cpc';
  } else if (!source && fbclid) {
    source = 'facebook';
    medium = 'paid_social';
  }

  // Fall back to referrer classification
  if (!source) {
    const classified = classifyReferrer(referrer || document.referrer);
    if (classified) {
      source   = classified.source;
      medium   = classified.medium;
      campaign = null;
    }
  }

  // Still nothing — direct / typed
  if (!source) {
    source = '(direct)';
    medium = '(none)';
  }

  return {
    source,
    medium,
    campaign   : campaign   || null,
    content    : utmContent || null,
    term       : utmTerm    || null,
    gclid      : gclid      || null,
    fbclid     : fbclid     || null,
    ts         : Date.now(),
  };
}

function hasTrackingParams() {
  if (typeof window === 'undefined') return false;
  const url = new URL(window.location.href);
  return TRACKING_PARAMS.some((p) => url.searchParams.has(p));
}

// ─── URL cleaning ─────────────────────────────────────────────────────────────

export function cleanTrackingParams() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  let removed = false;
  TRACKING_PARAMS.forEach((p) => {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p);
      removed = true;
    }
  });

  if (!removed) return;

  // url.search is '' (not '?') when all params are deleted — no trailing question mark.
  // url.hash is '' when absent. Relative path avoids any full-URL encoding surprises.
  const cleanPath = url.pathname + url.search + url.hash;

  if (process.env.NODE_ENV === 'development') {
    console.debug('[AndhraAttr] cleanTrackingParams →', cleanPath);
  }

  try {
    // Spread the existing history.state so Next.js router internals are preserved,
    // but override the `url` and `as` fields — the two fields Next.js reads to
    // restore the displayed URL on HMR rebuilds and router.back() calls.
    // Without updating these, Fast Refresh reads history.state.as and restores
    // the original UTM URL, undoing the replaceState on every hot reload.
    const prevState = history.state;
    const nextState =
      prevState && typeof prevState === 'object'
        ? { ...prevState, url: cleanPath, as: cleanPath }
        : {};
    history.replaceState(nextState, '', cleanPath);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AndhraAttr] history.replaceState failed:', err);
    }
  }
}

// ─── Main capture function ────────────────────────────────────────────────────

/**
 * Detects attribution signals from the current URL and referrer,
 * writes/updates the first-touch and last-touch cookies, then
 * removes tracking params from the browser address bar.
 *
 * Safe to call on every page mount and routeChangeComplete — internal
 * navigations are detected and skipped automatically.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;

  const hasParams  = hasTrackingParams();
  const isInternal = isInternalReferrer();

  if (process.env.NODE_ENV === 'development') {
    console.debug('[AndhraAttr] captureAttribution', {
      hasParams,
      isInternal,
      href: window.location.href,
    });
  }

  if (hasParams) {
    // Read URL params into payload BEFORE cleanTrackingParams() is called from
    // _app.js — buildPayload() reads window.location.href which still has UTMs here.
    const payload = buildPayload();
    if (!readCookie(COOKIE_FIRST_TOUCH)) {
      writeCookie(COOKIE_FIRST_TOUCH, payload);
    }
    writeCookie(COOKIE_LAST_TOUCH, payload);
    // URL cleaning is NOT done here. _app.js calls cleanTrackingParams()
    // explicitly after captureAttribution() so it always runs as a separate step.
    return;
  }

  // No tracking params — skip internal SPA navigations entirely.
  if (isInternal) return;

  // Direct load (no referrer, no params): avoid overwriting a paid attribution
  // from a previous session with "(direct) / (none)".
  if (!document.referrer) {
    if (readCookie(COOKIE_LAST_TOUCH)) return;
  }

  // Referrer-based entry (organic search, social, referral site).
  const payload = buildPayload();
  if (!readCookie(COOKIE_FIRST_TOUCH)) {
    writeCookie(COOKIE_FIRST_TOUCH, payload);
  }
  writeCookie(COOKIE_LAST_TOUCH, payload);
}

// ─── Read helpers ─────────────────────────────────────────────────────────────

export function getFirstTouch() {
  return readCookie(COOKIE_FIRST_TOUCH);
}

export function getLastTouch() {
  return readCookie(COOKIE_LAST_TOUCH);
}

/**
 * Returns a flat object ready to spread into a GTM dataLayer push.
 * All keys are always present (null when unknown).
 * Called inside pushPurchase() in lib/analytics.js.
 */
export function getAttributionPayload() {
  if (typeof window === 'undefined') return {};

  const ft = readCookie(COOKIE_FIRST_TOUCH);
  const lt = readCookie(COOKIE_LAST_TOUCH);

  if (!lt && !ft) return {};

  const active = lt || ft;

  return {
    utm_source         : active.source   || null,
    utm_medium         : active.medium   || null,
    utm_campaign       : active.campaign || null,
    utm_content        : active.content  || null,
    utm_term           : active.term     || null,
    gclid              : active.gclid    || null,
    fbclid             : active.fbclid   || null,
    first_touch_source : ft ? `${ft.source} / ${ft.medium}` : null,
    last_touch_source  : lt ? `${lt.source} / ${lt.medium}` : null,
    attribution_ts     : active.ts       || null,
  };
}

/**
 * Constructs Meta's fbc cookie format: fb.1.<ts>.<fbclid>
 * Falls back to the existing _fbc cookie Meta Pixel may have set.
 */
export function getFbcValue() {
  if (typeof document === 'undefined') return null;

  // Prefer Meta Pixel's own _fbc cookie
  const metaFbc = readCookieRaw('_fbc');
  if (metaFbc) return metaFbc;

  // Construct from stored fbclid
  const lt = getLastTouch();
  if (lt && lt.fbclid) {
    return `fb.1.${lt.ts}.${lt.fbclid}`;
  }

  return null;
}

function readCookieRaw(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

// ─── Dev debug utilities ──────────────────────────────────────────────────────

/**
 * Exposed as window.__andhraAttribution in development builds.
 * Allows quick inspection and cookie clearing from the browser console.
 */
export function debugAttribution() {
  if (typeof window === 'undefined') return null;
  const ft      = getFirstTouch();
  const lt      = getLastTouch();
  const payload = getAttributionPayload();
  const result  = { firstTouch: ft, lastTouch: lt, payload };
  console.group('[AndhraStore Attribution]');
  console.log('First Touch:', ft);
  console.log('Last Touch :', lt);
  console.log('GTM Payload:', payload);
  console.groupEnd();
  return result;
}

export function clearAttributionCookies() {
  eraseCookie(COOKIE_FIRST_TOUCH);
  eraseCookie(COOKIE_LAST_TOUCH);
  if (process.env.NODE_ENV === 'development') {
    console.log('[AndhraStore Attribution] Cookies cleared.');
  }
}
