import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CartDrawer from '@/components/CartDrawer';

const navLinks = [
  { label: 'Home', href: '/home' },
  {
    label: 'Pickles', href: '/pickle?type=veg', dropdown: [
      { label: 'Veg Pickles', href: '/pickle?type=veg' },
      { label: 'Non-Veg Pickles', href: '/pickle?type=non-veg' },
    ]
  },
  { label: 'Sweets', href: '/sweets' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [router.asPath]);

  return (
    <>
      <div className="bg-olive-700 text-white text-center py-1.5 text-[11px] font-medium tracking-wide" role="banner">
        🚚 Free Delivery on Orders Above ₹500 &nbsp;|&nbsp; 📞 8758302568, 8799114169
      </div>

      <header className={`sticky top-0 z-50 transition-shadow duration-300 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="container-main flex items-center justify-between h-14 md:h-16">
          <Link href="/home" className="flex items-center gap-2" aria-label="Andhra Store — Home">
            <img
              src="/logo.jpeg"
              alt="Andhra Store logo"
              className="h-9 w-9 rounded-full object-cover"
              width={36}
              height={36}
            />
            <div className="leading-tight">
              <span className="text-base font-bold text-gray-900">Andhra</span>
              <span className="text-base font-bold text-brand-500">Store</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.dropdown && setDropdownOpen(true)}
                onMouseLeave={() => link.dropdown && setDropdownOpen(false)}>
                <Link href={link.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${router.pathname === link.href?.split('?')[0]
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}>
                  {link.label}
                  {link.dropdown && (
                    <svg className="inline w-3.5 h-3.5 ml-0.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.dropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-100 rounded-lg shadow-xl py-1.5 min-w-[160px] z-50" role="menu">
                    {link.dropdown.map((d) => (
                      <Link key={d.label} href={d.href} role="menuitem"
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Open shopping cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" aria-label="0 items in cart">0</span>
            </button>

            <Link href="https://wa.me/918758302568" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-green-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
              aria-label="Order via WhatsApp">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Order
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden border-t border-gray-100 bg-white animate-fade-in" role="navigation" aria-label="Mobile navigation">
            <div className="container-main py-3 space-y-1">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link href={link.href}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                  {link.dropdown && link.dropdown.map((d) => (
                    <Link key={d.label} href={d.href}
                      className="block pl-8 pr-3 py-2 text-sm text-gray-500 hover:text-brand-600 transition-colors">
                      {d.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}