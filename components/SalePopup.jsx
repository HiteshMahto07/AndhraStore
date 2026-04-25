import { useState, useEffect } from 'react';
import { Tag, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SalePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRendered(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Unmount after exit animation fully plays
  useEffect(() => {
    if (!isVisible && isRendered) {
      const t = setTimeout(() => setIsRendered(false), 850);
      return () => clearTimeout(t);
    }
  }, [isVisible, isRendered]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed z-[100] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-bottom-right
        bottom-3 right-3 sm:bottom-4 sm:right-4
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-50'}`}
    >
      <div className="relative group overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60 p-4 w-[280px] sm:w-[340px] md:w-[380px]">
        {/* Glow */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-olive-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-800 transition-colors z-10 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
          aria-label="Close offer"
        >
          <X size={14} strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-3 relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl p-2.5 shadow-lg shadow-brand-500/30">
            <Tag size={20} className="text-white" />
          </div>

          <div className="flex-1 pr-4">
            <h4 className="font-heading font-bold text-gray-900 text-base leading-tight mb-0.5">
              Secret Sale Unlocked!
            </h4>
            <p className="text-gray-600 text-xs mb-2.5 leading-relaxed">
              Get <span className="font-bold text-brand-600">20% off</span> your first order with code{' '}
              <span className="font-mono bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200 font-bold text-[11px]">SPICY20</span>
            </p>
            <Link href="/pickle" className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 group/link transition-colors">
              Shop Now
              <ChevronRight size={14} className="ml-0.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
