import "@/styles/globals.css";
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Inter, Playfair_Display } from 'next/font/google';
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

// const SalePopup = dynamic(() => import('@/components/SalePopup'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} font-sans`}>
      <AuthProvider>
        <CartProvider>
          <Head>
            <title>Andhra Store | Authentic Andhra Pickles</title>
            <meta name="description" content="Experience the fiery flavors of Andhra Pradesh with our authentic, handcrafted pickles. From tangy mango avakaya to spicy chicken pickle — delivered fresh across India." />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#74A822" />
            <meta property="og:title" content="Andhra Store | Authentic Andhra Pickles" />
            <meta property="og:description" content="Handcrafted Andhra-style pickles made with traditional recipes. Pure, spicy, and delivered fresh to your doorstep." />
            <meta property="og:type" content="website" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
          {/* <SalePopup /> */}
          <CookieConsent />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}
