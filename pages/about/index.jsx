import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative h-48 sm:h-56 overflow-hidden">
        <img src="/pickle17.jpeg" alt="About us" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="container-main relative z-10 h-full flex flex-col justify-end pb-6">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-300 uppercase mb-1">About Us</p>
          <h1 className="text-3xl sm:text-4xl font-heading text-white">Our Story</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad bg-white">
        <div className="container-main space-y-12 md:space-y-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src="/pickle17.jpeg" alt="Our Journey" className="w-full h-56 sm:h-72 lg:h-[360px] object-cover" />
            </div>
            <div>
              <p className="badge-orange mb-2">How It Began</p>
              <h2 className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">From East Godavari to Your Home</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>My love for pickles led me to East Godavari, Andhra Pradesh, where non-vegetarian pickle is part of every daily meal.</p>
                <p>I tasted the delicious non-veg pickle with rice, and the flavor became stuck in my taste buds. That&apos;s when the idea was born — to bring these authentic recipes to your dining table.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <p className="badge-orange mb-2">Our Mission</p>
              <h2 className="text-2xl sm:text-3xl font-heading text-gray-900 mb-4">Authentic Recipes, Unmatched Quality</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>We combine Telugu heritage with expertise in pickling to create flavors that transport you to the heart of Andhra Pradesh.</p>
                <p>Our pickles are crafted using time-honored recipes passed down through generations, with unwavering commitment to freshness and quality.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img src="/chicken-1.jpeg" alt="Our Process" className="w-full h-56 sm:h-72 lg:h-[360px] object-cover" />
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
            {[
              { icon: '🫙', title: 'Handmade', desc: 'Every jar crafted with traditional recipes and love.' },
              { icon: '🌿', title: 'No Preservatives', desc: 'Only natural spices and cold-pressed oils.' },
              { icon: '🚚', title: 'Pan-India Delivery', desc: 'Fresh pickles, shipped safely everywhere.' },
              { icon: '❤️', title: 'Made in Andhra', desc: 'Authentic Telugu heritage in every bite.' },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-2xl">{v.icon}</span>
                <h3 className="font-heading text-sm text-gray-800 mt-2.5 mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-10 md:py-12">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-heading text-white mb-2">Ready to taste tradition?</h2>
          <p className="text-white/70 text-sm max-w-sm mx-auto mb-5">Order now and experience authentic Andhra pickles delivered to your doorstep.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/home" className="inline-flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow">
              Shop Now →
            </Link>
            <Link href="https://wa.me/918758302568" target="_blank"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
              WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}