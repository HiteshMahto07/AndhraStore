import { Html, Head, Main, NextScript } from "next/document";

/**
 * Inline script executed synchronously BEFORE GTM loads.
 *
 * Execution order guaranteed by placement in <Head>:
 *   1. window.dataLayer initialized
 *   2. window.gtag function defined
 *   3. Consent Mode v2 defaults set — denied for new visitors; a returning
 *      visitor's saved choice (localStorage 'cookie-consent', written by
 *      CookieConsent.jsx) is applied HERE, synchronously, before gtm.js.
 *      Tags that require consent (Clarity, Meta) are evaluated once at
 *      "Container loaded"; if consent only arrived later via React's
 *      restoreConsent(), they were blocked for the whole page view.
 *   4. url_passthrough on — while ad_storage is denied, Google tags carry
 *      gclid/dclid across internal links in the URL instead of cookies, so
 *      Google Ads conversions can still be attributed (audit 2026-11-20, W-4).
 *      Keep GTM free of a conflicting url_passthrough setting (see GTM-9).
 *
 * wait_for_update: 500 still lets Google tags wait briefly for an update;
 * new visitors' Accept/Decline is pushed later as a 'consent_update' event
 * (lib/gtm.js) so GTM can fire the consent-gated page-load tags then.
 */
const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
var a=false,m=false;
try{var s=JSON.parse(localStorage.getItem('cookie-consent')||'null');
if(s){a=s.all===true||!!(s.preferences&&s.preferences.analytics===true);
m=s.all===true||!!(s.preferences&&s.preferences.marketing===true);}}catch(e){}
function c(x){return x?'granted':'denied';}
gtag('consent','default',{
  analytics_storage:c(a),
  ad_storage:c(m),
  ad_user_data:c(m),
  ad_personalization:c(m),
  wait_for_update:500
});
gtag('set','url_passthrough',true);
`.trim();

/**
 * Standard GTM loader — injected as async script, does not block rendering.
 * Reads the dataLayer (including the consent defaults above) immediately on load.
 * GTM container: GTM-KFNKBB87
 */
const GTM_LOADER_SCRIPT = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KFNKBB87');
`.trim();

export default function Document(props) {
  // No GTM (GA4 / Meta / Clarity) on the private /admin pages — store staff
  // checking orders shouldn't show up as site traffic.
  const isAdmin = props.__NEXT_DATA__?.page?.startsWith('/admin') ?? false;

  return (
    <Html lang="en">
      <Head>
        {/* ── Performance: preconnect to external origins ─────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Upgraded from dns-prefetch to preconnect for GTM.
          preconnect establishes TCP + TLS ahead of time, not just DNS resolution.
          Shaves ~100–200ms off GTM's first-byte time on mobile networks.
        */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Meta Business domain verification (required for Commerce Manager / Instagram Shopping).
            Value from Business Settings → Brand safety → Domains → Meta-tag method. */}
        {process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION && (
          <meta name="facebook-domain-verification" content={process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION} />
        )}

        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* ── Step 1: Consent Mode v2 defaults ────────────────────────────── */}
        {/*
          MUST execute before the GTM loader below.
          Sets all signals to 'denied' with a 500ms update window.
          See Section 8 of _docs/today-implementation-summary.md for full rationale.
        */}
        {!isAdmin && <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }} />}

        {/* ── Step 2: GTM loader (async, non-blocking) ────────────────────── */}
        {/*
          Injected as an async script — does not block HTML parsing or rendering.
          Reads the consent state already set above.
          Never fires GA4 or Meta tags until consent is updated to 'granted'.
        */}
        {!isAdmin && <script dangerouslySetInnerHTML={{ __html: GTM_LOADER_SCRIPT }} />}
      </Head>

      <body className="antialiased">
        {/* ── GTM noscript fallback ────────────────────────────────────────── */}
        {/*
          Renders a 0×0 hidden iframe for browsers with JavaScript disabled.
          Must appear as early in <body> as possible per GTM documentation.
          In Next.js Pages Router this is the earliest achievable placement.
        */}
        {!isAdmin && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KFNKBB87" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
