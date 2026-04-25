import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { User, LogOut, ChevronDown, ShoppingCart, X, Home, Package, Cookie, Info, Phone, ChevronRight, Search } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import LoginModal from '@/components/LoginModal';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import PickleType from '@/data/pickles.json';

const navLinks = [
  { label: 'Home', href: '/home', icon: Home },
  {
    label: 'Shop', href: '/pickle', icon: Package, dropdown: [
      { label: 'All Products', href: '/pickle' },
      { label: 'Veg Pickles', href: '/pickle?type=veg' },
      { label: 'Non-Veg', href: '/pickle?type=non-veg' },
      { label: 'Podi & Masala', href: '/pickle?type=podi' },
      { label: 'Traditional Sweets', href: '/pickle?type=sweets' },
      { label: 'Authentic Snacks', href: '/pickle?type=snacks' },
      { label: 'Viral Products', href: '/pickle?type=viral' },
    ]
  },
  { label: 'Track Order', href: '/track', icon: Package },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [picklesOpen, setPicklesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchRefDesktop = useRef(null);
  const searchRefMobile = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { cartCount } = useCart();
  const { user, isLoaded, logout } = useAuth();

  // Handle Live Auto-Suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = PickleType.filter(p => 
        p.name.toLowerCase().includes(q) || (p.cat && p.cat.toLowerCase().includes(q))
      ).slice(0, 5); // Limit to top 5 hits
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Click outside to close descriptions
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRefDesktop.current && !searchRefDesktop.current.contains(e.target)) setShowSuggestions(false);
      if (searchRefMobile.current && !searchRefMobile.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/pickle?search=${encodeURIComponent(searchQuery.trim())}`);
      if (mobileOpen) closeMobileMenu();
    }
  };

  const handleSuggestionClick = (type) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(`/pickleinfo?type=${type}`);
    if (mobileOpen) closeMobileMenu();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPicklesOpen(false);
    if (mobileOpen) closeMobileMenu();
  }, [router.asPath]);

  // Helper to check active state correctly distinguishing query params
  const isNavActive = (href) => {
    if (!href) return false;
    
    // Parent Shop tab should remain active anywhere within /pickle path
    if (href === '/pickle') {
      return router.pathname === '/pickle';
    }

    if (href.includes('?')) {
      return router.asPath === href;
    }
    return router.pathname === href;
  };

  // Animate mobile menu open/close
  const openMobileMenu = () => {
    setMobileOpen(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => setMobileVisible(true)));
  };

  const closeMobileMenu = () => {
    setMobileVisible(false);
    setTimeout(() => {
      setMobileOpen(false);
      document.body.style.overflow = '';
    }, 350);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-olive-700 text-white text-center py-1.5 text-[11px] font-medium tracking-wide">
        🚚 Free Delivery on Orders Above ₹500 &nbsp;|&nbsp; 📞 8758302568
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container-main flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.jpeg" alt="Andhra Store" className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100" />
            <div className="leading-tight">
              <span className="text-base font-bold text-gray-900">Andhra</span>
              <span className="text-base font-bold text-brand-500">Store</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.dropdown && setDropdownOpen(true)}
                onMouseLeave={() => link.dropdown && setDropdownOpen(false)}>
                <Link href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                    isNavActive(link.href)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                  {link.label}
                  {link.dropdown && (
                    <svg className="inline w-3.5 h-3.5 ml-0.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.dropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-100 rounded-lg shadow-xl py-1.5 min-w-[160px] z-50">
                    {link.dropdown.map((d) => (
                      <Link key={d.label} href={d.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search — desktop */}
            <div className="hidden lg:block relative mr-1 xl:mr-3" ref={searchRefDesktop}>
              <form onSubmit={handleSearch} className="flex items-center relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 xl:w-56 pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all shadow-sm"
                />
                <Search size={14} className="absolute left-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
              </form>
              
              {/* Dropdown Predictions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => handleSuggestionClick(s.type)}
                      className="w-full text-left px-3 py-2 hover:bg-brand-50 hover:text-brand-700 transition flex items-center gap-2.5">
                      <img src={s.image[0]?.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm" alt={s.name} />
                      <div className="truncate flex-1">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight mb-0.5">{s.name}</p>
                        <p className="text-[10px] font-extrabold text-brand-600 bg-brand-50 inline-block px-1.5 rounded-sm">₹{s.amount}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              <span className={`absolute -top-0.5 -right-0.5 text-gray-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors ${cartCount > 0 ? 'bg-brand-500' : 'bg-gray-300 text-white'}`}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </button>

            {/* User — desktop */}
            {isLoaded && (
              <>
                {user ? (
                  <div className="relative hidden sm:block" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-500 text-gray-900 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {user.name[0].toUpperCase()}
                      </div>
                      {user.name.split(' ')[0]}
                      <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[180px] z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <User size={14} />
                    Login
                  </button>
                )}
              </>
            )}

            {/* WhatsApp — desktop */}
            <Link href="https://wa.me/918758302568" target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 bg-green-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={mobileOpen ? closeMobileMenu : openMobileMenu}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Full-Screen Mobile Menu ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-350 ${mobileVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMobileMenu}
          />

          {/* Drawer */}
          <div className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-[340px] bg-white flex flex-col shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Menu Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpeg" alt="Andhra Store" className="h-8 w-8 rounded-full object-cover" />
                <div className="leading-tight">
                  <span className="text-sm font-bold text-gray-900">Andhra</span>
                  <span className="text-sm font-bold text-brand-500">Store</span>
                </div>
              </div>
              <button
                onClick={closeMobileMenu}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* User greeting */}
            {isLoaded && (
              <div className="px-5 py-4 border-b border-gray-100">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-gray-900 flex items-center justify-center text-base font-bold">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="flex items-center gap-1 text-xs text-red-500 font-semibold bg-red-50 px-2.5 py-1.5 rounded-lg"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { closeMobileMenu(); setTimeout(() => setLoginOpen(true), 400); }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-gray-900 py-3 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
                  >
                    <User size={16} /> Login / Sign Up
                  </button>
                )}
              </div>
            )}

            {/* Search — mobile */}
            <div className="px-4 py-3 border-b border-gray-100 relative z-30" ref={searchRefMobile}>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all shadow-sm"
                />
                <Search size={16} className="absolute flex-shrink-0 left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
              </form>
              
              {/* Mobile Predictions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-14 left-4 right-4 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => handleSuggestionClick(s.type)}
                      className="w-full text-left px-3 py-2.5 hover:bg-brand-50 hover:text-brand-700 transition flex items-center gap-3">
                      <img src={s.image[0]?.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm" alt={s.name} />
                      <div className="truncate flex-1">
                        <p className="text-sm font-bold text-gray-800 truncate leading-tight mb-0.5">{s.name}</p>
                        <p className="text-[11px] font-extrabold text-brand-600 bg-brand-50 inline-block px-1.5 rounded-sm">₹{s.amount}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isNavActive(link.href);
                if (link.dropdown) {
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setPicklesOpen(!picklesOpen)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <Icon size={18} className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                        <span className="flex-1 text-left">{link.label}</span>
                        <ChevronRight size={16} className={`transition-transform ${picklesOpen ? 'rotate-90' : ''} text-gray-400`} />
                      </button>
                      {picklesOpen && (
                        <div className="ml-10 mt-1 space-y-1">
                          {link.dropdown.map((d) => (
                            <Link key={d.label} href={d.href}
                              className="block px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                              {d.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={link.label} href={link.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'}`}>
                    <Icon size={18} className={isActive ? 'text-brand-500' : 'text-gray-400'} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="px-5 py-5 border-t border-gray-100 space-y-3">
              <Link
                href="https://wa.me/918758302568"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order via WhatsApp
              </Link>
              <p className="text-center text-[11px] text-gray-400">📞 8758302568 &nbsp;|&nbsp; 8799114169</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}