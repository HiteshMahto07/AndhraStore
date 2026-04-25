import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ name, image, price, type, badge, showCart = false }) {
    const { addToCart, cartItems } = useCart();
    const inCart = cartItems.some(i => i.type === type);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ name, image, price, type });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:border-gray-200 active:scale-[0.98] transition-all duration-300">
            <Link href={{ pathname: '/pickleinfo', query: { type } }}>
                {/* Image */}
                <div className="relative h-32 sm:h-auto sm:aspect-square overflow-hidden bg-gray-50">
                    {badge && (
                        <span className={`absolute top-2 left-2 z-20 badge ${badge === 'BEST SELLER' ? 'badge-orange' :
                                badge === 'PREMIUM' ? 'badge-dark' : 'badge-green'
                            }`}>
                            {badge}
                        </span>
                    )}
                    <Image 
                        src={image} 
                        alt={name} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-107 transition-transform duration-500" 
                    />
                    {/* Subtle shimmer overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </Link>

            {/* Info */}
            <div className="p-2.5 sm:p-3.5">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex gap-px">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400">(120)</span>
                </div>

                <Link href={{ pathname: '/pickleinfo', query: { type } }}>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-brand-600 transition-colors truncate leading-snug">{name}</h3>
                </Link>

                <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-bold text-gray-900">₹{price}</span>
                    <span className="text-[11px] text-gray-400 line-through">₹{Math.round(price * 1.2)}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">20% OFF</span>
                </div>

                {/* Action buttons — slide up on group-hover */}
                <div className="mt-2.5 flex gap-1.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 active:scale-95 border ${inCart
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-brand-50 border-brand-200 text-brand-600 hover:bg-brand-500 hover:border-brand-500 hover:text-white'
                        }`}
                    >
                        {inCart ? (
                            <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                Added
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Add
                            </>
                        )}
                    </button>

                    {/* View */}
                    <Link href={{ pathname: '/pickleinfo', query: { type } }}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 active:scale-95">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
