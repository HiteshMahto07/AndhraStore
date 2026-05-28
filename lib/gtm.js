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
export function updateConsent(analytics, marketing) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage  : analytics ? 'granted' : 'denied',
    ad_storage         : marketing  ? 'granted' : 'denied',
    ad_user_data       : marketing  ? 'granted' : 'denied',
    ad_personalization : marketing  ? 'granted' : 'denied',
  });
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
    updateConsent(analytics, marketing);
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
 */
export function pageview(url) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event        : 'pageview',
    page_location: url,
    page_title   : document.title,
  });
}
