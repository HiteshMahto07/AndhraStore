/**
 * lib/gtm.js  —  CLIENT-SIDE ONLY (SSR-safe via window guards)
 *
 * Three responsibilities:
 *   1. GTM_ID — single source of truth for the container ID
 *   2. updateConsent() — maps our boolean toggles to Consent Mode v2 signals
 *   3. restoreConsent() — re-applies saved consent on every page load (returning visitors)
 *   4. pageview() — pushes a custom 'pageview' event for SPA route changes
 *
 * Import updateConsent + restoreConsent from CookieConsent.jsx.
 * Import pageview from _app.js for routeChangeComplete events.
 * Never import this from pages/api/ routes.
 */

export const GTM_ID = 'GTM-KFNKBB87';

// ─── Consent Mode v2 ─────────────────────────────────────────────────────────

/**
 * Maps our two internal boolean toggles to the four Consent Mode v2 signals.
 *
 * Signal mapping (per documentation Section 8):
 *   analytics ON  → analytics_storage: 'granted'
 *   marketing ON  → ad_storage + ad_user_data + ad_personalization: 'granted'
 *
 * Called on: Accept all, Decline, Save preferences, page load (restore).
 */
export function updateConsent(analytics, marketing, { notify = true } = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage  : analytics ? 'granted' : 'denied',
    ad_storage         : marketing  ? 'granted' : 'denied',
    ad_user_data       : marketing  ? 'granted' : 'denied',
    ad_personalization : marketing  ? 'granted' : 'denied',
  });

  // A visitor's own choice (Accept / Decline / Save) gets a dataLayer event so
  // GTM can fire consent-gated page-load tags (Clarity, Meta PageView) that
  // were blocked at "Container loaded". GTM trigger: Custom Event consent_update.
  // Not pushed on restore — saved consent is already applied before gtm.js.
  if (notify) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event             : 'consent_update',
      analytics_consent : analytics ? 'granted' : 'denied',
      marketing_consent : marketing ? 'granted' : 'denied',
    });
  }
}

/**
 * Reads the saved 'cookie-consent' from localStorage and calls updateConsent().
 *
 * Called once on every page load from CookieConsent's mount effect.
 * Ensures returning visitors who previously accepted are not stuck at defaults.
 * Fires within the 500ms wait_for_update window set in _document.js.
 *
 * localStorage shape written by CookieConsent:
 *   { accepted: bool, all: bool, preferences: { analytics: bool, marketing: bool }, date: string }
 */
export function restoreConsent() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('cookie-consent');
    if (!raw) return;
    const saved = JSON.parse(raw);
    const analytics = saved.all === true || saved.preferences?.analytics === true;
    const marketing  = saved.all === true || saved.preferences?.marketing  === true;
    // Belt-and-braces: _document.js already applied this before gtm.js loaded.
    updateConsent(analytics, marketing, { notify: false });
  } catch {
    // Corrupted localStorage — consent stays at defaults (denied). Safe failure.
  }
}

// ─── SPA pageview tracking ────────────────────────────────────────────────────

/**
 * Pushes a custom 'pageview' event to the dataLayer for SPA route changes.
 *
 * Called from _app.js on router.events 'routeChangeComplete'.
 * GTM trigger: Custom Event — pageview (separate from built-in All Pages).
 * The initial page load fires the built-in gtm.js event; this handles all
 * subsequent navigations without duplicating the first-load page view.
 *
 * page_location MUST be an absolute URL. Next.js passes routeChangeComplete a
 * path only ("/pickles/x"); GA4 derives hostname from page_location, so a bare
 * path produced page_views with an empty hostname.
 * page_referrer is the previous in-app URL — without it every SPA page_view
 * reports the original landing referrer.
 */
let lastLocation = typeof window !== 'undefined' ? window.location.href : '';

export function pageview(url) {
  if (typeof window === 'undefined') return;
  const location = new URL(url, window.location.origin).href;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event        : 'pageview',
    page_location: location,
    page_referrer: lastLocation || document.referrer,
    page_title   : document.title,
  });
  lastLocation = location;
}
