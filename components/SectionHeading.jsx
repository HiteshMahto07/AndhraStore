import Link from 'next/link';

export default function SectionHeading({ label, title, description, actionHref, actionLabel = 'View All', id }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 md:mb-8">
            <div>
                {label && <p className="text-[11px] font-bold text-brand-500 uppercase tracking-[0.15em] mb-0.5">{label}</p>}
                <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-heading text-gray-900">{title}</h2>
                {description && <p className="text-sm text-gray-500 mt-1 max-w-lg">{description}</p>}
            </div>
            {actionHref && (
                <Link href={actionHref}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap group">
                    {actionLabel}
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            )}
        </div>
    );
}
