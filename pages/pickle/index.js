import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PickleType from '@/data/pickles.json';

const allProducts = [
  { name: 'Ginger Pickle', image: '/images/Veg Pickle/Ginger Pickle 1.png', price: 200, type: 'Ginger', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Mango Pickle', image: '/images/Veg Pickle/Mango Pickle 1 (2).png', price: 200, type: 'Mango', cat: 'veg', weight: '250g', badge: 'BEST SELLER' },
  { name: 'Garlic Pickle', image: '/images/Veg Pickle/Garlic Pickle.png', price: 200, type: 'Garlic', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Red Chilli Pickle', image: '/images/Veg Pickle/Red Chilli Pickle.png', price: 200, type: 'RedChilli', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Gongura Pickle', image: '/images/Veg Pickle/Gongura Pickle.png', price: 200, type: 'Gongura', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Tomato Pickle', image: '/images/Veg Pickle/Tomato Pickle 1.png', price: 200, type: 'Tomato', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Lemon Pickle', image: '/images/Veg Pickle/Lemon Pickle.png', price: 200, type: 'Lemon', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Curry Leaves Pickle', image: '/images/Veg Pickle/Curry Leaves Pickle.jpg', price: 200, type: 'Curry', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Green Chilli Pickle', image: '/images/Veg Pickle/Green Chilli Pickle.png', price: 200, type: 'GreenChilli', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Amla Pickle', image: '/images/Veg Pickle/Amla Pickle.png', price: 200, type: 'Amla', cat: 'veg', weight: '250g', badge: '' },
  { name: 'Chicken Pickle', image: '/images/Non Veg Pickle/Chicken Pickle.png', price: 300, type: 'Chicken', cat: 'non-veg', weight: '250g', badge: 'BEST SELLER' },
  { name: 'Meat Pickle', image: '/images/Non Veg Pickle/Mutton Pickle.png', price: 350, type: 'Meat', cat: 'non-veg', weight: '250g', badge: 'PREMIUM' },
  { name: 'Prawns Pickle', image: '/images/Non Veg Pickle/Prawns Pickle.png', price: 350, type: 'Prawns', cat: 'non-veg', weight: '250g', badge: '' },
  { name: 'Fish Pickle', image: '/images/Non Veg Pickle/Fish Pickle 1.jpg', price: 200, type: 'Fish', cat: 'non-veg', weight: '250g', badge: '' },
  { name: 'Vellulli Karam Podi', image: '/images/Podi & Gun Powder Masala/Red Chilli Garlic Podi & vellulli karam podi.jfif', price: 165, type: 'VellulliPodi', cat: 'podi', weight: '250g', badge: '' },
  { name: 'Palli Karampodi', image: '/images/Podi & Gun Powder Masala/Peanut Podi.JPG', price: 160, type: 'PalliPodi', cat: 'podi', weight: '250g', badge: '' },
  { name: 'Karivepaku Karam Podi', image: '/images/Podi & Gun Powder Masala/Nala Karam Podi.JPG', price: 160, type: 'KarivepakuPodi', cat: 'podi', weight: '250g', badge: '' },
  { name: 'Kothimeera Karam Podi', image: '/images/Podi & Gun Powder Masala/Kandi Podi.jpg', price: 160, type: 'KothimeeraPodi', cat: 'podi', weight: '250g', badge: '' },
  { name: 'Chegodi', image: '/images/Andhra Special/Chegodi.jpg', price: 120, type: 'Chegodi', cat: 'snacks', weight: '250g', badge: '' },
  { name: 'Bhavnagari Gathiya', image: '/images/Snacks/Bhavnagari_Gathiya.webp', price: 150, type: 'Murukulu', cat: 'snacks', weight: '250g', badge: '' },
  { name: 'Pootharekulu', image: '/images/Andhra Special/Rice Paper Roll _Putharekulu.jpg', price: 250, type: 'Pootharekulu', cat: 'sweets', weight: '10 Sheets', badge: '' },
  { name: 'Madatha Kaja', image: '/images/Andhra Special/Madta Kaja.jpg', price: 200, type: 'Kaja', cat: 'sweets', weight: '250g', badge: '' },
  { name: 'Sunnundalu', image: '/images/Andhra Special/Sunundalu_ Urad Dal Laddu.jpg', price: 300, type: 'Sunnundalu', cat: 'sweets', weight: '250g', badge: '' },
  { name: 'Ariselu', image: '/images/Andhra Special/Ariselu-Sweet.jpg', price: 180, type: 'Ariselu', cat: 'sweets', weight: '250g', badge: '' },
  { name: 'Calcutta Pan Mukhwas', image: '/images/Viral Products/Pan Mukhwas.jpeg', price: 150, type: 'PanMukhwas', cat: 'viral', weight: '250g', badge: 'TRENDING' },
  { name: 'Rajwadi Mukhwas', image: '/images/Viral Products/Rajwadi-mukhwas.jpg', price: 180, type: 'RajwadiMukhwas', cat: 'viral', weight: '250g', badge: '' },
  { name: 'Rang Bhi Rangi', image: '/images/Viral Products/Rang Bhi Rangi Mukhwas.webp', price: 120, type: 'RangBhiRangiMukhwas', cat: 'viral', weight: '250g', badge: '' },
  { name: 'Eye Pack Warmer', image: '/images/Viral Products/Eye Pack Wamer 1.jpeg', price: 499, type: 'EyeWarmer', cat: 'viral', weight: '1 Pack', badge: '' },
  { name: 'Black Pepper Papad', image: '/images/Viral Products/Black_pepper_papad_2-removebg-preview-2.png', price: 90, type: 'BlackPepperPapad', cat: 'viral', weight: '250g', badge: '' },
  { name: 'Spring Roll Sheets', image: '/images/Viral Products/Spring Roll Sheets.jpeg', price: 140, type: 'SpringRollSheets', cat: 'viral', weight: '20 Sheets', badge: '' },
];

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Veg Pickles' },
  { value: 'non-veg', label: 'Non-Veg Pickles' },
  { value: 'podi', label: 'Podi & Masala' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'sweets', label: 'Traditional Sweets' },
  { value: 'viral', label: 'Viral Products' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

const ratings = { Chicken: 4.8, Mango: 4.9, Meat: 4.7, Garlic: 4.6, Ginger: 4.5, RedChilli: 4.4, Prawns: 4.7, Fish: 4.3, Gongura: 4.5, Tomato: 4.4, Lemon: 4.3, Amla: 4.2, Curry: 4.3, GreenChilli: 4.4 };

export default function Shop() {
  const router = useRouter();
  const { type, search } = router.query;

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sync global search queries
  useEffect(() => {
    if (search) {
      setSearchTerm(search);
      if (!type) setCategory('all');
    }
  }, [search, type]);

  useEffect(() => {
    if (['veg', 'non-veg', 'podi', 'snacks', 'sweets', 'viral'].includes(type)) {
      setCategory(type);
    } else if (!type && !search) {
      setCategory('all');
    }
  }, [type, search]);

  const filtered = useMemo(() => {
    let items = category === 'all' ? [...allProducts] : allProducts.filter(p => p.cat === category);
    switch (sort) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break;
      case 'price-desc': items.sort((a, b) => b.price - a.price); break;
      case 'name-asc': items.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return items;
  }, [category, sort]);

  const FilterPanel = ({ mobile = false }) => (
    <div className={mobile ? '' : 'sticky top-20'}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <h3 className="text-sm font-bold text-gray-800">Filters</h3>
        </div>

        {/* Category */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
          <div className="space-y-2">
            {categoryFilters.map(f => (
              <label key={f.value}
                className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                  setCategory(f.value);
                  if (mobile) setShowMobileFilter(false);
                }}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  category === f.value
                    ? 'bg-olive-600 border-olive-600'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {category === f.value && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm transition-colors ${category === f.value ? 'text-olive-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>
                  {f.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range info */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">₹200</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">₹350</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Shop All Pickles | Andhra Store</title>
        <meta name="description" content="Browse and shop authentic Andhra pickles — veg and non-veg varieties." />
      </Head>
      <Header />

      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-main py-8 md:py-10">
          <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.2em] mb-1">Our Collection</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-heading text-gray-900">Shop All Products</h1>
            {/* Sort */}
            <div className="flex items-center gap-3">
              {/* Mobile filter trigger */}
              <button onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
              </button>
              <div className="relative">
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-200 cursor-pointer transition-all">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{`Sort by: ${o.label}`}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50/50 min-h-screen">
        <div className="container-main py-8 md:py-10">
          <div className="flex gap-8">
            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block w-[220px] flex-shrink-0">
              <FilterPanel />
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-5">Showing <span className="font-semibold text-gray-700">{filtered.length}</span> products</p>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
                {filtered.map((p, idx) => {
                  const rating = ratings[p.type] || 4.5;
                  const origPrice = Math.round(p.price * 1.2);
                  const discount = Math.round(((origPrice - p.price) / origPrice) * 100);

                  return (
                    <div key={p.type}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
                      style={{ animationDelay: `${idx * 60}ms` }}>
                      <Link href={{ pathname: '/pickleinfo', query: { type: p.type } }}>
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          {p.badge && (
                            <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                              p.badge === 'BEST SELLER'
                                ? 'bg-brand-500 text-white'
                                : p.badge === 'PREMIUM'
                                ? 'bg-gray-900 text-white'
                                : 'bg-olive-500 text-white'
                            }`}>
                              {p.badge}
                            </span>
                          )}
                          <img src={p.image} alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      </Link>

                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs font-semibold text-gray-700">{rating}</span>
                        </div>

                        <Link href={{ pathname: '/pickleinfo', query: { type: p.type } }}>
                          <h3 className="text-sm font-bold text-gray-800 hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-gray-400 mb-2.5">{p.weight}</p>

                        {/* Price */}
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-lg font-extrabold text-gray-900">₹{p.price}</span>
                            <span className="text-xs text-gray-400 line-through ml-1.5">₹{origPrice}</span>
                          </div>
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{discount}% OFF</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" onClick={() => setShowMobileFilter(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel mobile />
          </div>
        </>
      )}

      <Footer />
    </>
  );
}