import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';
import { pushGenerateLead } from '@/lib/analytics';

const pageTitle = "Contact Andhra Store — Get in Touch with Us";
const pageDesc = "Reach out to Andhra Store for orders, queries, or bulk pickle inquiries. Call us at 8758302568 or email Andhrastore.india@gmail.com. Located in Nani Daman, Daman & Diu.";

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Location',
    lines: ['Andhra Store, Vikas Enclave,', 'Shop No-06, Nani Daman,', 'Daman and Diu — 396210'],
    color: 'brand',
  },
  {
    icon: Phone,
    title: 'Customer Support',
    lines: ['Phone: 8758302568, 8799114169'],
    color: 'olive',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['Andhrastore.india@gmail.com'],
    sub: 'For bulk orders & queries',
    color: 'brand',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['7 Days a week from 10:00 am'],
    color: 'olive',
  },
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: pageTitle,
  description: pageDesc,
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: "Andhra Store",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vikas Enclave, Shop No-06",
      addressLocality: "Nani Daman",
      addressRegion: "Daman and Diu",
      postalCode: "396210",
      addressCountry: "IN",
    },
    telephone: "+91-8758302568",
    email: "Andhrastore.india@gmail.com",
    openingHours: "Mo-Su 10:00-22:00",
    url: SITE_URL,
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Hi Andhra Store!%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    // This form intercepts native submission (preventDefault) and redirects
    // to WhatsApp, so GTM's built-in form-submission auto-listener never
    // sees it fire — this explicit push is the only way this lead gets
    // tracked at all.
    pushGenerateLead('contact_form');
    window.open(`https://wa.me/918758302568?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:image"        content={`${SITE_URL}/pickle17.jpeg`} />
        <meta property="og:image:alt"    content="Andhra Store — contact us for authentic Andhra pickles, podi, snacks and sweets" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={`${SITE_URL}/pickle17.jpeg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
        />
      </Head>
      <Header />

      <section className="bg-gradient-to-br from-olive-800 via-olive-700 to-olive-900 text-white" aria-label="Contact page hero">
        <div className="container-main py-12 md:py-16 text-center">
          <p className="text-[11px] font-bold text-olive-200 uppercase tracking-[0.2em] mb-1">Get in Touch</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">Contact Us</h1>
          <p className="text-olive-200 text-sm max-w-lg mx-auto leading-relaxed">
            We&apos;d love to hear from you! Whether you have questions about our products, want to place a bulk order, or simply need assistance — our team is here to help seven days a week.
          </p>
        </div>
      </section>

      <section className="bg-gray-50/50" aria-labelledby="contact-details-heading">
        <div className="container-main py-10 md:py-14">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-5 bg-olive-600 rounded-full" />
                  <h2 id="contact-details-heading" className="text-xl font-heading font-bold text-gray-900">Contact Details</h2>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                          item.color === 'brand'
                            ? 'bg-brand-50 border border-brand-100'
                            : 'bg-olive-50 border border-olive-100'
                        }`}>
                          <Icon size={18} className={item.color === 'brand' ? 'text-brand-600' : 'text-olive-600'} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h3>
                          {item.lines.map((line, j) => (
                            <p key={j} className="text-sm text-gray-500">{line}</p>
                          ))}
                          {item.sub && (
                            <p className="text-[11px] text-brand-500 font-semibold uppercase tracking-wider mt-1">{item.sub}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-40 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={24} className="mx-auto text-gray-300 mb-2" aria-hidden="true" />
                    <p className="text-xs text-gray-400">Nani Daman, Daman &amp; Diu</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-1">Send us a Message</h2>
                <p className="text-sm text-gray-500 mb-6">We usually respond within a few hours. For urgent orders, please WhatsApp us directly.</p>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Arjun Sharma"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-olive-200 focus:border-olive-400 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-olive-200 focus:border-olive-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="arjun@example.com"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-olive-200 focus:border-olive-400 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Your Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Namaste! I would like to inquire about..."
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-olive-200 focus:border-olive-400 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${
                      submitted
                        ? 'bg-green-600 text-white'
                        : 'bg-olive-700 text-white hover:bg-olive-800 hover:shadow-md active:scale-[0.98]'
                    }`}
                  >
                    {submitted ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={15} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
