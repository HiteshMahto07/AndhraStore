import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';

export default function AboutPage() {
  const values = [
    { icon: '🫙', title: 'Handmade', desc: 'Every jar crafted with traditional recipes and love.' },
    { icon: '🌿', title: 'No Preservatives', desc: 'Only natural spices and cold-pressed oils.' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'Fresh pickles, shipped safely everywhere.' },
    { icon: '❤️', title: 'Made in Andhra', desc: 'Authentic Telugu heritage in every bite.' },
  ];

  return (
    <>
      <Head>
        <title>About Us | Andhra Store</title>
        <meta name="description" content="Learn the story behind Andhra Store — authentic Andhra pickles crafted with traditional East Godavari recipes, hand-pounded spices, and zero preservatives." />
      </Head>
      <Header />

      {/* Hero */}
      <section className="relative h-52 sm:h-64 overflow-hidden">
        <Image src="/pickle17.jpeg" alt="About Andhra Store" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent" />
        <div className="container-main relative z-10 h-full flex flex-col justify-end pb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-300 uppercase mb-1 animate-fade-in">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-heading text-white animate-fade-up">Our Story</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad bg-white">
        <div className="container-main space-y-12 md:space-y-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-fade-in">
              <Image
                src="/pickle17.jpeg"
                alt="Our Journey"
                width={600}
                height={400}
                className="w-full h-56 sm:h-72 lg:h-[360px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="animate-fade-up">
              <p className="badge-orange mb-2">How It Began</p>
              <h2 className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">From East Godavari to Your Home</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>My love for pickles led me to East Godavari, Andhra Pradesh, where non-vegetarian pickle is part of every daily meal.</p>
                <p>I tasted the delicious non-veg pickle with rice, and the flavor became stuck in my taste buds. That&apos;s when the idea was born — to bring these authentic recipes to your dining table.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 animate-fade-up">
              <p className="badge-orange mb-2">Our Mission</p>
              <h2 className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">Authentic Recipes, Unmatched Quality</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>We combine Telugu heritage with expertise in pickling to create flavors that transport you to the heart of Andhra Pradesh.</p>
                <p>Our pickles are crafted using time-honored recipes passed down through generations, with unwavering commitment to freshness and quality.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-fade-in">
              <Image
                src="/images/Non Veg Pickle/Chicken Pickle.png"
                alt="Our Process"
                width={600}
                height={400}
                className="w-full h-56 sm:h-72 lg:h-[360px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-cream">
        <div className="container-main">
          <div className="text-center mb-8">
            <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.15em] mb-0.5">Our Promise</p>
            <h2 className="text-2xl sm:text-3xl font-heading text-gray-900">Why Choose Andhra Store</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:shadow-lg hover:border-brand-100 hover:-translate-y-1 transition-all duration-300"
                style={{ animation: `fadeUp 0.5s ease-out ${i * 100}ms both` }}
              >
                <span className="text-2xl">{v.icon}</span>
                <h3 className="font-heading text-sm text-gray-800 mt-2.5 mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-white pt-2 pb-16">
        <div className="container-main">
          <div className="bg-cream border border-gray-100 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="text-3xl mb-4 block" style={{ animation: 'scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>🌶️</span>
              <h2 className="text-3xl sm:text-4xl font-heading text-gray-900 mb-3 animate-fade-up">Ready to Taste Tradition?</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Experience authentic Andhra recipes, hand-pounded spices, and cold-pressed oils delivered fresh to your doorstep.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/pickle?type=veg" className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-600 active:scale-95 transition-all shadow-md shadow-brand-500/30">
                  Shop All Pickles →
                </Link>
                <Link href="https://wa.me/918758302568" target="_blank"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-700 border-2 border-green-600 px-8 py-3 rounded-xl font-bold text-sm hover:bg-green-50 active:scale-95 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp Order
                </Link>
              </div>
            </div>

            {/* Background blurs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-200/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-olive-200/40 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}