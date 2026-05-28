import "@/styles/globals.css";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CookieConsent from "@/components/CookieConsent";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from '@/context/CartContext';
import { pageview } from '@/lib/gtm';
import { captureAttribution, cleanTrackingParams, debugAttribution, clearAttributionCookies } from '@/lib/attribution';
import {
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
  MERCHANT_RETURN_POLICY_SCHEMA,
  SHIPPING_DETAILS,
} from '@/lib/schema';

// Shipping policy needs @context for standalone injection;
// the object itself is also referenced by @id from every product offer.
const SHIPPING_SCHEMA = { "@context": "https://schema.org", ...SHIPPING_DETAILS };

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // On initial mount: capture attribution cookies from the landing URL,
  // then immediately clean tracking params from the address bar.
  // These are two explicit independent calls — cleanTrackingParams() is not
  // buried inside captureAttribution() so it always runs even if cookie
  // writing is skipped (e.g., returning visitor with existing cookies).
  useEffect(() => {
    captureAttribution();    // reads URL params → writes as_attr_ft / as_attr_lt
    cleanTrackingParams();   // removes UTMs from address bar via history.replaceState

    if (process.env.NODE_ENV === 'development') {
      window.__andhraAttribution = {
        debug    : debugAttribution,
        clearAll : clearAttributionCookies,
      };
    }
  }, []);

  // Track SPA navigations as pageview events in GTM.
  // The initial page load is handled by GTM's built-in gtm.js event (All Pages trigger).
  // routeChangeComplete fires for every subsequent client-side navigation.
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
      // captureAttribution() is a fast no-op for normal internal link clicks
      // (no UTMs + same-origin referrer). Only acts when UTMs appear in the
      // URL — e.g., a shared UTM link opened inside the SPA.
      captureAttribution();
      cleanTrackingParams();
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    // CartProvider wraps the entire app so every page and component
    // can access cart state via useCart() without prop drilling
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2D5A3D" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Andhra Store" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AndhraStore" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA)           }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA)               }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(MERCHANT_RETURN_POLICY_SCHEMA) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SHIPPING_SCHEMA)              }} />
      </Head>

      <Component {...pageProps} />

      {/* CartDrawer is a singleton mounted at the app root.
          It reads open/close state and cart items from CartContext directly,
          so it never needs to be re-mounted when navigating between pages. */}
      <CartDrawer />

      <CookieConsent />
    </CartProvider>
  );
}
