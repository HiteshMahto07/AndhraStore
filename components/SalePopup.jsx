import { useState, useEffect } from 'react';
import { Tag, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SalePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Delay appearance slightly for a better pop effect
    const timer = setTimeout(() => {
      setIsRendered(true);
      // Small delay before making it visible to allow browser to render DOM node first for transition
      setTimeout(() => setIsVisible(true), 50);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-[100] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] transform origin-bottom-right ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-50'
      }`}
    >
      <div className="relative group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/60 p-5 w-[320px] md:w-[380px]">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/30 transition-all duration-500 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-olive-500/20 rounded-full blur-3xl group-hover:bg-olive-500/30 transition-all duration-500 pointer-events-none"></div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors z-10 bg-white/40 hover:bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
          aria-label="Close offer"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-4 relative z-10">
          <div className="flex-shrink-0 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl p-3 shadow-lg shadow-brand-500/30 transform group-hover:-rotate-6 transition-transform duration-300">
            <Tag size={24} className="text-white" />
          </div>
          
          <div className="flex-1 pr-6 cursor-default">
            <h4 className="font-heading font-bold text-gray-900 text-lg leading-tight mb-1">
              Secret Sale Unlocked!
            </h4>
            <p className="text-gray-600 text-sm mb-3">
              Get <span className="font-bold text-brand-600">20% off</span> your first order of authentic pickles with code <span className="font-mono bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200 font-bold inline-block mt-1">SPICY20</span>
            </p>
            
            <Link href="/pickle" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 group/link transition-colors focus:outline-none">
              Shop Now 
              <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
