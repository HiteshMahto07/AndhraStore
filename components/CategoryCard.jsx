import Link from 'next/link';

export default function CategoryCard({ name, image, type }) {
    return (
        <Link href={{ pathname: '/pickleinfo', query: { type } }}>
            <div className="group text-center cursor-pointer">
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-cream border-2 border-transparent group-hover:border-brand-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="mt-2.5 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-brand-600 transition-colors">{name}</p>
            </div>
        </Link>
    );
}
