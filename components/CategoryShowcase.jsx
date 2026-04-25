import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './ProductCard';

export default function CategoryShowcase({ title, bgImage, href, products }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Category Banner (Left side) */}
      <div className="lg:w-[28%] xl:w-1/4 relative rounded-2xl overflow-hidden min-h-[200px] lg:min-h-[460px] group flex-shrink-0">
        <Image 
          src={bgImage} 
          alt={title} 
          fill
          sizes="(max-width: 1024px) 100vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
          <div className="bg-gray-900/95 self-start px-4 py-2.5 mb-4 border-l-4 border-brand-500">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">{title}</h2>
          </div>
          <Link href={href} className="inline-flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest hover:text-brand-400 transition-colors">
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
      
      {/* Products Grid (Right side) */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {products.slice(0, 6).map((p) => <ProductCard key={p.type} {...p} />)}
      </div>
    </div>
  );
}
