import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    image: '/images/Non Veg Pickle/Chicken Pickle.png',
    alt: 'Andhra Chicken Pickle',
    label: 'Best Seller',
    name: 'Chicken Pickle',
    price: '₹300',
    badge: '🔥 Trending',
  },
  {
    image: '/images/Non Veg Pickle/Fish Pickle.png',
    alt: 'Andhra Fish Pickle',
    label: 'Fan Favourite',
    name: 'Fish Pickle',
    price: '₹200',
    badge: '🐟 Popular',
  },
  {
    image: '/images/Non Veg Pickle/Mutton Pickle.png',
    alt: 'Andhra Mutton Pickle',
    label: 'Premium Pick',
    name: 'Mutton Pickle',
    price: '₹350',
    badge: '👑 Premium',
  },
  {
    image: '/images/Veg Pickle/Mango Pickle 1 (2).png',
    alt: 'Andhra Mango Pickle',
    label: 'Veg Special',
    name: 'Mango Pickle',
    price: '₹200',
    badge: '🥭 Classic',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* ──── MOBILE LAYOUT ──── */}
      <div className="block lg:hidden">
        {/* Hero Image Carousel — full width on mobile */}
        <div className="relative">
          <div className="relative overflow-hidden" style={{ height: '56vw', minHeight: '200px', maxHeight: '300px' }}>
            {heroSlides.map((s, i) => (
              <Image
                key={i}
                src={s.image}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-500 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
            ))}
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#fdf6ec]/90 via-transparent to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 right-3 z-30 bg-brand-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow">
              {slide.badge}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1.5 bg-brand-500' : 'w-1.5 h-1.5 bg-gray-400/60'}`}
                />
              ))}
            </div>
          </div>

          {/* Prev/Next on mobile */}
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center text-gray-700">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center text-gray-700">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Text Content — below carousel on mobile */}
        <div className="px-4 pt-4 pb-6 space-y-3 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 bg-olive-100 text-olive-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-olive-500 rounded-full"></span>
            100% Authentic &amp; Handmade
          </div>
          <h1 className="text-2xl font-heading text-gray-900 leading-tight">
            Authentic Andhra <span className="text-brand-500">Pickles</span> Delivered To Your Door
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Traditional recipes from East Godavari. Hand-pounded spices &amp; zero preservatives.
          </p>

          <div className="flex gap-2.5 pt-1">
            <Link href="/pickle?type=non-veg" className="flex-1 flex items-center justify-center gap-1.5 bg-brand-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 active:scale-95 transition-all shadow-sm shadow-brand-500/30">
              Shop Non-Veg
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link href="/pickle?type=veg" className="flex-1 flex items-center justify-center gap-1.5 border-2 border-brand-500 text-brand-600 px-4 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-all">
              Shop Veg
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            {[{ icon: '⭐', text: '4.9 Rating' }, { icon: '📦', text: '500+ Orders' }, { icon: '🌿', text: 'No Preservatives' }].map((t) => (
              <div key={t.text} className="flex items-center gap-1 text-xs text-gray-500 bg-white rounded-full px-2.5 py-1 shadow-sm border border-gray-100">
                <span>{t.icon}</span>
                <span className="font-medium">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──── DESKTOP LAYOUT ──── */}
      <div className="hidden lg:block container-main">
        <div className="grid lg:grid-cols-2 gap-6 items-center py-14">
          {/* Text */}
          <div className="space-y-5 animate-fade-up max-w-lg">
            <div className="inline-flex items-center gap-2 bg-olive-100 text-olive-700 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-olive-500 rounded-full"></span>
              100% Authentic &amp; Handmade
            </div>
            <h1 className="text-5xl font-heading text-gray-900 leading-[1.15]">
              Authentic Andhra <br />
              <span className="text-brand-500">Pickles</span> Delivered <br />
              To Your Door
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Traditional recipes from East Godavari. Hand-pounded spices, cold-pressed oils,
              and zero preservatives — just like grandma used to make.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/pickle?type=non-veg" className="btn-primary">
                Shop Non-Veg
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/pickle?type=veg" className="btn-outline">Shop Veg</Link>
            </div>
            <div className="flex items-center gap-6 pt-2">
              {[{ icon: '⭐', text: '4.9 Rating' }, { icon: '📦', text: '500+ Orders' }, { icon: '🌿', text: 'No Preservatives' }].map((t) => (
                <div key={t.text} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span>{t.icon}</span>
                  <span className="text-xs font-medium">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10 relative">
              {heroSlides.map((s, i) => (
                <Image 
                  key={i} 
                  src={s.image} 
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-opacity duration-500 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                />
              ))}
              <div className="h-[440px]" />
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"><ChevronRight size={16} /></button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`} />
                ))}
              </div>
              <div className="absolute top-4 right-4 z-20 bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                {slide.badge}
              </div>
            </div>
            <div className="absolute -bottom-3 left-4 z-30 bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{slide.label}</p>
              <p className="text-sm font-bold text-gray-900">{slide.name}</p>
              <p className="text-brand-600 font-bold text-sm">From {slide.price}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
