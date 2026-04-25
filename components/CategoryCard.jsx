import Link from 'next/link';
import Image from 'next/image';

export default function CategoryCard({ name, image, href, icon }) {
    return (
        <Link href={href || '#'}>
            <div className="group text-center cursor-pointer active:scale-95 transition-transform duration-150">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cream border-2 border-transparent group-hover:border-brand-300 group-active:border-brand-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12vw, 160px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                    {/* Emoji icon badge */}
                    {icon && (
                        <span className="absolute top-1.5 right-1.5 text-base leading-none drop-shadow-sm z-10">
                            {icon}
                        </span>
                    )}

                    {/* Tap overlay on mobile */}
                    <div className="absolute inset-0 bg-brand-500/0 group-active:bg-brand-500/10 transition-colors duration-150 rounded-xl" />
                </div>
                <p className="mt-2 text-[10px] sm:text-xs font-semibold text-gray-700 group-hover:text-brand-600 transition-colors leading-tight px-0.5">{name}</p>
            </div>
        </Link>
    );
}
