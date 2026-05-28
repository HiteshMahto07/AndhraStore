/**
 * ProductCard.jsx
 *
 * Used on the Home page (best-sellers, veg collection) and anywhere
 * a compact product tile is needed.
 *
 * Props:
 *   name      — product display name
 *   image     — image path
 *   price     — base 250g price (number)
 *   type      — product type key ("Chicken", "Mango", etc.)
 *   badge     — optional badge string ("BEST SELLER" | "PREMIUM" | falsy)
 *   showCart  — when true, renders a quick-add button alongside "View & Order"
 *               defaults to false so existing usages are unchanged
 */

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { TYPE_TO_SLUG } from '@/lib/seo';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ name, image, price, type, badge, showCart = false }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleQuickAdd = (e) => {
        // Prevent the parent <Link> from navigating when the button is clicked
        e.preventDefault();
        e.stopPropagation();

        // Quick-add always uses 250g (the base / most common variant).
        // The user can adjust weight + qty in the cart drawer.
        addToCart({
            id         : `${type}-250`,
            type,
            name,
            image,
            weight     : '250',
            weightLabel: '250g',
            unitPrice  : price,
            qty        : 1,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <Link href={`/pickles/${TYPE_TO_SLUG[type]}`} aria-label={`View ${name} details`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {badge && (
                        <span className={`absolute top-2 left-2 z-10 badge ${badge === 'BEST SELLER' ? 'badge-orange' :
                                badge === 'PREMIUM' ? 'badge-dark' : 'badge-green'
                            }`}>
                            {badge}
                        </span>
                    )}
                    <Image
                        src={image}
                        alt={`${name} — authentic Andhra pickle, handcrafted with traditional spices`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                <Link href={`/pickles/${TYPE_TO_SLUG[type]}`}>
                    <h3 className="text-sm font-semibold text-gray-800 hover:text-brand-600 transition-colors truncate">{name}</h3>
                </Link>

                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="text-base font-bold text-gray-900">₹{price}</span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{Math.round(price * 1.2)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">20% OFF</span>
                </div>

                {/* Bottom CTA — single "View & Order" link by default,
                    or side-by-side buttons when showCart=true */}
                {showCart ? (
                    <div className="mt-3 flex gap-2">
                        {/* Quick add — 250g, qty 1, opens cart drawer */}
                        <button
                            onClick={handleQuickAdd}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                added
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.97]'
                            }`}
                            aria-label={added ? `${name} added to cart` : `Quick add ${name} to cart`}
                        >
                            {added ? (
                                <>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added!
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add
                                </>
                            )}
                        </button>

                        {/* View details */}
                        <Link
                            href={`/pickles/${TYPE_TO_SLUG[type]}`}
                            className="flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-semibold bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-200"
                            aria-label={`View ${name} details`}
                        >
                            View
                        </Link>
                    </div>
                ) : (
                    /* Default: single "View & Order" link — original design */
                    <Link href={`/pickles/${TYPE_TO_SLUG[type]}`}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all duration-200">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286m5.98-.286h9m-9 0a3.001 3.001 0 01-2.4-1.2M16.5 14.25a3 3 0 105.98.286m-5.98-.286h-9m9 0a3 3 0 012.4-1.2M4.575 6.75h14.85c.637 0 1.122.57.999 1.192l-.893 4.465a1.125 1.125 0 01-1.1.893H6.483" />
                        </svg>
                        View &amp; Order
                    </Link>
                )}
            </div>
        </div>
    );
}
