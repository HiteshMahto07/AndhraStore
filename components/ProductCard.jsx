import Link from 'next/link';

export default function ProductCard({ name, image, price, type, badge, showCart = false }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <Link href={{ pathname: '/pickleinfo', query: { type } }} aria-label={`View ${name} details`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {badge && (
                        <span className={`absolute top-2 left-2 z-10 badge ${badge === 'BEST SELLER' ? 'badge-orange' :
                                badge === 'PREMIUM' ? 'badge-dark' : 'badge-green'
                            }`}>
                            {badge}
                        </span>
                    )}
                    <img
                        src={image}
                        alt={`${name} — authentic Andhra pickle, handcrafted with traditional spices`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={300}
                        height={300}
                        loading="lazy"
                    />
                </div>
            </Link>

            <div className="p-3 sm:p-3.5">
                <div className="flex items-center gap-1 mb-1.5" aria-label="4.5 out of 5 stars">
                    <div className="flex gap-px">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400">(120)</span>
                </div>

                <Link href={{ pathname: '/pickleinfo', query: { type } }}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-brand-600 transition-colors truncate">{name}</h3>
                </Link>

                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="text-base font-bold text-gray-900">₹{price}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{Math.round(price * 1.2)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">20% OFF</span>
                </div>

                <Link href={{ pathname: '/pickleinfo', query: { type } }}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286m5.98-.286h9m-9 0a3.001 3.001 0 01-2.4-1.2M16.5 14.25a3 3 0 105.98.286m-5.98-.286h-9m9 0a3 3 0 012.4-1.2M4.575 6.75h14.85c.637 0 1.122.57.999 1.192l-.893 4.465a1.125 1.125 0 01-1.1.893H6.483" />
                    </svg>
                    View &amp; Order
                </Link>
            </div>
        </div>
    );
}
