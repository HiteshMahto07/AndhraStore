import "@/styles/globals.css";
import Head from 'next/head';
// import SalePopup from "@/components/SalePopup";
import CookieConsent from "@/components/CookieConsent";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Andhra Store | Authentic Andhra Pickles</title>
        <meta name="description" content="Experience the fiery flavors of Andhra Pradesh with our authentic, handcrafted pickles. From tangy mango avakaya to spicy chicken pickle — delivered fresh across India." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2D5A3D" />
        <meta property="og:title" content="Andhra Store | Authentic Andhra Pickles" />
        <meta property="og:description" content="Handcrafted Andhra-style pickles made with traditional recipes. Pure, spicy, and delivered fresh to your doorstep." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      {/* <SalePopup /> */}
      <CookieConsent />
    </>
  );
}
