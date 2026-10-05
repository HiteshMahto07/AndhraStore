import Link from 'next/link';
import Image from 'next/image';
import { TYPE_TO_SLUG } from '@/lib/seo';

export default function CategoryCard({ name, image, imageAlt, type }) {
  return (
    <Link href={`/pickles/${TYPE_TO_SLUG[type]}`} aria-label={`Browse ${name} pickles`} className="group block w-[132px] flex-none text-center sm:w-auto">
      <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[4.5rem_4.5rem_1.25rem_1.25rem] bg-[#efe6d5] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <Image src={image} alt={imageAlt || `${name} pickle - authentic Andhra style`} fill sizes="(max-width: 639px) 132px, 16vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-800 transition-colors group-hover:text-brand-600">{name}</p>
      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-gray-400">Shop now</span>
    </Link>
  );
}
