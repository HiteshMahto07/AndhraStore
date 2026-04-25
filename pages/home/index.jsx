import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import SectionHeading from '@/components/SectionHeading';

const categories = [
  { name: 'Chicken', image: '/chicken-1.jpeg', type: 'Chicken' },
  { name: 'Mango', image: '/mango-1.jpeg', type: 'Mango' },
  { name: 'Prawns', image: '/prawns-1.jpeg', type: 'Prawns' },
  { name: 'Ginger', image: '/ginger-1.jpeg', type: 'Ginger' },
  { name: 'Garlic', image: '/garlic-1.jpeg', type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', type: 'RedChilli' },
];

const bestSellers = [
  { name: 'Chicken Pickle', image: '/chicken-1.jpeg', price: 300, type: 'Chicken', badge: 'BEST SELLER' },
  { name: 'Meat Pickle', image: '/mutton-1.jpeg', price: 350, type: 'Meat', badge: 'PREMIUM' },
  { name: 'Prawns Pickle', image: '/prawns-1.jpeg', price: 350, type: 'Prawns' },
  { name: 'Fish Pickle', image: '/fish-2.jpeg', price: 200, type: 'Fish' },
];

const vegPickles = [
  { name: 'Ginger Pickle', image: '/ginger-1.jpeg', price: 200, type: 'Ginger' },
  { name: 'Mango Pickle', image: '/mango-1.jpeg', price: 200, type: 'Mango' },
  { name: 'Garlic Pickle', image: '/garlic-1.jpeg', price: 200, type: 'Garlic' },
  { name: 'Red Chilli', image: '/redchilli-1.jpeg', price: 200, type: 'RedChilli' },
  { name: 'Gongura Pickle', image: '/gongura-1.jpeg', price: 200, type: 'Gongura' },
  { name: 'Tomato Pickle', image: '/tomato-1.jpeg', price: 200, type: 'Tomato' },
  { name: 'Lemon Pickle', image: '/lemon-1.jpeg', price: 200, type: 'Lemon' },
  { name: 'Amla Pickle', image: '/amla-1.jpeg', price: 200, type: 'Amla' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />

      {/* Trust Bar */}
      <div className="bg-olive-700 py-3">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🫙', text: 'Handmade', sub: 'Traditional recipes' },
            { icon: '🌿', text: 'No Preservatives', sub: 'Pure & natural' },
            { icon: '🚚', text: 'Pan-India Delivery', sub: 'Free above ₹500' },
            { icon: '⭐', text: '4.9/5 Rating', sub: '500+ happy customers' },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2.5 text-white">
              <span className="text-lg">{t.icon}</span>
              <div>
                <p className="text-xs font-semibold">{t.text}</p>
                <p className="text-[10px] text-white/60">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <SectionHeading label="Categories" title="Shop by Pickle Type" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((c) => <CategoryCard key={c.type} {...c} />)}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-pad bg-cream">
        <div className="container-main">
          <SectionHeading
            label="Best Sellers"
            title="Our Most Popular Pickles"
            description="Loved by 500+ customers across India."
            actionHref="/pickle?type=non-veg"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      {/* Full-width Banner */}
      <section className="relative h-48 sm:h-56 overflow-hidden">
        <img src="/pickle17.jpeg" alt="Fresh pickles" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40 flex items-center">
          <div className="container-main">
            <h2 className="text-2xl sm:text-3xl font-heading text-white mb-1">Freshly Made, Weekly</h2>
            <p className="text-sm text-white/70 max-w-md mb-4">Every batch is prepared fresh using hand-pounded spices and cold-pressed oils.</p>
            <Link href="https://wa.me/918758302568" target="_blank" className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order via WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Veg Pickles */}
      <section className="section-pad bg-white">
        <div className="container-main">
          <SectionHeading
            label="Veg Pickles"
            title="Vegetarian Collection"
            actionHref="/pickle?type=veg"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {vegPickles.map((p) => <ProductCard key={p.type} {...p} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-cream">
        <div className="container-main">
          <SectionHeading label="Reviews" title="What Our Customers Say" />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Priya K.', loc: 'Hyderabad', text: 'The chicken pickle is absolutely divine! Tastes just like my grandmother\'s recipe.' },
              { name: 'Rajesh M.', loc: 'Bangalore', text: 'Best mango pickle I\'ve ever had. The spice level is perfect and quality outstanding.' },
              { name: 'Sneha D.', loc: 'Mumbai', text: 'Ordered the combo pack — every single variant was delicious. Fresh and authentic!' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-[11px] text-gray-400">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}