import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { Shield, Lock, Eye, Cookie, Server, UserCheck } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

const pageTitle = "Privacy Policy | Andhra Store Data Protection";
const pageDesc = "Read how Andhra Store collects, uses, and protects your personal data. We are committed to transparency, security, and your privacy rights under applicable laws.";

const sections = [
  {
    icon: Eye,
    title: 'Information We Collect',
    content: [
      'Personal information such as your name, email address, phone number, and shipping address when you place an order.',
      'Payment information processed securely through our third-party payment providers.',
      'Browsing data such as pages visited, time spent, and device information for analytics purposes.',
      'Cookies and similar technologies to enhance your browsing experience.',
    ],
  },
  {
    icon: Server,
    title: 'How We Use Your Information',
    content: [
      'To process and fulfill your orders, including shipping and delivery.',
      'To communicate with you about your orders, promotions, and updates.',
      'To improve our website, products, and customer service.',
      'To personalize your shopping experience and recommend products.',
      'To comply with legal obligations and protect against fraud.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your personal data.',
      'All payment transactions are encrypted using SSL technology.',
      'We restrict access to personal information to authorized employees only.',
      'We regularly review and update our security practices to ensure data protection.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: [
      'We use essential cookies to ensure our website functions properly.',
      'Analytics cookies help us understand how visitors interact with our website.',
      'Marketing cookies may be used to deliver relevant advertisements.',
      'You can manage your cookie preferences through the cookie consent banner or your browser settings.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal data.',
      'You can opt out of marketing communications at any time.',
      'You may request a copy of all personal data we hold about you.',
      'You can withdraw consent for data processing where applicable.',
    ],
  },
  {
    icon: Shield,
    title: 'Third-Party Sharing',
    content: [
      'We do not sell your personal information to third parties.',
      'We may share data with trusted service providers who assist in our operations (e.g., shipping partners, payment processors).',
      'We may disclose information when required by law or to protect our rights.',
    ],
  },
];

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  description: pageDesc,
  url: `${SITE_URL}/privacy-policy`,
  publisher: {
    "@type": "Organization",
    name: "Andhra Store",
    url: SITE_URL,
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/privacy-policy`} />
        <meta property="og:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
        />
      </Head>
      <Header />

      <main className="bg-cream min-h-screen">
        <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white py-16 md:py-24" aria-label="Privacy policy hero">
          <div className="container-main text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6" aria-hidden="true">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Privacy Policy</h1>
            <p className="text-olive-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use our website and services. We are committed to being transparent and giving you control over your data.
            </p>
            <p className="text-olive-300 text-xs mt-4">Last updated: March 18, 2026</p>
          </div>
        </section>

        <section className="container-main py-12 md:py-16" aria-labelledby="privacy-sections-heading">
          <h2 id="privacy-sections-heading" className="sr-only">Privacy Policy Sections</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-olive-50 border border-olive-100" aria-hidden="true">
                      <Icon size={20} className="text-olive-600" />
                    </div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <ul className="space-y-2.5" role="list">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-olive-400 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="bg-olive-50 border border-olive-200 rounded-2xl p-6 md:p-8 text-center">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-2">Questions about your privacy?</h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions or concerns about this Privacy Policy, please contact us. We will respond to your inquiry within 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <a href="mailto:Andhrastore.india@gmail.com" className="inline-flex items-center gap-1.5 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors font-medium text-xs">
                  📧 Andhrastore.india@gmail.com
                </a>
                <a href="tel:+918758302568" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs">
                  📞 8758302568
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
