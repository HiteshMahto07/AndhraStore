import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { TYPE_TO_SLUG } from '@/lib/seo';
import { useCart } from '@/context/CartContext';
import { pushSelectItem } from '@/lib/analytics';

const sizes = [
  { value: '250', label: '250g', multiplier: 1 },
  { value: '500', label: '500g', multiplier: 2 },
  { value: '1', label: '1kg', multiplier: 4 },
];

export default function ProductCard({ name, image, imageAlt, price, type, badge, rating, showCart = false, listName = 'Pickles' }) {
  const { addToCart } = useCart();
  const [weight, setWeight] = useState('250');
  const [added, setAdded] = useState(false);
  const selected = sizes.find((size) => size.value === weight);
  const unitPrice = price * selected.multiplier;
  const href = `/pickles/${TYPE_TO_SLUG[type]}`;

  const handleQuickAdd = () => {
    addToCart({ id: `${type}-${weight}`, type, name, category: 'Pickles', image, weight, weightLabel: selected.label === '1kg' ? '1 Kg' : selected.label, unitPrice, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleSelect = () => pushSelectItem({ type, name, category: 'Pickles', unitPrice: price }, listName);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white shadow-[0_10px_35px_rgba(42,54,46,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(42,54,46,0.11)]">
      <Link href={href} aria-label={`View ${name} details`} onClick={handleSelect} className="relative block aspect-square overflow-hidden bg-[#f5efe4]">
        {badge && <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-olive-800 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">{badge}</span>}
        <Image src={image} alt={imageAlt || `${name} - authentic Andhra pickle`} fill sizes="(max-width: 639px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {rating && (
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-gray-500" aria-label={`${rating.rating} out of 5 from ${rating.count} reviews`}>
            <Star className="h-3 w-3 fill-current text-amber-500" aria-hidden="true" /><span className="font-semibold text-gray-700">{rating.rating}</span><span>({rating.count})</span>
          </div>
        )}
        <Link href={href} onClick={handleSelect} className="block"><h3 className="line-clamp-2 h-10 text-sm font-semibold leading-5 text-gray-900 transition-colors hover:text-brand-600 sm:text-base">{name}</h3></Link>
        <p className="mt-1 text-base font-bold text-gray-900 sm:text-lg"><span aria-hidden="true">&#8377;</span>{unitPrice}</p>
        {showCart && (
          <>
            <div className="mt-3 grid grid-cols-3 gap-1" role="group" aria-label={`Choose size for ${name}`}>
              {sizes.map((size) => (
                <button key={size.value} type="button" onClick={() => setWeight(size.value)} aria-pressed={weight === size.value} className={`min-h-8 rounded-lg border px-1 text-[10px] font-semibold transition-colors max-[400px]:min-h-11 sm:text-[11px] ${weight === size.value ? 'border-olive-700 bg-olive-700 text-white' : 'border-gray-200 text-gray-600 hover:border-olive-400'}`}>{size.label}</button>
              ))}
            </div>
            <button type="button" onClick={handleQuickAdd} className={`mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all max-[400px]:min-h-11 active:scale-[0.98] ${added ? 'bg-green-600 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'}`} aria-label={added ? `${name} added to cart` : `Add ${selected.label} ${name} to cart`}>
              {added ? 'Added to cart' : 'Add to cart'}{!added && <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
