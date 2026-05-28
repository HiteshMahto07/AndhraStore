import "@/styles/globals.css";
import Head from 'next/head';
import CookieConsent from "@/components/CookieConsent";

const BASE_URL = "https://www.andhrastore.in";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Andhra Store",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.jpeg`,
  description: "Authentic handcrafted Andhra-style pickles made with traditional recipes. Pure, spicy, and delivered fresh across India.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8758302568",
    contactType: "customer service",
    availableLanguage: ["English", "Telugu", "Hindi"],
  },
  sameAs: [],
};

export default function App({ Component, pageProps }) {
  return (
    <>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </Head>
      <Component {...pageProps} />
      <CookieConsent />
    </>
  );
}
