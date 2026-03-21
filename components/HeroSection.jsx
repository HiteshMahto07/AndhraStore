import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-cream">
            <div className="container-main">
                <div className="grid lg:grid-cols-2 gap-6 items-center py-8 md:py-12 lg:py-14">
                    {/* Text */}
                    <div className="space-y-5 animate-fade-up max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-olive-100 text-olive-700 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 bg-olive-500 rounded-full"></span>
                            100% Authentic & Handmade
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-gray-900 leading-[1.15]">
                            Authentic Andhra <br className="hidden sm:block" />
                            <span className="text-brand-500">Pickles</span> Delivered <br className="hidden sm:block" />
                            To Your Door
                        </h1>

                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                            Traditional recipes from East Godavari. Hand-pounded spices, cold-pressed oils,
                            and zero preservatives — just like grandma used to make.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-1">
                            <Link href="/pickle?type=non-veg" className="btn-primary">
                                Shop Non-Veg
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link href="/pickle?type=veg" className="btn-outline">
                                Shop Veg
                            </Link>
                        </div>

                        {/* Trust strip */}
                        <div className="flex items-center gap-6 pt-2">
                            {[
                                { icon: '⭐', text: '4.9 Rating' },
                                { icon: '📦', text: '500+ Orders' },
                                { icon: '🌿', text: 'No Preservatives' },
                            ].map((t) => (
                                <div key={t.text} className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <span>{t.icon}</span>
                                    <span className="text-xs font-medium">{t.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
                            <img src="/chicken-1.jpeg" alt="Andhra Chicken Pickle" className="w-full h-[300px] sm:h-[380px] lg:h-[440px] object-cover" />
                        </div>
                        {/* Floating price card */}
                        <div className="absolute -bottom-3 -left-2 sm:left-4 bg-white rounded-xl shadow-xl px-4 py-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Best Seller</p>
                            <p className="text-sm font-bold text-gray-900">Chicken Pickle</p>
                            <p className="text-brand-600 font-bold text-sm">From ₹300</p>
                        </div>
                        {/* Floating badge */}
                        <div className="absolute top-4 right-4 bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                            🔥 Trending
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
