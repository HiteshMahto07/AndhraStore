import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, PhoneCall } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';
import { MERCHANT_RETURN_POLICY_SCHEMA } from '@/lib/schema';

const pageTitle = "Return & Refund Policy | Andhra Store";
const pageDesc = "Andhra Store's return and refund policy for food products. Understand when you qualify for a refund, how to raise a claim, and our 5–7 business day refund process.";
const pageUrl = `${SITE_URL}/return-policy`;

const sections = [
  {
    id: 'food-return-policy',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-100',
    title: 'Food Products — Return Policy',
    content: [
      'All food products sold by Andhra Store — including pickles, snacks, sweets, oils, and spices — are non-returnable once delivered.',
      'This applies to both opened and unopened products. Food items cannot be returned for hygiene and food safety reasons in accordance with standard food safety regulations.',
      'Once a food product leaves our facility and is delivered to you, we are unable to accept it back into our supply chain.',
      'This policy is in place to protect the health and safety of all our customers and to comply with applicable food safety standards.',
    ],
  },
  {
    id: 'refund-eligibility',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50 border-green-100',
    title: 'When You Are Eligible for a Full Refund',
    content: [
      'Product damaged during transit — broken glass jar, damaged lid, crushed packaging, or significant leakage.',
      'Wrong product delivered — you received a different product than what you ordered.',
      'Product arrived spoiled, tampered, or with a broken factory seal.',
      'Item missing from your order — you were charged for a product that was not included in your delivery.',
      'Product condition is significantly different from what is described on the product page.',
    ],
  },
  {
    id: 'how-to-claim',
    icon: RefreshCw,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-100',
    title: 'How to Initiate a Refund Claim',
    steps: [
      {
        step: '01',
        title: 'Contact us within 24 hours of delivery',
        desc: 'Refund claims must be raised within 24 hours of your order being delivered. Claims raised after this window cannot be accepted for food safety and logistics reasons.',
      },
      {
        step: '02',
        title: 'Send photo or video evidence',
        desc: 'Email us at Andhrastore.india@gmail.com or WhatsApp us at +91 8758302568 with clear photos or a short video showing the issue — damaged packaging, wrong product, or missing item.',
      },
      {
        step: '03',
        title: 'We verify your claim',
        desc: 'Our team reviews your claim within 2 business days of receiving your evidence. We may ask follow-up questions to understand the issue.',
      },
      {
        step: '04',
        title: 'Refund is initiated',
        desc: 'Once approved, your refund is initiated within 1 business day. The amount is credited back to your original payment method via Razorpay.',
      },
    ],
  },
  {
    id: 'not-eligible',
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 border-red-100',
    title: 'What Is Not Eligible for a Refund',
    content: [
      'Claims raised more than 24 hours after the delivery timestamp recorded by our courier partner.',
      'Opened products where the seal has been broken — once opened, we cannot verify the product condition or that it has been stored correctly.',
      'Taste or spice level preferences — all spice levels and ingredient details are clearly described on each product page before purchase.',
      'Change of mind after the product has been delivered.',
      'Products that have been used, consumed in part, or stored incorrectly after delivery.',
      'Damage to the product caused after delivery by the customer.',
    ],
  },
  {
    id: 'refund-timeline',
    icon: Clock,
    iconColor: 'text-olive-600',
    iconBg: 'bg-olive-50 border-olive-100',
    title: 'Refund Timeline',
    content: [
      'Approved refunds are processed within 1 business day of approval.',
      'The refund amount is credited to your original payment method — UPI, debit card, credit card, or net banking — via Razorpay.',
      'Funds typically appear in your account within 5–7 business days from the date the refund is initiated, depending on your bank or payment provider.',
      'We will notify you via email and WhatsApp as soon as your refund has been initiated.',
      'If you do not receive your refund within 7 business days, please contact us with your order ID and we will investigate with Razorpay.',
    ],
  },
  {
    id: 'cancellation',
    icon: PhoneCall,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 border-purple-100',
    title: 'Order Cancellation Policy',
    content: [
      'Orders can be cancelled before they are dispatched from our facility. Contact us immediately by phone or WhatsApp if you wish to cancel.',
      'Once an order has been dispatched and handed to our courier partner, it cannot be cancelled.',
      'For prepaid orders cancelled before dispatch, a full refund will be issued within 5–7 business days via Razorpay.',
      'To check if your order has been dispatched, contact us at +91 8758302568 with your order ID.',
    ],
  },
];

// Single source of truth — imported from lib/schema.js.
// Type is MerchantReturnFiniteReturnWindow (7 days) with food-product caveat.
// Do NOT redefine inline — keep in sync with _app.js global injection.
const returnPolicySchema = MERCHANT_RETURN_POLICY_SCHEMA;

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  description: pageDesc,
  url: pageUrl,
  publisher: { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/home` },
    { "@type": "ListItem", position: 2, name: "Return & Refund Policy", item: pageUrl },
  ],
};

export default function ReturnPolicy() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image"        content={`${SITE_URL}/pickle17.jpeg`} />
        <meta property="og:image:alt"    content="Andhra Store return and refund policy — food products, 7-day claim window" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(returnPolicySchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>
      <Header />

      <main className="bg-cream min-h-screen">

        {/* Hero */}
        <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white py-16 md:py-24" aria-label="Return policy hero">
          <div className="container-main text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6" aria-hidden="true">
              <RefreshCw size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Return &amp; Refund Policy</h1>
            <p className="text-olive-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              We want every order to reach you in perfect condition. If something goes wrong, this page explains exactly what we cover, what we don&apos;t, and how to get your refund quickly.
            </p>
            <p className="text-olive-300 text-xs mt-4">Last updated: May 21, 2026</p>
          </div>
        </section>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container-main pt-5 pb-1">
          <ol className="flex items-center gap-1.5 text-xs text-gray-400">
            <li><Link href="/home" className="hover:text-brand-500 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600 font-medium">Return &amp; Refund Policy</li>
          </ol>
        </nav>

        {/* Quick Summary Banner */}
        <section className="container-main pt-6 pb-2" aria-label="Policy summary">
          <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">Important — Please Read Before Ordering</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                All food products are <strong>non-returnable</strong> for hygiene and food safety reasons. However, if your order arrives
                damaged, incorrect, or spoiled — you are entitled to a <strong>full refund</strong>. Claims must be raised within
                <strong> 24 hours of delivery</strong> with photo or video evidence.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="container-main py-8 md:py-12" aria-labelledby="policy-sections-heading">
          <h2 id="policy-sections-heading" className="sr-only">Return and Refund Policy Sections</h2>
          <div className="max-w-3xl mx-auto space-y-6">

            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} id={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${section.iconBg}`} aria-hidden="true">
                      <Icon size={20} className={section.iconColor} />
                    </div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">{section.title}</h2>
                  </div>

                  {/* Steps layout for How to Claim section */}
                  {section.steps ? (
                    <ol className="space-y-4" role="list">
                      {section.steps.map((s) => (
                        <li key={s.step} className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-olive-600 text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">
                            {s.step}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 mb-0.5">{s.title}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="space-y-2.5" role="list">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-olive-400 flex-shrink-0" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Contact Card */}
            <div className="bg-olive-50 border border-olive-200 rounded-2xl p-6 md:p-8 text-center">
              <h2 className="text-lg font-heading font-bold text-gray-900 mb-2">Need to Raise a Claim?</h2>
              <p className="text-sm text-gray-600 mb-1">
                Contact us within <strong>24 hours of delivery</strong> with your order ID and photo or video evidence.
              </p>
              <p className="text-xs text-gray-400 mb-5">We respond to all refund queries within 24 hours on business days.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <a
                  href="mailto:Andhrastore.india@gmail.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors font-medium text-xs"
                >
                  📧 Andhrastore.india@gmail.com
                </a>
                <a
                  href="https://wa.me/918758302568"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                >
                  💬 WhatsApp: +91 87583 02568
                </a>
                <a
                  href="tel:+918758302568"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs"
                >
                  📞 +91 87583 02568
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
