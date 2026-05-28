import { Html, Head, Main, NextScript } from "next/document";

/**
 * Inline script executed synchronously BEFORE GTM loads.
 *
 * Execution order guaranteed by placement in <Head>:
 *   1. window.dataLayer initialized
 *   2. window.gtag function defined
 *   3. Consent Mode v2 defaults set (all denied, wait_for_update: 500ms)
 *
 * wait_for_update: 500 tells GTM to pause tag firing for up to 500ms in case
 * a returning visitor's consent is restored from localStorage by React.
 * Typical hydration + useEffect cycle = 50–200ms, well within this window.
 */
const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  analytics_storage:'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
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

export default function Document() {
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

        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* ── Step 1: Consent Mode v2 defaults ────────────────────────────── */}
        {/*
          MUST execute before the GTM loader below.
          Sets all signals to 'denied' with a 500ms update window.
          See Section 8 of _docs/today-implementation-summary.md for full rationale.
        */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }} />

        {/* ── Step 2: GTM loader (async, non-blocking) ────────────────────── */}
        {/*
          Injected as an async script — does not block HTML parsing or rendering.
          Reads the consent state already set above.
          Never fires GA4 or Meta tags until consent is updated to 'granted'.
        */}
        <script dangerouslySetInnerHTML={{ __html: GTM_LOADER_SCRIPT }} />
      </Head>

      <body className="antialiased">
        {/* ── GTM noscript fallback ────────────────────────────────────────── */}
        {/*
          Renders a 0×0 hidden iframe for browsers with JavaScript disabled.
          Must appear as early in <body> as possible per GTM documentation.
          In Next.js Pages Router this is the earliest achievable placement.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KFNKBB87" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
